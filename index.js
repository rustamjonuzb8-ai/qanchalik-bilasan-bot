const http = require("http");
const fs = require("fs");

// Render Web Service port ochiq bo'lishini talab qiladi
http.createServer((req, res) => res.end("OK")).listen(process.env.PORT || 3000);

if (!process.env.BOT_TOKEN) {
  console.log("BOT_TOKEN qo'yilmagan. Render > Environment ga BOT_TOKEN qo'shing.");
  return;
}

// Render bepul tarifi 15 daqiqa so'rovsiz qolsa servisni uxlatadi. Har 5 daqiqada o'zimizga
// so'rov yuborib uni uyg'oq ushlaymiz. RENDER_EXTERNAL_URL ni Render o'zi qo'yadi.
const SELF_URL = process.env.RENDER_EXTERNAL_URL;
if (SELF_URL) {
  setInterval(() => {
    fetch(SELF_URL).catch((e) => console.log("Ping xato:", e.message));
  }, 5 * 60 * 1000);
}

const { Telegraf, Markup } = require("telegraf");
const QUESTIONS = require("./questions");
const L = require("./logic");

const bot = new Telegraf(process.env.BOT_TOKEN);
const DB_FILE = process.env.DB_FILE || "./data.json";
const LENGTHS = [5, 7, 10];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ baza
let db = { quizzes: {}, polls: {}, users: {} };
try {
  const d = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
  db.quizzes = d.quizzes || {};
  db.polls = d.polls || {};
  db.users = d.users || {};
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

// ------------------------------------------------------------------ foydalanuvchilar ro'yxati
const seedUser = (id, name, t) => {
  if (typeof id !== "number" || db.users[id]) return;
  db.users[id] = { name: name || "Do'st", username: "", joined: t || Date.now(), last: 0, blocked: false };
};
const seedAll = () => {
  for (const q of Object.values(db.quizzes)) {
    seedUser(q.owner, q.ownerName, q.t);
    for (const r of q.results || []) seedUser(r.id, r.name, q.t);
  }
};
seedAll(); // eski testlardan egalari va yechganlarini ro'yxatga olamiz

function touch(u) {
  const x = (db.users[u.id] ||= { name: "", username: "", joined: Date.now(), last: 0, blocked: false });
  x.name = nameOf(u);
  x.username = u.username || "";
  x.last = Date.now();
  x.blocked = false;
}
bot.use((ctx, next) => {
  if (ctx.from && !ctx.from.is_bot && ctx.updateType !== "my_chat_member") {
    touch(ctx.from);
    save();
  }
  return next();
});
// foydalanuvchi botni bloklasa/qayta ochsa belgilab qo'yamiz
bot.on("my_chat_member", (ctx) => {
  const u = db.users[ctx.from.id];
  if (u && ctx.chat.type === "private") {
    u.blocked = ["kicked", "left"].includes(ctx.myChatMember.new_chat_member.status);
    save();
  }
});

// ------------------------------------------------------------------ asosiy tugmalar (pastdagi doimiy klaviatura)
const ADMINS = (process.env.ADMIN_IDS || "").split(",").map((s) => Number(s.trim())).filter(Boolean);
const isAdmin = (id) => ADMINS.includes(id);
const adminOnly = (ctx, next) => (isAdmin(ctx.from && ctx.from.id) ? next() : ctx.answerCbQuery("⛔ Faqat admin uchun"));

const BTN = { new: "🎮 Test tuzish", res: "🏆 Natijalarim", links: "🔗 Havolalarim", help: "ℹ️ Yordam", admin: "🛠 Admin panel" };
const MENU_TEXTS = Object.values(BTN);
const mainKb = (id) => {
  const rows = [[BTN.new, BTN.res], [BTN.links, BTN.help]];
  if (isAdmin(id)) rows.push([BTN.admin]);
  return Markup.keyboard(rows).resize();
};

// ------------------------------------------------------------------ admin panel
const adminState = {}; // adminId -> { mode: "bc" | "confirm" | "restore", src, btn }
const recipients = () => Object.keys(db.users).filter((id) => !db.users[id].blocked).map(Number);
const DAY = 24 * 3600 * 1000;

const PANEL_KB = Markup.inlineKeyboard([
  [Markup.button.callback("📊 Statistika", "a:stats"), Markup.button.callback("👥 Foydalanuvchilar", "a:users")],
  [Markup.button.callback("📢 Hammaga xabar yuborish", "a:bc")],
  [Markup.button.callback("💾 Zaxira (backup)", "a:backup"), Markup.button.callback("♻️ Tiklash", "a:restore")],
]);
const BACK_KB = Markup.inlineKeyboard([[Markup.button.callback("🔙 Panelga qaytish", "a:home")]]);

function panelText() {
  const us = Object.values(db.users);
  const now = Date.now();
  return (
    "🛠 Admin panel\n\n" +
    `👥 Foydalanuvchilar: ${us.length}\n` +
    `🆕 So'nggi 24 soatda: +${us.filter((u) => u.joined > now - DAY).length}\n` +
    `📬 Xabar boradigan: ${recipients().length}\n\nTanlang 👇`
  );
}

function statsText() {
  const us = Object.values(db.users);
  const now = Date.now();
  const quizzes = Object.values(db.quizzes);
  const solved = quizzes.reduce((s, q) => s + (q.results || []).length, 0);
  const byOwner = {};
  for (const q of quizzes) byOwner[q.owner] = (byOwner[q.owner] || 0) + (q.results || []).length;
  const top = Object.entries(byOwner)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, n], i) => `${i + 1}. ${(db.users[id] || {}).name || id}: ${n} kishi yechgan`);
  return [
    "📊 Statistika",
    "",
    `👥 Jami foydalanuvchi: ${us.length}`,
    `✅ Faol (bloklamagan): ${us.filter((u) => !u.blocked).length}`,
    `🚫 Botni bloklagan: ${us.filter((u) => u.blocked).length}`,
    "",
    `🆕 Yangi: 24 soatda ${us.filter((u) => u.joined > now - DAY).length}, 7 kunda ${us.filter((u) => u.joined > now - 7 * DAY).length}`,
    `🟢 Faol: 24 soatda ${us.filter((u) => u.last > now - DAY).length}, 7 kunda ${us.filter((u) => u.last > now - 7 * DAY).length}`,
    "",
    `🎮 Tuzilgan testlar: ${quizzes.length}`,
    `🎯 Yechilgan testlar: ${solved}`,
    ...(top.length ? ["", "🏅 Eng ko'p yechilgan testlar egasi:", ...top] : []),
  ].join("\n");
}

function usersText() {
  const entries = Object.entries(db.users);
  const list = entries
    .sort((a, b) => b[1].joined - a[1].joined)
    .slice(0, 15)
    .map(([, u], i) => `${i + 1}. ${u.name}${u.username ? " @" + u.username : ""}${u.blocked ? " 🚫" : ""}`);
  return "👥 So'nggi foydalanuvchilar:\n\n" + (list.join("\n") || "Hali yo'q") + `\n\nJami: ${entries.length}`;
}

function openPanel(ctx) {
  if (!ADMINS.length) {
    return ctx.reply(
      `Admin hali sozlanmagan.\n\nSizning Telegram ID: ${ctx.from.id}\n\n` +
        `Render > Environment ga ADMIN_IDS = ${ctx.from.id} qo'shing (bir nechta admin bo'lsa vergul bilan) va qayta deploy qiling.`
    );
  }
  if (!isAdmin(ctx.from.id)) return ctx.reply("Quyidagilardan birini tanlang 👇", mainKb(ctx.from.id));
  delete adminState[ctx.from.id];
  return ctx.reply(panelText(), PANEL_KB);
}
bot.command("admin", openPanel);
bot.hears(BTN.admin, openPanel);
bot.command("id", (ctx) => ctx.reply(`Sizning Telegram ID: ${ctx.from.id}`));
bot.command("bekor", (ctx) => {
  delete adminState[ctx.from.id];
  return ctx.reply("Bekor qilindi ✅", mainKb(ctx.from.id));
});

bot.action("a:home", adminOnly, async (ctx) => {
  await ctx.answerCbQuery();
  delete adminState[ctx.from.id];
  return put(ctx, panelText(), PANEL_KB);
});
bot.action("a:stats", adminOnly, async (ctx) => {
  await ctx.answerCbQuery();
  return put(ctx, statsText(), BACK_KB);
});
bot.action("a:users", adminOnly, async (ctx) => {
  await ctx.answerCbQuery();
  return put(ctx, usersText(), BACK_KB);
});

// --- hammaga xabar yuborish
const confirmKb = (st) =>
  Markup.inlineKeyboard([
    [Markup.button.callback(st.btn ? "🔘 Tugma: ✅ bor" : "🔘 Tugma: ❌ yo'q", "a:bctoggle")],
    [Markup.button.callback("✅ Yuborish", "a:bcgo"), Markup.button.callback("❌ Bekor", "a:home")],
  ]);
const confirmText = () =>
  `👆 Xabar shunday ko'rinadi.\n\n${recipients().length} kishiga yuboraymi?\n\n` +
  `"Tugma" yoqilsa, xabar tagida "🎮 Test tuzish" tugmasi chiqadi.`;

bot.action("a:bc", adminOnly, async (ctx) => {
  await ctx.answerCbQuery();
  adminState[ctx.from.id] = { mode: "bc", btn: true };
  return put(
    ctx,
    `📢 Xabar yuborish\n\nXabar ${recipients().length} kishiga boradi. Yubormoqchi bo'lgan xabaringizni shu yerga yuboring: ` +
      `matn, rasm, video, ovozli xabar — hammasi bo'ladi.\n\nBekor qilish: /bekor`,
    BACK_KB
  );
});

bot.action("a:bctoggle", adminOnly, async (ctx) => {
  const st = adminState[ctx.from.id];
  if (!st || st.mode !== "confirm") return ctx.answerCbQuery("Xabar topilmadi");
  st.btn = !st.btn;
  await ctx.answerCbQuery(st.btn ? "Tugma yoqildi" : "Tugma o'chirildi");
  try { await ctx.editMessageReplyMarkup(confirmKb(st).reply_markup); } catch (e) {}
});

let broadcasting = false;
bot.action("a:bcgo", adminOnly, async (ctx) => {
  const st = adminState[ctx.from.id];
  if (!st || st.mode !== "confirm" || !st.src) return ctx.answerCbQuery("Xabar topilmadi, qaytadan boshlang");
  if (broadcasting) return ctx.answerCbQuery("Hozir boshqa xabar yuborilmoqda ⏳");
  broadcasting = true;
  delete adminState[ctx.from.id];
  await ctx.answerCbQuery("🚀 Boshlandi");
  try { await ctx.editMessageReplyMarkup(); } catch (e) {}
  const list = recipients();
  const status = await ctx.reply(`🚀 Yuborilmoqda... 0/${list.length}`);
  // fonda ishlaydi (uzoq davom etsa Telegraf timeout bermasligi uchun)
  runBroadcast(ctx.chat.id, status.message_id, st, list)
    .catch((e) => console.log("Broadcast xato:", e.message))
    .finally(() => { broadcasting = false; });
});

async function runBroadcast(adminChat, statusId, st, list) {
  const extra = st.btn ? Markup.inlineKeyboard([[Markup.button.callback("🎮 Test tuzish", "new")]]) : {};
  const edit = (text, kb) => bot.telegram.editMessageText(adminChat, statusId, undefined, text, kb).catch(() => {});
  let ok = 0, blocked = 0, fail = 0;
  for (let i = 0; i < list.length; i++) {
    const uid = list[i];
    let res = null;
    for (let attempt = 0; attempt < 3 && !res; attempt++) {
      try {
        await bot.telegram.copyMessage(uid, st.src.chat, st.src.id, extra);
        res = "ok";
      } catch (e) {
        const r = e.response || {};
        if (r.error_code === 429) {
          await sleep((((r.parameters || {}).retry_after) || 5) * 1000 + 500);
        } else if (r.error_code === 403 || /chat not found|deactivated/i.test(r.description || "")) {
          res = "blocked";
        } else {
          res = "fail";
        }
      }
    }
    if (res === "ok") ok++;
    else if (res === "blocked") {
      blocked++;
      if (db.users[uid]) db.users[uid].blocked = true;
    } else fail++;
    if ((i + 1) % 40 === 0) await edit(`🚀 Yuborilmoqda... ${i + 1}/${list.length}`);
    await sleep(50); // sekundiga ~20 ta, Telegram limitidan past
  }
  save();
  await edit(
    `✅ Xabar yuborish tugadi!\n\n📬 Yetkazildi: ${ok}\n🚫 Botni bloklagan: ${blocked}\n⚠️ Xato: ${fail}`,
    BACK_KB
  );
}

// --- zaxira nusxa va tiklash (Render bepul tarifida fayl o'chib ketishi mumkin)
bot.action("a:backup", adminOnly, async (ctx) => {
  await ctx.answerCbQuery();
  const name = `qanchalik-backup-${new Date().toISOString().slice(0, 10)}.json`;
  return ctx.replyWithDocument(
    { source: Buffer.from(JSON.stringify({ users: db.users, quizzes: db.quizzes })), filename: name },
    { caption: "💾 Zaxira nusxa. Baza o'chib ketsa, ♻️ Tiklash orqali shu faylni qaytarib yuboring." }
  );
});
bot.action("a:restore", adminOnly, async (ctx) => {
  await ctx.answerCbQuery();
  adminState[ctx.from.id] = { mode: "restore" };
  return put(
    ctx,
    "♻️ Tiklash\n\nZaxira .json faylini shu yerga yuboring. Mavjud ma'lumotlar o'chmaydi, faqat yo'q bo'lganlari qo'shiladi.\n\nBekor qilish: /bekor",
    BACK_KB
  );
});

// admin keyingi yuborgan xabarini ushlab oladi (xabar yuborish yoki tiklash rejimida)
bot.use(async (ctx, next) => {
  const st = ctx.from && adminState[ctx.from.id];
  if (!st || ctx.updateType !== "message" || !isAdmin(ctx.from.id)) return next();
  const m = ctx.message;
  if (m.text && (m.text.startsWith("/") || MENU_TEXTS.includes(m.text))) {
    delete adminState[ctx.from.id];
    return next();
  }
  if (st.mode === "bc" || st.mode === "confirm") {
    st.src = { chat: ctx.chat.id, id: m.message_id };
    st.mode = "confirm";
    await ctx.telegram.copyMessage(ctx.chat.id, ctx.chat.id, m.message_id);
    return ctx.reply(confirmText(), confirmKb(st));
  }
  if (st.mode === "restore") {
    if (!m.document) return ctx.reply("Iltimos, .json zaxira faylini yuboring yoki /bekor");
    try {
      const link = await ctx.telegram.getFileLink(m.document.file_id);
      const data = await (await fetch(String(link))).json();
      let addedUsers = 0, addedQuizzes = 0;
      for (const [id, u] of Object.entries(data.users || {})) {
        if (!db.users[id] && u && typeof u === "object") { db.users[id] = u; addedUsers++; }
      }
      for (const [k, q] of Object.entries(data.quizzes || {})) {
        if (!db.quizzes[k] && q && Array.isArray(q.qids) && Array.isArray(q.answers)) { db.quizzes[k] = q; addedQuizzes++; }
      }
      seedAll();
      save();
      delete adminState[ctx.from.id];
      return ctx.reply(`✅ Tiklandi: +${addedUsers} foydalanuvchi, +${addedQuizzes} test`, PANEL_KB);
    } catch (e) {
      return ctx.reply("❌ Faylni o'qib bo'lmadi: " + e.message);
    }
  }
  return next();
});

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
  "Pastdagi tugmalar orqali ham boshqarishingiz mumkin 👇\n" +
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
    return ctx.reply(WELCOME, mainKb(ctx.from.id));
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
      `${quiz.qids.length} ta savol bor. Har birida ${quiz.ownerName} nima tanlaganini toping!`,
    mainKb(ctx.from.id)
  );
  await sleep(1200);
  return sendGuessQ(ctx.telegram, ctx.from.id, key, 0);
});

bot.command("yordam", (ctx) => ctx.reply(HELP, MENU));
bot.command("natijalar", (ctx) => showResults(ctx));

// pastdagi doimiy tugmalar
bot.hears(BTN.new, (ctx) => askLength(ctx));
bot.hears(BTN.res, (ctx) => showResults(ctx));
bot.hears(BTN.help, (ctx) => ctx.reply(HELP, MENU));
bot.hears(BTN.links, (ctx) => myLinks(ctx));

async function myLinks(ctx) {
  const mine = Object.entries(db.quizzes)
    .filter(([, q]) => q.owner === ctx.from.id && Array.isArray(q.answers) && q.answers.length === q.qids.length)
    .sort((a, b) => b[1].t - a[1].t)
    .slice(0, 5);
  if (!mine.length) {
    return ctx.reply(
      "Hali test tuzmagansiz. Boshlaymizmi? 👇",
      Markup.inlineKeyboard([[Markup.button.callback("🎮 Test tuzish", "new")]])
    );
  }
  const lines = [];
  for (const [key, q] of mine) {
    lines.push(`🔗 ${await linkFor(key)}\n${q.qids.length} ta savol · ${(q.results || []).length} kishi yechgan`);
  }
  return ctx.reply("📤 Sizning so'nggi testlaringiz:\n\n" + lines.join("\n\n"), {
    link_preview_options: { is_disabled: true },
  });
}
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
const askLength = (ctx) =>
  ctx.reply(
    "Nechta savoldan iborat test tuzamiz?",
    Markup.inlineKeyboard([LENGTHS.map((n) => Markup.button.callback(`${n} ta`, `len:${n}`))])
  );

bot.action("new", async (ctx) => {
  await ctx.answerCbQuery();
  try { await ctx.editMessageReplyMarkup(); } catch (e) {}
  return askLength(ctx);
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
bot.on("text", (ctx) => ctx.reply("Quyidagilardan birini tanlang 👇", mainKb(ctx.from.id)));
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
  .launch({ allowedUpdates: ["message", "callback_query", "poll_answer", "my_chat_member"] })
  .catch((e) => {
    console.log("Launch xato, qayta ishga tushiriladi:", e.message);
    setTimeout(() => process.exit(1), 3000);
  });
console.log("Bot ishga tushdi");
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
