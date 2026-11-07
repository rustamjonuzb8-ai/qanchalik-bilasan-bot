const { Telegraf, Markup } = require("telegraf");
const fs = require("fs");
const QUESTIONS = require("./questions");

const bot = new Telegraf(process.env.BOT_TOKEN);
const DB_FILE = process.env.DB_FILE || "./data.json";
const N = QUESTIONS.length;

// ---- oddiy JSON baza (keyin Postgres'ga o'tkazamiz) ----
let db = { quizzes: {}, sessions: {} };
try { db = JSON.parse(fs.readFileSync(DB_FILE, "utf8")); } catch (e) {}
const save = () => fs.writeFileSync(DB_FILE, JSON.stringify(db));

const rid = () => Math.random().toString(36).slice(2, 8);
const shuffle = (a) => a.map((v) => [Math.random(), v]).sort((x, y) => x[0] - y[0]).map((x) => x[1]);
const name = (u) => u.first_name || u.username || "Do'sting";

function comment(p) {
  if (p >= 90) return "Siz bir jonu ikki tansiz 🔥";
  if (p >= 60) return "Yaxshi do'stsiz 👌";
  if (p >= 30) return "Yana ko'p gaplashish kerak 😅";
  return "Siz uni umuman tanimas ekansiz 😂";
}

// savolni yuborish: variantlar aralashadi, tugmada ASL variant indeksi (id) yuboriladi
function ask(ctx, mode, key, step) {
  const item = QUESTIONS[step];
  const text = `${step + 1}/${N}. U ${item.q}`;
  const order = shuffle([0, 1, 2, 3]);
  const buttons = order.map((i) => [Markup.button.callback(item.o[i], `a:${mode}:${key}:${step}:${i}`)]);
  return ctx.reply(mode === "own" ? ownText(step) : text, Markup.inlineKeyboard(buttons));
}

function ownText(step) {
  const t = [
    "Agar bir kun hech kim bilan gaplashmasangiz, sababi nima?",
    "Siz uchun eng qadrli narsa qaysi?",
    "Katta miqdorda pul berilsa, birinchi nima qilasiz?",
    "Odamda eng yomon ko'radigan xususiyatingiz qaysi?",
    "Hayotda nimaga eng ko'p erishishni xohlaysiz?",
  ];
  return `${step + 1}/${N}. ${t[step]}`;
}

function startOwn(ctx) {
  const id = rid();
  db.sessions[ctx.from.id] = { mode: "own", quiz: id };
  db.quizzes[id] = { owner: ctx.from.id, ownerName: name(ctx.from), answers: [], results: [] };
  save();
  return ask(ctx, "own", id, 0);
}

bot.start(async (ctx) => {
  const payload = ctx.startPayload;
  if (payload && db.quizzes[payload]) {
    const quiz = db.quizzes[payload];
    if (quiz.owner === ctx.from.id) return ctx.reply("Bu sizning o'z testingiz 😄 Do'stingizga yuboring!");
    await ctx.reply(`${quiz.ownerName} sizga savol yubordi: "Meni qanchalik taniysan?" 😏\nHar bir savolda u nima tanlaganini toping!`);
    return ask(ctx, "guess", payload, 0);
  }
  await ctx.reply("Salom! 👋\nDo'stingiz sizni qanchalik taniydi? Hozir bilib olamiz!\n\n5 ta savolga javob bering, keyin havolani do'stingizga yuboring.");
  return startOwn(ctx);
});

bot.action(/^a:(own|guess):(\w+):(\d+):(\d)$/, async (ctx) => {
  const [, mode, key, stepS, optS] = ctx.match;
  const step = Number(stepS), opt = Number(optS);
  const quiz = db.quizzes[key];
  await ctx.answerCbQuery();
  if (!quiz) return;
  try { await ctx.editMessageReplyMarkup(); } catch (e) {}

  if (mode === "own") {
    if (ctx.from.id !== quiz.owner || quiz.answers.length !== step) return;
    quiz.answers.push(opt);
    save();
    if (step + 1 < N) return ask(ctx, "own", key, step + 1);
    const me = (await ctx.telegram.getMe()).username;
    const link = `https://t.me/${me}?start=${key}`;
    return ctx.reply(
      `✅ Tayyor! Mana sizning havolangiz:\n${link}\n\nUni do'stingizga yuboring, u sizni necha foiz taniydi ko'ramiz.`,
      Markup.inlineKeyboard([[Markup.button.switchToChat("📤 Do'stga yuborish", "Meni qanchalik taniysan? 😏 " + link)]])
    );
  }

  // guess rejimi
  const s = (db.sessions[ctx.from.id] = db.sessions[ctx.from.id]?.quiz === key && db.sessions[ctx.from.id].mode === "guess"
    ? db.sessions[ctx.from.id]
    : { mode: "guess", quiz: key, guesses: [] });
  if (s.guesses.length !== step) return;
  s.guesses.push(opt);
  save();
  if (step + 1 < N) return ask(ctx, "guess", key, step + 1);

  // natija
  let right = 0;
  const wrong = [];
  s.guesses.forEach((g, i) => {
    if (g === quiz.answers[i]) right++;
    else wrong.push(`${i + 1}-savol: siz "${QUESTIONS[i].o[g]}" dedingiz, aslida "${QUESTIONS[i].o[quiz.answers[i]]}"`);
  });
  const p = Math.round((right / N) * 100);
  quiz.results.push({ id: ctx.from.id, name: name(ctx.from), p });
  save();

  const me = (await ctx.telegram.getMe()).username;
  await ctx.reply(
    `🎯 Siz ${quiz.ownerName}ni ${p}% taniysiz!\n(${right}/${N} to'g'ri)\n${comment(p)}` +
      (wrong.length ? `\n\n❌ Xatolar:\n${wrong.join("\n")}` : ""),
    Markup.inlineKeyboard([[Markup.button.callback("🔥 Men seni qanchalik bilaman, tekshir!", "new")]])
  );
  ctx.telegram
    .sendMessage(quiz.owner, `📩 ${name(ctx.from)} sizni ${p}% taniydi. ${comment(p)}`)
    .catch(() => {});
});

bot.action("new", async (ctx) => {
  await ctx.answerCbQuery();
  try { await ctx.editMessageReplyMarkup(); } catch (e) {}
  await ctx.reply("Ajoyib! Endi o'zingiz uchun test tuzamiz 👇");
  return startOwn(ctx);
});

bot.command("natijalar", (ctx) => {
  const mine = Object.values(db.quizzes).filter((q) => q.owner === ctx.from.id);
  const all = mine.flatMap((q) => q.results).sort((a, b) => b.p - a.p);
  if (!all.length) return ctx.reply("Hali hech kim testingizni yechmagan.");
  return ctx.reply("🏆 Sizni eng yaxshi taniydiganlar:\n" + all.slice(0, 10).map((r, i) => `${i + 1}. ${r.name}: ${r.p}%`).join("\n"));
});

bot.launch();
console.log("Bot ishga tushdi");
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
