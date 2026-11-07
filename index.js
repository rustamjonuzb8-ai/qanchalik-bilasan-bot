const http = require("http");
const fs = require("fs");

// Render Web Service port ochiq bo'lishini talab qiladi
http.createServer((req, res) => res.end("OK")).listen(process.env.PORT || 3000);

if (!process.env.BOT_TOKEN) {
  console.log("BOT_TOKEN qo'yilmagan. Render > Environment ga BOT_TOKEN qo'shing.");
  return;
}

const { Telegraf, Markup } = require("telegraf");
const QUESTIONS = require("./questions");
const L = require("./logic");

const bot = new Telegraf(process.env.BOT_TOKEN);
const DB_FILE = process.env.DB_FILE || "./data.json";
const LENGTHS = [5, 7, 10];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ baza
let db = { quizzes: {}, polls: {} };
try {
  const d = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  db.quizzes = d.quizzes || {};
  db.polls = d.polls || {};
} catch (e) {}
let timer = null;
const save = () => {
  clearTimeout(timer);
  timer = setTimeout(() => fs.writeFile(DB_FILE, JSON.stringify(db), () => {}), 300);
};
setInterval(() => {
  const old = Date.now() - 2 * 24 * 3600 * 1000;
  for (const k of Object.keys(db.polls)) if (db.polls[k].t < old) delete db.polls[k];
  save();
}, 3600 * 1000);

const getQuiz = (key) => {
  const q = db.quizzes[key];
  return q && Array.isArray(q.qids) ? q : null;
};
const rid = () => Math.random().toString(36).slice(2, 8);
const nameOf = (u) => u.first_name || u.username || "Do'sting";

let ME = null;
const botName = async () => (ME ||= (await bot.telegram.getMe()).username);
const linkFor = async (key) => `https://t.me/${await botName()}?start=${key}`;

// ------------------------------------------------------------------ stikerlar
const SETS = (process.env.STICKER_SETS || "HotCherry,UtyaDuck").split(",").map((s) => s.trim()).filter(Boolean);
const EMOJIS = {
  welcome: ["👋", "😍", "🤗", "😎"],
  win: ["🔥", "🥳", "🎉", "😎", "🤩", "❤️"],
  mid: ["😅", "🙂", "😄", "👍"],
  low: ["😂", "🤨", "😢", "🙈"],
};
const FALLBACK = { welcome: "👋", win: "🎉", mid: "😅", low: "😂" };
const setCache = {};
async function sendSticker(chatId, kind) {
  for (const name of SETS) {
    try {
      if (!setCache[name]) setCache[name] = (await bot.telegram.getStickerSet(name)).stickers;
      const all = setCache[name];
      const match = all.filter((s) => EMOJIS[kind].includes(s.emoji));
      const list = match.length ? match : all;
      const s = list[Math.floor(Math.random() * list.length)];
      await bot.telegram.sendSticker(chatId, s.file_id);
      return;
    } catch (e) {}
  }
  // stiker topilmasa: bitta katta emoji (Telegram uni animatsiyali ko'rsatadi)
  await bot.telegram.sendMessage(chatId, FALLBACK[kind]).catch(() => {});
}

// ------------------------------------------------------------------ menyu
const MENU = Markup.inlineKeyboard([
  [Markup.button.callback("🎮 Test tuzish", "new")],
  [Markup.button.callback("🏆 Natijalarim", "res"), Markup.button.callback("ℹ️ Qanday o'ynaladi", "help")],
]);

const HELP =
  "ℹ️ Qanday o'ynaladi?\n\n" +
  "1️⃣ Siz o'zingiz haqingizda savollarga javob berasiz.\n" +
  "2️⃣ Bot sizga shaxsiy havola beradi, uni do'stingizga yuborasiz.\n" +
  "3️⃣ Do'stingiz sizning javoblaringizni topishga harakat qiladi (so'rovnoma shaklida).\n" +
  "4️⃣ Bot natijani foizda aytadi va sizga ham xabar yuboradi 😏\n\n" +
  "Buyruqlar: /start, /natijalar, /yordam";

const WELCOME =
  "Salom! 👋\n\n🔥 Do'stlaringiz sizni qanchalik taniydi?\n" +
  "Savollarga javob bering, havolani yuboring va foizda natijani ko'ring!";

async function put(ctx, text, kb, forceNew) {
  if (!forceNew && ctx.callbackQuery) {
    try {
      return await ctx.editMessageText(text, kb);
    } catch (e) {}
  }
  return ctx.reply(text, kb);
}

bot.start(async (ctx) => {
  const key = ctx.startPayload;
  const quiz = key && getQuiz(key);
  if (!quiz) {
    await sendSticker(ctx.chat.id, "welcome");
    return ctx.reply(WELCOME, MENU);
  }
  if (quiz.owner === ctx.from.id) {
    return ctx.reply("Bu sizning o'z testingiz 😄 Havolani do'stingizga yuboring!", await shareKb(key));
  }
  const prev = quiz.results.find((r) => r.id === ctx.from.id);
  if (prev) {
    return ctx.reply(
      `Siz bu testni allaqachon yechgansiz: ${quiz.ownerName}ni ${prev.p}% taniysiz.\n\nO'zingiz ham test tuzib ko'ring 👇`,
      MENU
    );
  }
  await sendSticker(ctx.chat.id, "welcome");
  await ctx.reply(
    `👀 ${quiz.ownerName} sizga savol yubordi:\n\n"Meni qanchalik taniysan?" 😏\n\n` +
      `${quiz.qids.length} ta savol bor. Har birida ${quiz.ownerName} nima tanlaganini toping!`
  );
  await sleep(1200);
  return sendGuessQ(ctx.telegram, ctx.from.id, key, 0);
});

bot.command("yordam", (ctx) => ctx.reply(HELP, MENU));
bot.command("natijalar", (ctx) => showResults(ctx));
bot.action("help", async (ctx) => {
  await ctx.answerCbQuery();
  return ctx.reply(HELP, MENU);
});
bot.action("res", async (ctx) => {
  await ctx.answerCbQuery();
  return showResults(ctx);
});

function showResults(ctx) {
  const mine = Object.values(db.quizzes).filter((q) => q.owner === ctx.from.id && q.results);
  const all = mine.flatMap((q) => q.results).sort((a, b) => b.p - a.p);
  if (!all.length) return ctx.reply("Hali hech kim testingizni yechmagan. Havolani do'stlaringizga yuboring 📤", MENU);
  const medal = ["🥇", "🥈", "🥉"];
  const lines = all.slice(0, 10).map((r, i) => `${medal[i] || i + 1 + "."} ${r.name}: ${r.p}%`);
  return ctx.reply("🏆 Sizni eng yaxshi taniydiganlar:\n\n" + lines.join("\n") + `\n\nJami: ${all.length} kishi yechgan`, MENU);
}

// ------------------------------------------------------------------ test tuzish
bot.action("new", async (ctx) => {
  await ctx.answerCbQuery();
  try { await ctx.editMessageReplyMarkup(); } catch (e) {}
  return ctx.reply(
    "Nechta savoldan iborat test tuzamiz?",
    Markup.inlineKeyboard([LENGTHS.map((n) => Markup.button.callback(`${n} ta`, `len:${n}`))])
  );
});

bot.action(/^len:(\d+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const n = Number(ctx.match[1]);
  if (!LENGTHS.includes(n)) return;
  const rows = Object.entries(L.STYLES).map(([k, v]) => [Markup.button.callback(v.label, `sty:${n}:${k}`)]);
  return put(ctx, "Qanday savollar bo'lsin?", Markup.inlineKeyboard(rows));
});

bot.action(/^sty:(\d+):(\w+)$/, async (ctx) => {
  await ctx.answerCbQuery();
  const n = Number(ctx.match[1]);
  const style = ctx.match[2];
  if (!LENGTHS.includes(n) || !L.STYLES[style]) return;
  const qids = L.pick(QUESTIONS, style, n);
  const key = rid();
  db.quizzes[key] = {
    owner: ctx.from.id,
    ownerName: nameOf(ctx.from),
    style,
    qids,
    answers: [],
    results: [],
    progress: {},
    t: Date.now(),
  };
  save();
  return showOwnerQ(ctx, key, 0);
});

function showOwnerQ(ctx, key, step) {
  const quiz = getQuiz(key);
  const n = quiz.qids.length;
  const q = QUESTIONS[quiz.qids[step]];
  const rows = (q.oo || q.opts).map((o, i) => [Markup.button.callback(o, `o:${key}:${step}:${i}`)]);
  rows.push([Markup.button.callback("🔄 Boshqa savol", `r:${key}:${step}`)]);
  return put(ctx, `${L.bar(step, n)}  ${step + 1}/${n}\n\n${q.o}`, Markup.inlineKeyboard(rows));
}

bot.action(/^o:(\w+):(\d+):(\d)$/, async (ctx) => {
  const [, key, stepS, optS] = ctx.match;
  const step = Number(stepS);
  const quiz = getQuiz(key);
  if (!quiz || quiz.owner !== ctx.from.id || quiz.answers.length !== step) return ctx.answerCbQuery();
  await ctx.answerCbQuery("✅");
  quiz.answers.push(Number(optS));
  save();
  if (step + 1 < quiz.qids.length) return showOwnerQ(ctx, key, step + 1);

  const link = await linkFor(key);
  await put(
    ctx,
    `${L.bar(quiz.qids.length, quiz.qids.length)}  ✅ Test tayyor!\n\n` +
      `Mana sizning havolangiz:\n${link}\n\n` +
      `Uni do'stlaringizga yuboring. Javoblaringiz sir saqlanadi, ular faqat taxmin qiladi 🤫`,
    await shareKb(key)
  );
  return sendSticker(ctx.chat.id, "win");
});

bot.action(/^r:(\w+):(\d+)$/, async (ctx) => {
  const [, key, stepS] = ctx.match;
  const step = Number(stepS);
  const quiz = getQuiz(key);
  if (!quiz || quiz.owner !== ctx.from.id || quiz.answers.length !== step) return ctx.answerCbQuery();
  const free = L.pool(QUESTIONS, quiz.style).filter((i) => !quiz.qids.includes(i));
  if (!free.length) return ctx.answerCbQuery("Boshqa savol qolmadi 😅");
  await ctx.answerCbQuery("🔄");
  quiz.qids[step] = free[Math.floor(Math.random() * free.length)];
  save();
  return showOwnerQ(ctx, key, step);
});

async function shareKb(key) {
  const link = await linkFor(key);
  const share =
    "https://t.me/share/url?url=" +
    encodeURIComponent(link) +
    "&text=" +
    encodeURIComponent("Meni qanchalik taniysan? 😏 Sinab ko'r, necha foiz chiqarkan!");
  return Markup.inlineKeyboard([
    [Markup.button.url("📤 Do'stga yuborish", share)],
    [Markup.button.callback("🏆 Natijalarim", "res")],
  ]);
}

// ------------------------------------------------------------------ do'st taxmin qiladi
async function sendGuessQ(tg, uid, key, step) {
  const quiz = getQuiz(key);
  if (!quiz) return;
  const n = quiz.qids.length;
  const q = QUESTIONS[quiz.qids[step]];
  const order = L.shuffle([0, 1, 2, 3]);
  const correct = quiz.answers[step];
  const head = `${step + 1}/${n} · ${quiz.ownerName} ${q.g}`;
  try {
    // so'rovnoma (quiz): javob berishi bilan to'g'ri/xato darrov ko'rinadi
    const m = await tg.sendPoll(
      uid,
      head.slice(0, 300),
      order.map((i) => q.opts[i].slice(0, 100)),
      {
        type: "quiz",
        is_anonymous: false,
        correct_option_id: order.indexOf(correct),
        explanation: `${quiz.ownerName} aynan shuni tanlagan: ${q.opts[correct]}`.slice(0, 200),
      }
    );
    db.polls[m.poll.id] = { key, step, uid, order, t: Date.now() };
    save();
  } catch (e) {
    console.log("sendPoll xato, tugmalarga o'tdim:", e.message);
    const rows = order.map((i) => [Markup.button.callback(q.opts[i], `g:${key}:${step}:${i}`)]);
    await tg.sendMessage(uid, `${L.bar(step, n)}\n\n${head}`, Markup.inlineKeyboard(rows));
  }
}

bot.on("poll_answer", async (ctx) => {
  const a = ctx.pollAnswer;
  const p = db.polls[a.poll_id];
  if (!p || !a.option_ids.length || a.user.id !== p.uid) return;
  delete db.polls[a.poll_id];
  return recordGuess(ctx.telegram, a.user, p.key, p.step, p.order[a.option_ids[0]]);
});

// zaxira: so'rovnoma yuborib bo'lmasa, tugmalar bilan
bot.action(/^g:(\w+):(\d+):(\d)$/, async (ctx) => {
  const [, key, stepS, optS] = ctx.match;
  const quiz = getQuiz(key);
  await ctx.answerCbQuery();
  if (!quiz) return;
  try { await ctx.editMessageReplyMarkup(); } catch (e) {}
  const right = Number(optS) === quiz.answers[Number(stepS)];
  await ctx.reply(right ? "✅ To'g'ri topdingiz!" : "❌ Xato");
  return recordGuess(ctx.telegram, ctx.from, key, Number(stepS), Number(optS));
});

async function recordGuess(tg, user, key, step, real) {
  const quiz = getQuiz(key);
  if (!quiz) return;
  const pr = (quiz.progress[user.id] ||= { guesses: [] });
  if (pr.guesses.length !== step) return;
  pr.guesses.push(real);
  save();
  const n = quiz.qids.length;
  await sleep(1800);
  if (step + 1 < n) return sendGuessQ(tg, user.id, key, step + 1);
  return finishGuess(tg, user, key, quiz, pr);
}

async function finishGuess(tg, user, key, quiz, pr) {
  const n = quiz.qids.length;
  const right = pr.guesses.filter((g, i) => g === quiz.answers[i]).length;
  const p = Math.round((right / n) * 100);
  if (!quiz.results.find((r) => r.id === user.id)) {
    quiz.results.push({ id: user.id, name: nameOf(user), p, right, n });
  }
  save();

  const wrong = pr.guesses
    .map((g, i) => [g, i])
    .filter(([g, i]) => g !== quiz.answers[i])
    .map(([g, i]) => {
      const q = QUESTIONS[quiz.qids[i]];
      return `${i + 1}) "${q.opts[g]}" dedingiz, aslida "${q.opts[quiz.answers[i]]}"`;
    });

  await tg.sendMessage(
    user.id,
    `🎯 Siz ${quiz.ownerName}ni ${p}% taniysiz!\n\n${L.marks(pr.guesses, quiz.answers)}  (${right}/${n})\n${L.title(p)}` +
      (wrong.length ? `\n\n❌ Xatolaringiz:\n${wrong.join("\n")}` : "\n\n💯 Hammasini topdingiz!"),
    Markup.inlineKeyboard([[Markup.button.callback("🔥 Men seni qanchalik bilaman, tekshir!", "new")]])
  );
  await sendSticker(user.id, L.mood(p));

  tg.sendMessage(
    quiz.owner,
    `📩 ${nameOf(user)} testingizni yechdi!\n\nSizni ${p}% taniydi (${right}/${n})\n${L.title(p)}`,
    Markup.inlineKeyboard([[Markup.button.callback("🏆 Hamma natijalar", "res")]])
  ).catch(() => {});
}

// ------------------------------------------------------------------ boshqa xabarlar
bot.on("text", (ctx) => ctx.reply("Quyidagilardan birini tanlang 👇", MENU));
bot.catch((err) => console.log("Xato:", err.message));

bot.telegram
  .setMyCommands([
    { command: "start", description: "Boshlash" },
    { command: "natijalar", description: "Mening natijalarim" },
    { command: "yordam", description: "Qanday o'ynaladi" },
  ])
  .catch(() => {});

// Deploy paytida eski nusxa hali ishlab turganda 409 chiqadi. Jim turib qolmaslik uchun
// jarayon chiqib ketadi, Render uni o'zi qayta ishga tushiradi.
bot
  .launch({ allowedUpdates: ["message", "callback_query", "poll_answer"] })
  .catch((e) => {
    console.log("Launch xato, qayta ishga tushiriladi:", e.message);
    setTimeout(() => process.exit(1), 3000);
  });
console.log("Bot ishga tushdi");
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
