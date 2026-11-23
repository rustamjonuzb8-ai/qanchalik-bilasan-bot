// Qanchalik Bilasan boti — Cloudflare Workers (webhook + D1) versiyasi.
// Render'dagi index.js bilan bir xil ishlaydi, faqat doim yoqiq turmaydi: xabar kelganda uyg'onadi.
// Baza: D1 (SQLite). Kunlik savol va "hammaga xabar" cron orqali har daqiqada bo'laklab yuboriladi.
import QUESTIONS from "./questions.js";
import DAILY from "./daily_questions.js";
import * as L from "./logic.js";

const DAY = 24 * 3600 * 1000;
const LENGTHS = [5, 7, 10];
const TZ_MS = 5 * 3600 * 1000; // O'zbekiston UTC+5, yozgi vaqt yo'q
const DAILY_WINDOW = 3; // belgilangan soatdan keyin shuncha soat ichida yuboriladi
const DAILY_SKIP_AFTER = 45 * DAY;
const MIN_FRIENDS = 3;
const BACKUP_TAG = "QB-BACKUP";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ------------------------------------------------------------------ Telegram
const clean = (s) => String(s || "").replace(/\s+/g, "");

class TgError extends Error {
  constructor(method, body, status) {
    super(`${method}: ${(body && body.description) || status}`);
    this.code = (body && body.error_code) || status;
    this.desc = (body && body.description) || "";
    this.retryAfter = body && body.parameters && body.parameters.retry_after;
  }
}

async function tg(env, method, params = {}) {
  const r = await fetch(`https://api.telegram.org/bot${clean(env.BOT_TOKEN)}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(params),
  });
  let body = null;
  try { body = await r.json(); } catch (e) {}
  if (!r.ok || !body || !body.ok) throw new TgError(method, body, r.status);
  return body.result;
}

async function tgDocument(env, chatId, filename, text, caption) {
  const form = new FormData();
  form.append("chat_id", String(chatId));
  form.append("caption", caption);
  form.append("document", new Blob([text], { type: "application/json" }), filename);
  const r = await fetch(`https://api.telegram.org/bot${clean(env.BOT_TOKEN)}/sendDocument`, { method: "POST", body: form });
  const body = await r.json().catch(() => null);
  if (!r.ok || !body || !body.ok) throw new TgError("sendDocument", body, r.status);
  return body.result;
}

async function fetchBackup(env, fileId) {
  const f = await tg(env, "getFile", { file_id: fileId });
  const res = await fetch(`https://api.telegram.org/file/bot${clean(env.BOT_TOKEN)}/${f.file_path}`);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();
  if (!data || typeof data !== "object" || typeof data.users !== "object" || typeof data.quizzes !== "object") {
    throw new Error("zaxira fayli buzuq");
  }
  return data;
}

// tugmalar
const cb = (text, data) => ({ text, callback_data: data });
const urlBtn = (text, url) => ({ text, url });
const ik = (rows) => ({ reply_markup: { inline_keyboard: rows } });

const BTN = { new: "🎮 Test tuzish", res: "🏆 Natijalarim", links: "🔗 Havolalarim", help: "ℹ️ Yordam", admin: "🛠 Admin panel", daily: "🎯 Kunlik savol" };
const MENU_TEXTS = Object.values(BTN);

const adminIds = (env) => String(env.ADMIN_IDS || "").split(",").map((s) => Number(s.trim())).filter(Boolean);
const isAdmin = (env, id) => adminIds(env).includes(id);

const mainKb = (env, id) => {
  const rows = [[BTN.new, BTN.res], [BTN.links, BTN.daily], [BTN.help]];
  if (isAdmin(env, id)) rows.push([BTN.admin]);
  return { reply_markup: { keyboard: rows.map((r) => r.map((text) => ({ text }))), resize_keyboard: true } };
};

const MENU = ik([
  [cb("🎮 Test tuzish", "new")],
  [cb("🏆 Natijalarim", "res"), cb("ℹ️ Qanday o'ynaladi", "help")],
]);

const HELP =
  "ℹ️ Qanday o'ynaladi?\n\n" +
  "1️⃣ Siz o'zingiz haqingizda savollarga javob berasiz.\n" +
  "2️⃣ Bot sizga shaxsiy havola beradi, uni do'stingizga yuborasiz.\n" +
  "3️⃣ Do'stingiz sizning javoblaringizni topishga harakat qiladi (so'rovnoma shaklida).\n" +
  "4️⃣ Bot natijani foizda aytadi va sizga ham xabar yuboradi 😏\n\n" +
  "Pastdagi tugmalar orqali ham boshqarishingiz mumkin 👇\n" +
  "🎯 Har kuni kechqurun bot bitta qiziq savol yuboradi. Bugungisini /kunlik orqali ham ko'rishingiz mumkin.\n" +
  "Kunlik savol kerak bo'lmasa: /kunlik_off, qayta yoqish: /kunlik_on\n\n" +
  "Buyruqlar: /start, /natijalar, /reyting, /kunlik, /yordam";

const WELCOME =
  "Salom! 👋\n\n🔥 Do'stlaringiz sizni qanchalik taniydi?\n" +
  "Savollarga javob bering, havolani yuboring va foizda natijani ko'ring!";

// ------------------------------------------------------------------ baza (D1)
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY, name TEXT, username TEXT DEFAULT '', joined INTEGER DEFAULT 0, last_seen INTEGER DEFAULT 0,
    blocked INTEGER DEFAULT 0, hide INTEGER DEFAULT 0, nodq INTEGER DEFAULT 0, dq_day TEXT DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS quizzes (
    qk TEXT PRIMARY KEY, owner INTEGER, owner_name TEXT, style TEXT, qids TEXT, answers TEXT, t INTEGER)`,
  `CREATE INDEX IF NOT EXISTS quizzes_owner ON quizzes(owner)`,
  `CREATE TABLE IF NOT EXISTS results (
    qk TEXT, uid INTEGER, name TEXT, p INTEGER, hit INTEGER, n INTEGER, dx INTEGER, PRIMARY KEY (qk, uid))`,
  `CREATE TABLE IF NOT EXISTS progress (qk TEXT, uid INTEGER, guesses TEXT, PRIMARY KEY (qk, uid))`,
  `CREATE TABLE IF NOT EXISTS polls (poll_id TEXT PRIMARY KEY, qk TEXT, step INTEGER, uid INTEGER, ord TEXT, t INTEGER)`,
  `CREATE TABLE IF NOT EXISTS daily (day TEXT PRIMARY KEY, qi INTEGER)`,
  `CREATE TABLE IF NOT EXISTS daily_votes (day TEXT, uid INTEGER, opt INTEGER, PRIMARY KEY (day, uid))`,
  `CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT)`,
];
let schemaReady = false;
async function ensureSchema(env) {
  if (schemaReady) return;
  await env.DB.batch(SCHEMA.map((s) => env.DB.prepare(s)));
  schemaReady = true;
}

const stmt = (env, sql, args) => env.DB.prepare(sql).bind(...args);
const all = async (env, sql, ...a) => (await stmt(env, sql, a).all()).results || [];
const first = (env, sql, ...a) => stmt(env, sql, a).first();
const run = (env, sql, ...a) => stmt(env, sql, a).run();
const changed = (r) => !!(r && r.meta && r.meta.changes > 0);

const kvGet = async (env, k) => {
  const r = await first(env, "SELECT v FROM kv WHERE k=?", k);
  return r ? r.v : null;
};
const kvSet = (env, k, v) => run(env, "INSERT INTO kv(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v", k, String(v));
const kvDel = (env, k) => run(env, "DELETE FROM kv WHERE k=?", k);
const getJ = async (env, k) => {
  const v = await kvGet(env, k);
  try { return v ? JSON.parse(v) : null; } catch (e) { return null; }
};
const setJ = (env, k, v) => kvSet(env, k, JSON.stringify(v));

// bir vaqtda ikki jarayon bir ishni qilmasligi uchun (cron va webhook)
async function lease(env, name, ms) {
  const now = Date.now();
  const r = await run(
    env,
    "INSERT INTO kv(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v WHERE CAST(kv.v AS INTEGER) < ?",
    "lock:" + name, String(now + ms), now
  );
  return changed(r);
}
const release = (env, name) => kvSet(env, "lock:" + name, "0");

const rid = () => Math.random().toString(36).slice(2, 8);
const nameOf = (u) => u.first_name || u.username || "Do'sting";
const shortName = (n) => {
  const s = String(n || "Do'st").trim() || "Do'st";
  return s.length > 20 ? s.slice(0, 19) + "…" : s;
};

async function touch(env, u) {
  const now = Date.now();
  await run(
    env,
    `INSERT INTO users(id,name,username,joined,last_seen,blocked) VALUES(?,?,?,?,?,0)
     ON CONFLICT(id) DO UPDATE SET name=excluded.name, username=excluded.username, last_seen=excluded.last_seen, blocked=0`,
    u.id, nameOf(u), u.username || "", now, now
  );
}

async function getQuiz(env, qk) {
  const r = await first(env, "SELECT * FROM quizzes WHERE qk=?", qk);
  if (!r) return null;
  try {
    const qids = JSON.parse(r.qids);
    const answers = JSON.parse(r.answers);
    if (!Array.isArray(qids) || !Array.isArray(answers)) return null;
    return { key: r.qk, owner: r.owner, ownerName: r.owner_name, style: r.style, qids, answers, t: r.t };
  } catch (e) {
    return null;
  }
}

let ME = null;
const botName = async (env) => env.BOT_USERNAME || (ME ||= (await tg(env, "getMe")).username);
const linkFor = async (env, qk) => `https://t.me/${await botName(env)}?start=${qk}`;

// ------------------------------------------------------------------ stikerlar
const EMOJIS = {
  welcome: ["👋", "😍", "🤗", "😎"],
  win: ["🔥", "🥳", "🎉", "😎", "🤩", "❤️"],
  mid: ["😅", "🙂", "😄", "👍"],
  low: ["😂", "🤨", "😢", "🙈"],
};
const FALLBACK = { welcome: "👋", win: "🎉", mid: "😅", low: "😂" };
const setCache = {};
async function sendSticker(env, chatId, kind) {
  const sets = String(env.STICKER_SETS || "HotCherry,UtyaDuck").split(",").map((s) => s.trim()).filter(Boolean);
  for (const name of sets) {
    try {
      if (!setCache[name]) setCache[name] = (await tg(env, "getStickerSet", { name })).stickers;
      const list0 = setCache[name];
      const match = list0.filter((s) => EMOJIS[kind].includes(s.emoji));
      const list = match.length ? match : list0;
      const s = list[Math.floor(Math.random() * list.length)];
      await tg(env, "sendSticker", { chat_id: chatId, sticker: s.file_id });
      return;
    } catch (e) {}
  }
  await tg(env, "sendMessage", { chat_id: chatId, text: FALLBACK[kind] }).catch(() => {});
}

// ------------------------------------------------------------------ ctx
function makeCtx(env, update) {
  const c = update.callback_query;
  const msg = update.message || (c && c.message) || null;
  const from =
    (update.message && update.message.from) ||
    (c && c.from) ||
    (update.poll_answer && update.poll_answer.user) ||
    (update.my_chat_member && update.my_chat_member.from) ||
    null;
  const chatId = msg ? msg.chat.id : from ? from.id : null;
  const ctx = {
    env,
    cb: c || null,
    from,
    chatId,
    reply: (text, extra) => tg(env, "sendMessage", { chat_id: chatId, text, ...(extra || {}) }),
    edit: (text, extra) => tg(env, "editMessageText", { chat_id: chatId, message_id: c.message.message_id, text, ...(extra || {}) }),
    editMarkup: (markup) =>
      tg(env, "editMessageReplyMarkup", { chat_id: chatId, message_id: c.message.message_id, reply_markup: markup || { inline_keyboard: [] } }),
    answer: (text, alert) =>
      c ? tg(env, "answerCallbackQuery", { callback_query_id: c.id, text, show_alert: !!alert }).catch(() => {}) : Promise.resolve(),
  };
  return ctx;
}

async function put(ctx, text, extra, forceNew) {
  if (!forceNew && ctx.cb) {
    try {
      return await ctx.edit(text, extra);
    } catch (e) {}
  }
  return ctx.reply(text, extra);
}

// ------------------------------------------------------------------ admin panel
const recipientsCount = async (env) => (await first(env, "SELECT COUNT(*) c FROM users WHERE blocked=0")).c;

const PANEL_KB = ik([
  [cb("📊 Statistika", "a:stats"), cb("👥 Foydalanuvchilar", "a:users")],
  [cb("📢 Hammaga xabar yuborish", "a:bc")],
  [cb("💾 Zaxira (backup)", "a:backup"), cb("♻️ Tiklash", "a:restore")],
]);
const BACK_KB = ik([[cb("🔙 Panelga qaytish", "a:home")]]);

async function panelText(env) {
  const now = Date.now();
  const total = (await first(env, "SELECT COUNT(*) c FROM users")).c;
  const fresh = (await first(env, "SELECT COUNT(*) c FROM users WHERE joined>?", now - DAY)).c;
  return `🛠 Admin panel\n\n👥 Foydalanuvchilar: ${total}\n🆕 So'nggi 24 soatda: +${fresh}\n📬 Xabar boradigan: ${await recipientsCount(env)}\n\nTanlang 👇`;
}

async function statsText(env) {
  const now = Date.now();
  const c = async (sql, ...a) => (await first(env, sql, ...a)).c;
  const total = await c("SELECT COUNT(*) c FROM users");
  const blocked = await c("SELECT COUNT(*) c FROM users WHERE blocked=1");
  const top = (
    await all(
      env,
      `SELECT q.owner id, COUNT(*) n, u.name name FROM results r JOIN quizzes q ON q.qk=r.qk
       LEFT JOIN users u ON u.id=q.owner GROUP BY q.owner ORDER BY n DESC LIMIT 5`
    )
  ).map((r, i) => `${i + 1}. ${r.name || r.id}: ${r.n} kishi yechgan`);
  return [
    "📊 Statistika",
    "",
    `👥 Jami foydalanuvchi: ${total}`,
    `✅ Faol (bloklamagan): ${total - blocked}`,
    `🚫 Botni bloklagan: ${blocked}`,
    "",
    `🆕 Yangi: 24 soatda ${await c("SELECT COUNT(*) c FROM users WHERE joined>?", now - DAY)}, 7 kunda ${await c("SELECT COUNT(*) c FROM users WHERE joined>?", now - 7 * DAY)}`,
    `🟢 Faol: 24 soatda ${await c("SELECT COUNT(*) c FROM users WHERE last_seen>?", now - DAY)}, 7 kunda ${await c("SELECT COUNT(*) c FROM users WHERE last_seen>?", now - 7 * DAY)}`,
    "",
    `🎮 Tuzilgan testlar: ${await c("SELECT COUNT(*) c FROM quizzes")}`,
    `🎯 Yechilgan testlar: ${await c("SELECT COUNT(*) c FROM results")}`,
    `📅 Kunlik savol: bugun ${await c("SELECT COUNT(*) c FROM daily_votes WHERE day=?", todayKey())} kishi javob berdi, o'chirib qo'yganlar: ${await c("SELECT COUNT(*) c FROM users WHERE nodq=1")}`,
    "💾 Baza: Cloudflare D1 (o'chib ketmaydi)",
    ...(top.length ? ["", "🏅 Eng ko'p yechilgan testlar egasi:", ...top] : []),
  ].join("\n");
}

async function showUsers(ctx) {
  if (ctx.chatId !== ctx.from.id) return ctx.reply("Ro'yxatni botning shaxsiy chatida oching.");
  const users = await all(ctx.env, "SELECT id, name, username, blocked FROM users ORDER BY joined DESC LIMIT 15");
  const total = (await first(ctx.env, "SELECT COUNT(*) c FROM users")).c;
  const entities = [], rows = [];
  let text = "👥 So'nggi foydalanuvchilar:\n\n";
  for (const [i, u] of users.entries()) {
    const username = u.username || "";
    const label = (u.name || "Foydalanuvchi") + (username ? " @" + username : "");
    const url = /^[a-z0-9_]+$/i.test(username) ? `https://t.me/${username}` : `tg://user?id=${u.id}`;
    text += `${i + 1}. `;
    entities.push({ type: "text_link", offset: text.length, length: label.length, url });
    text += label + (u.blocked ? " 🚫" : "") + "\n";
    rows.push([urlBtn(`👤 ${i + 1}. ${username ? "@" + username : u.name || "Profil"}`, url)]);
  }
  if (!users.length) text += "Hali yo'q\n";
  text += `\nJami: ${total}`;
  const options = (buttons, links) => ({
    ...ik([...buttons, ...BACK_KB.reply_markup.inline_keyboard]), entities: links,
    link_preview_options: { is_disabled: true },
  });
  try {
    return await put(ctx, text, options(rows, entities));
  } catch (e) {
    if (!/BUTTON_USER_PRIVACY_RESTRICTED|BUTTON_USER_INVALID|USER_ID_INVALID|INPUT_USER_DEACTIVATED/i.test(e.desc || e.message)) throw e;
    return put(ctx, text, options(rows.filter(([btn]) => btn.url.startsWith("https:")), entities.filter(link => link.url.startsWith("https:"))));
  }
}

async function openPanel(ctx) {
  const { env } = ctx;
  if (!adminIds(env).length) {
    return ctx.reply(
      `Admin hali sozlanmagan.\n\nSizning Telegram ID: ${ctx.from.id}\n\n` +
        `Cloudflare > Workers > qanchalik-bilasan-bot > Settings > Variables and Secrets ga ADMIN_IDS = ${ctx.from.id} qo'shing ` +
        `(bir nechta admin bo'lsa vergul bilan).`
    );
  }
  if (!isAdmin(env, ctx.from.id)) return ctx.reply("Quyidagilardan birini tanlang 👇", mainKb(env, ctx.from.id));
  await kvDel(env, `adm:${ctx.from.id}`);
  return ctx.reply(await panelText(env), PANEL_KB);
}

const confirmKb = (st) =>
  ik([
    [cb(st.btn ? "🔘 Tugma: ✅ bor" : "🔘 Tugma: ❌ yo'q", "a:bctoggle")],
    [cb("✅ Yuborish", "a:bcgo"), cb("❌ Bekor", "a:home")],
  ]);
const confirmText = (n) =>
  `👆 Xabar shunday ko'rinadi.\n\n${n} kishiga yuboraymi?\n\n"Tugma" yoqilsa, xabar tagida "🎮 Test tuzish" tugmasi chiqadi.`;

// admin keyingi yuborgan xabarini ushlab oladi (xabar yuborish yoki tiklash rejimida). true = ushlandi
async function adminCapture(ctx, m) {
  const { env } = ctx;
  if (!ctx.from || !isAdmin(env, ctx.from.id)) return false;
  const stKey = `adm:${ctx.from.id}`;
  const st = await getJ(env, stKey);
  if (!st) return false;
  if (m.text && (m.text.startsWith("/") || MENU_TEXTS.includes(m.text))) {
    await kvDel(env, stKey);
    return false;
  }
  if (st.mode === "bc" || st.mode === "confirm") {
    st.src = { chat: ctx.chatId, id: m.message_id };
    st.mode = "confirm";
    await setJ(env, stKey, st);
    await tg(env, "copyMessage", { chat_id: ctx.chatId, from_chat_id: ctx.chatId, message_id: m.message_id });
    await ctx.reply(confirmText(await recipientsCount(env)), confirmKb(st));
    return true;
  }
  if (st.mode === "restore") {
    if (!m.document) {
      await ctx.reply("Iltimos, .json zaxira faylini yuboring yoki /bekor");
      return true;
    }
    try {
      const data = await fetchBackup(env, m.document.file_id);
      const r = await mergeBackup(env, data);
      await kvDel(env, stKey);
      await ctx.reply(`✅ Tiklandi: +${r.addedUsers} foydalanuvchi, +${r.addedQuizzes} test`, PANEL_KB);
    } catch (e) {
      await ctx.reply("❌ Faylni o'qib bo'lmadi: " + e.message);
    }
    return true;
  }
  return false;
}

// --- "hammaga xabar": ish kv'da saqlanadi, cron har daqiqada bo'laklab yuboradi
const batchSize = (env) => Math.max(1, Number(env.BATCH) || 25);

async function broadcastTick(env) {
  const job = await getJ(env, "bc:job");
  if (!job) return false;
  if (!(await lease(env, "bc", 120000))) return true;
  try {
    const list = await all(env, "SELECT id FROM users WHERE blocked=0 AND id>? ORDER BY id LIMIT ?", job.cursor, batchSize(env));
    const extra = job.btn ? ik([[cb("🎮 Test tuzish", "new")]]) : {};
    const blockedIds = [];
    let rateLimited = false;
    for (const u of list) {
      let res = "fail";
      try {
        await tg(env, "copyMessage", { chat_id: u.id, from_chat_id: job.src.chat, message_id: job.src.id, ...extra });
        res = "ok";
      } catch (e) {
        if (e.code === 429) res = "rate";
        else if (e.code === 403 || /chat not found|deactivated/i.test(e.desc || "")) res = "blocked";
      }
      if (res === "rate") { rateLimited = true; break; } // keyingi daqiqada shu yerdan davom etadi
      job.cursor = u.id;
      if (res === "ok") job.ok++;
      else if (res === "blocked") { job.blocked++; blockedIds.push(u.id); }
      else job.fail++;
    }
    if (blockedIds.length) {
      await env.DB.batch(blockedIds.map((id) => env.DB.prepare("UPDATE users SET blocked=1 WHERE id=?").bind(id)));
    }
    const finished = !rateLimited && list.length < batchSize(env); // ro'yxat tugadi
    const edit = (text, extra2) =>
      tg(env, "editMessageText", { chat_id: job.adminChat, message_id: job.statusId, text, ...(extra2 || {}) }).catch(() => {});
    if (finished) {
      await kvDel(env, "bc:job");
      await edit(`✅ Xabar yuborish tugadi!\n\n📬 Yetkazildi: ${job.ok}\n🚫 Botni bloklagan: ${job.blocked}\n⚠️ Xato: ${job.fail}`, BACK_KB);
    } else {
      await setJ(env, "bc:job", job);
      await edit(`🚀 Yuborilmoqda... ${job.ok + job.blocked + job.fail}/${job.total}`);
    }
    return true;
  } finally {
    await release(env, "bc");
  }
}

// --- zaxira (backup) va tiklash. Format Render'dagi bilan bir xil, shuning uchun eski zaxira ham yaraydi
async function backupData(env) {
  const [us, qs, rs, ps, ds, dv, pl, done] = await Promise.all([
    all(env, "SELECT * FROM users"),
    all(env, "SELECT * FROM quizzes"),
    all(env, "SELECT * FROM results"),
    all(env, "SELECT * FROM progress"),
    all(env, "SELECT * FROM daily"),
    all(env, "SELECT * FROM daily_votes"),
    all(env, "SELECT * FROM polls"),
    kvGet(env, "daily:done"),
  ]);
  const users = {};
  for (const u of us) {
    users[u.id] = { name: u.name, username: u.username || "", joined: u.joined, last: u.last_seen, blocked: !!u.blocked, hide: !!u.hide, nodq: !!u.nodq, dqDay: u.dq_day || "" };
  }
  const quizzes = {};
  for (const q of qs) {
    quizzes[q.qk] = { owner: q.owner, ownerName: q.owner_name, style: q.style, qids: JSON.parse(q.qids), answers: JSON.parse(q.answers), results: [], progress: {}, t: q.t };
  }
  for (const r of rs) if (quizzes[r.qk]) quizzes[r.qk].results.push({ id: r.uid, name: r.name, p: r.p, right: r.hit, n: r.n, dx: r.dx });
  for (const p of ps) if (quizzes[p.qk]) quizzes[p.qk].progress[p.uid] = { guesses: JSON.parse(p.guesses) };
  const days = {};
  for (const d of ds) {
    const nopts = (DAILY[d.qi] && DAILY[d.qi].opts.length) || 4;
    days[d.day] = { qi: d.qi, votes: Array(nopts).fill(0), voters: {} };
  }
  for (const v of dv) {
    const d = days[v.day];
    if (d) { d.voters[v.uid] = v.opt; if (v.opt < d.votes.length) d.votes[v.opt]++; }
  }
  const polls = {};
  for (const p of pl) polls[p.poll_id] = { key: p.qk, step: p.step, uid: p.uid, order: JSON.parse(p.ord), t: p.t };
  return { users, quizzes, daily: { done: done || "", days }, polls, ts: Date.now() };
}

// Yangi zaxirani qo'shib olish (mavjudni o'chirmaydi)
async function mergeBackup(env, data) {
  const st = [];
  const P = (sql, ...a) => st.push(env.DB.prepare(sql).bind(...a.map((x) => (x === undefined ? null : x))));
  const haveU = new Set((await all(env, "SELECT id FROM users")).map((r) => String(r.id)));
  const haveQ = new Set((await all(env, "SELECT qk FROM quizzes")).map((r) => r.qk));
  let addedUsers = 0, addedQuizzes = 0;
  const addUser = (id, u) => {
    const n = Number(id);
    if (!Number.isFinite(n) || haveU.has(String(n))) return;
    haveU.add(String(n));
    addedUsers++;
    P(
      "INSERT OR IGNORE INTO users(id,name,username,joined,last_seen,blocked,hide,nodq,dq_day) VALUES(?,?,?,?,?,?,?,?,?)",
      n, u.name || "Do'st", u.username || "", Number(u.joined) || Date.now(), Number(u.last) || 0, u.blocked ? 1 : 0, u.hide ? 1 : 0, u.nodq ? 1 : 0, u.dqDay || ""
    );
  };
  for (const [id, u] of Object.entries(data.users || {})) if (u && typeof u === "object") addUser(id, u);
  for (const [k, q] of Object.entries(data.quizzes || {})) {
    if (haveQ.has(k) || !q || !Array.isArray(q.qids) || !Array.isArray(q.answers)) continue;
    haveQ.add(k);
    addedQuizzes++;
    P("INSERT OR IGNORE INTO quizzes(qk,owner,owner_name,style,qids,answers,t) VALUES(?,?,?,?,?,?,?)",
      k, q.owner, q.ownerName || "Do'st", q.style || "mix", JSON.stringify(q.qids), JSON.stringify(q.answers), Number(q.t) || Date.now());
    addUser(q.owner, { name: q.ownerName, joined: q.t });
    for (const r of q.results || []) {
      P("INSERT OR IGNORE INTO results(qk,uid,name,p,hit,n,dx) VALUES(?,?,?,?,?,?,?)", k, r.id, r.name || "Do'st", r.p, r.right, r.n, Number.isInteger(r.dx) ? r.dx : null);
      addUser(r.id, { name: r.name, joined: q.t });
    }
    for (const [uid, pr] of Object.entries(q.progress || {})) {
      if (pr && Array.isArray(pr.guesses)) P("INSERT OR IGNORE INTO progress(qk,uid,guesses) VALUES(?,?,?)", k, Number(uid), JSON.stringify(pr.guesses));
    }
  }
  const dd = data.daily;
  if (dd && typeof dd === "object") {
    const cur = await kvGet(env, "daily:done");
    if (typeof dd.done === "string" && dd.done > (cur || "")) P("INSERT INTO kv(k,v) VALUES('daily:done',?) ON CONFLICT(k) DO UPDATE SET v=excluded.v", dd.done);
    for (const [k, d] of Object.entries(dd.days || {})) {
      if (d && Number.isInteger(d.qi) && d.voters && typeof d.voters === "object") {
        P("INSERT OR IGNORE INTO daily(day,qi) VALUES(?,?)", k, d.qi);
        for (const [uid, opt] of Object.entries(d.voters)) P("INSERT OR IGNORE INTO daily_votes(day,uid,opt) VALUES(?,?,?)", k, Number(uid), Number(opt));
      }
    }
  }
  for (const [pid, p] of Object.entries(data.polls || {})) {
    if (p && p.key && Array.isArray(p.order)) P("INSERT OR IGNORE INTO polls(poll_id,qk,step,uid,ord,t) VALUES(?,?,?,?,?,?)", pid, p.key, p.step, p.uid, JSON.stringify(p.order), p.t || Date.now());
  }
  for (let i = 0; i < st.length; i += 80) await env.DB.batch(st.slice(i, i + 80));
  return { addedUsers, addedQuizzes };
}

async function adminAction(ctx, name) {
  const { env } = ctx;
  const id = ctx.from.id;
  if (name === "home") {
    await ctx.answer();
    await kvDel(env, `adm:${id}`);
    return put(ctx, await panelText(env), PANEL_KB);
  }
  if (name === "stats") { await ctx.answer(); return put(ctx, await statsText(env), BACK_KB); }
  if (name === "users") { await ctx.answer(); return showUsers(ctx); }
  if (name === "bc") {
    await ctx.answer();
    await setJ(env, `adm:${id}`, { mode: "bc", btn: true });
    return put(
      ctx,
      `📢 Xabar yuborish\n\nXabar ${await recipientsCount(env)} kishiga boradi. Yubormoqchi bo'lgan xabaringizni shu yerga yuboring: ` +
        `matn, rasm, video, ovozli xabar — hammasi bo'ladi.\n\nBekor qilish: /bekor`,
      BACK_KB
    );
  }
  if (name === "bctoggle") {
    const st = await getJ(env, `adm:${id}`);
    if (!st || st.mode !== "confirm") return ctx.answer("Xabar topilmadi");
    st.btn = !st.btn;
    await setJ(env, `adm:${id}`, st);
    await ctx.answer(st.btn ? "Tugma yoqildi" : "Tugma o'chirildi");
    try { await ctx.editMarkup(confirmKb(st).reply_markup); } catch (e) {}
    return;
  }
  if (name === "bcgo") {
    const st = await getJ(env, `adm:${id}`);
    if (!st || st.mode !== "confirm" || !st.src) return ctx.answer("Xabar topilmadi, qaytadan boshlang");
    if (await kvGet(env, "bc:job")) return ctx.answer("Hozir boshqa xabar yuborilmoqda ⏳");
    await kvDel(env, `adm:${id}`);
    await ctx.answer("🚀 Boshlandi");
    try { await ctx.editMarkup(); } catch (e) {}
    const total = await recipientsCount(env);
    const status = await ctx.reply(`🚀 Yuborilmoqda... 0/${total}`);
    await setJ(env, "bc:job", { src: st.src, btn: !!st.btn, adminChat: ctx.chatId, statusId: status.message_id, total, cursor: 0, ok: 0, blocked: 0, fail: 0 });
    return broadcastTick(env); // birinchi bo'lakni darrov yuboramiz, qolganini cron davom ettiradi
  }
  if (name === "backup") {
    await ctx.answer();
    const fname = `qanchalik-backup-${new Date().toISOString().slice(0, 10)}.json`;
    return tgDocument(env, ctx.chatId, fname, JSON.stringify(await backupData(env)), "💾 Zaxira nusxa. Kerak bo'lsa ♻️ Tiklash orqali shu faylni qaytarib yuboring.");
  }
  if (name === "restore") {
    await ctx.answer();
    await setJ(env, `adm:${id}`, { mode: "restore" });
    return put(
      ctx,
      "♻️ Tiklash\n\nZaxira .json faylini shu yerga yuboring. Yoki Render'dagi eski bot Telegram'da qadab qo'ygan zaxiradan olish uchun pastdagi tugmani bosing.\n\n" +
        "Mavjud ma'lumotlar o'chmaydi, faqat yo'q bo'lganlari qo'shiladi.\n\nBekor qilish: /bekor",
      ik([[cb("📌 Qadalgan zaxiradan tiklash", "a:pinned")], [cb("🔙 Panelga qaytish", "a:home")]])
    );
  }
  if (name === "pinned") {
    await ctx.answer("⏳");
    const chatId = adminIds(env)[0];
    try {
      const pm = (await tg(env, "getChat", { chat_id: chatId })).pinned_message;
      if (!pm || !pm.document || !String(pm.caption || "").includes(BACKUP_TAG)) {
        return ctx.reply("Qadalgan zaxira topilmadi. Zaxira faylini o'zingiz yuboring yoki /bekor");
      }
      const r = await mergeBackup(env, await fetchBackup(env, pm.document.file_id));
      await kvDel(env, `adm:${id}`);
      return ctx.reply(`✅ Qadalgan zaxiradan tiklandi: +${r.addedUsers} foydalanuvchi, +${r.addedQuizzes} test`, PANEL_KB);
    } catch (e) {
      return ctx.reply("❌ Zaxirani o'qib bo'lmadi: " + e.message);
    }
  }
}

// ------------------------------------------------------------------ test tuzish
const askLength = (ctx) =>
  ctx.reply("Nechta savoldan iborat test tuzamiz?", ik([LENGTHS.map((n) => cb(`${n} ta`, `len:${n}`))]));

async function showOwnerQ(ctx, quiz, step) {
  const n = quiz.qids.length;
  const q = QUESTIONS[quiz.qids[step]];
  const rows = (q.oo || q.opts).map((o, i) => [cb(o, `o:${quiz.key}:${step}:${i}`)]);
  rows.push([cb("🔄 Boshqa savol", `r:${quiz.key}:${step}`)]);
  return put(ctx, `${L.bar(step, n)}  ${step + 1}/${n}\n\n${q.o}`, ik(rows));
}

async function shareKb(env, qk) {
  const link = await linkFor(env, qk);
  const share =
    "https://t.me/share/url?url=" + encodeURIComponent(link) +
    "&text=" + encodeURIComponent("Meni qanchalik taniysan? 😏 Sinab ko'r, necha foiz chiqarkan!");
  return ik([[urlBtn("📤 Do'stga yuborish", share)], [cb("🏆 Natijalarim", "res")]]);
}

async function myLinks(ctx) {
  const { env } = ctx;
  const mine = await all(
    env,
    `SELECT q.qk, json_array_length(q.qids) n, (SELECT COUNT(*) FROM results r WHERE r.qk=q.qk) solved
     FROM quizzes q WHERE q.owner=? AND json_array_length(q.answers)=json_array_length(q.qids) ORDER BY q.t DESC LIMIT 5`,
    ctx.from.id
  );
  if (!mine.length) return ctx.reply("Hali test tuzmagansiz. Boshlaymizmi? 👇", ik([[cb("🎮 Test tuzish", "new")]]));
  const lines = [];
  for (const q of mine) lines.push(`🔗 ${await linkFor(env, q.qk)}\n${q.n} ta savol · ${q.solved} kishi yechgan`);
  return ctx.reply("📤 Sizning so'nggi testlaringiz:\n\n" + lines.join("\n\n"), { link_preview_options: { is_disabled: true } });
}

// ------------------------------------------------------------------ do'st taxmin qiladi
async function sendGuessQ(env, uid, qk, step, quizIn) {
  const quiz = quizIn || (await getQuiz(env, qk));
  if (!quiz) return;
  const n = quiz.qids.length;
  const q = QUESTIONS[quiz.qids[step]];
  const order = L.shuffle([0, 1, 2, 3]);
  const correct = quiz.answers[step];
  const head = `${step + 1}/${n} · ${L.ask(quiz.ownerName, q.g)}`;
  let m = null;
  try {
    // so'rovnoma (quiz): javob berishi bilan to'g'ri/xato darrov ko'rinadi
    m = await tg(env, "sendPoll", {
      chat_id: uid,
      question: head.slice(0, 300),
      options: order.map((i) => q.opts[i].slice(0, 100)),
      type: "quiz",
      is_anonymous: false,
      correct_option_id: order.indexOf(correct),
      explanation: `${quiz.ownerName} aynan shuni tanlagan: ${q.opts[correct]}`.slice(0, 200),
    });
  } catch (e) {
    console.log("sendPoll xato, tugmalarga o'tdim:", e.message);
    const rows = order.map((i) => [cb(q.opts[i], `g:${qk}:${step}:${i}`)]);
    await tg(env, "sendMessage", { chat_id: uid, text: `${L.bar(step, n)}\n\n${head}`, ...ik(rows) });
    return;
  }
  await run(env, "INSERT OR REPLACE INTO polls(poll_id,qk,step,uid,ord,t) VALUES(?,?,?,?,?,?)", m.poll.id, qk, step, uid, JSON.stringify(order), Date.now());
}

async function recordGuess(env, user, qk, step, real) {
  const quiz = await getQuiz(env, qk);
  if (!quiz) return;
  const row = await first(env, "SELECT guesses FROM progress WHERE qk=? AND uid=?", qk, user.id);
  const guesses = row ? JSON.parse(row.guesses) : [];
  if (guesses.length !== step) return;
  guesses.push(real);
  await run(env, "INSERT INTO progress(qk,uid,guesses) VALUES(?,?,?) ON CONFLICT(qk,uid) DO UPDATE SET guesses=excluded.guesses", qk, user.id, JSON.stringify(guesses));
  await sleep(1800);
  if (step + 1 < quiz.qids.length) return sendGuessQ(env, user.id, qk, step + 1, quiz);
  return finishGuess(env, user, qk, quiz, guesses);
}

async function finishGuess(env, user, qk, quiz, guesses) {
  const n = quiz.qids.length;
  const hit = guesses.filter((g, i) => g === quiz.answers[i]).length;
  const p = Math.round((hit / n) * 100);
  const dx = L.diagnosis(p); // kulgili tashxis (do'stga ham, egasiga ham bir xil ko'rinadi)
  await run(env, "INSERT OR IGNORE INTO results(qk,uid,name,p,hit,n,dx) VALUES(?,?,?,?,?,?,?)", qk, user.id, nameOf(user), p, hit, n, dx.idx);

  const wrong = guesses
    .map((g, i) => [g, i])
    .filter(([g, i]) => g !== quiz.answers[i])
    .map(([g, i]) => {
      const q = QUESTIONS[quiz.qids[i]];
      return `${i + 1}) "${q.opts[g]}" dedingiz, aslida "${q.opts[quiz.answers[i]]}"`;
    });

  // do'st natijasini o'z do'stlariga ulashishi uchun tugma (bot havolasi bilan)
  const botLink = `https://t.me/${await botName(env)}`;
  const shareText = `😎 Men ${L.sufName(quiz.ownerName, "ni")} ${p}% taniyman!\n${dx.text}\n\nSen meni qanchalik taniysan? 👇`;
  const rows = [
    [cb("🔥 Men seni qanchalik bilaman, tekshir!", "new")],
    [urlBtn("📤 Natijani do'stlarga ulashish", "https://t.me/share/url?url=" + encodeURIComponent(botLink) + "&text=" + encodeURIComponent(shareText))],
  ];
  await tg(env, "sendMessage", {
    chat_id: user.id,
    text:
      `🎯 Siz ${L.sufName(quiz.ownerName, "ni")} ${p}% taniysiz!\n\n${L.marks(guesses, quiz.answers)}  (${hit}/${n})\n${L.title(p)}\n\n${dx.text}` +
      (wrong.length ? `\n\n❌ Xatolaringiz:\n${wrong.join("\n")}` : "\n\n💯 Hammasini topdingiz!"),
    ...ik(rows),
  });
  await sendSticker(env, user.id, L.mood(p));

  try {
    const friendCount = (await friendsOf(env, quiz.owner)).length;
    await tg(env, "sendMessage", {
      chat_id: quiz.owner,
      text: `📩 ${nameOf(user)} testingizni yechdi!\n\nSizni ${p}% taniydi (${hit}/${n})\n${L.title(p)}\n\n${dx.text}\n\n👥 Hozircha ${friendCount} do'st yechgan`,
      ...(await shareKb(env, qk)),
    });
  } catch (e) {}
}

// ------------------------------------------------------------------ reyting
const MEDAL = ["🥇", "🥈", "🥉"];
const NO_RESULTS = "Hali hech kim testingizni yechmagan. Havolani do'stlaringizga yuboring 📤";

// Bir do'st bir necha test yechgan bo'lsa ham bir marta sanaladi (eng yaxshi natijasi bilan)
const friendsOf = (env, ownerId) =>
  all(
    env,
    `SELECT r.uid id, r.name name, MAX(r.p) p FROM results r JOIN quizzes q ON q.qk=r.qk
     WHERE q.owner=? GROUP BY r.uid ORDER BY p DESC`,
    ownerId
  );

async function ratingText(env, uid) {
  const fr = await friendsOf(env, uid);
  if (!fr.length) return null;
  const avg = Math.round(fr.reduce((s, f) => s + f.p, 0) / fr.length);
  const lines = fr.slice(0, 10).map((r, i) => `${MEDAL[i] || i + 1 + "."} ${shortName(r.name)}: ${r.p}%`);
  return "🏆 Sizni eng yaxshi taniydiganlar:\n\n" + lines.join("\n") + `\n\n👥 Jami: ${fr.length} do'st yechgan\n📊 O'rtacha: ${avg}%`;
}

const globalBoard = (env) =>
  all(
    env,
    `SELECT b.owner id, b.n n, b.avg avg, u.name name, COALESCE(u.hide,0) hide FROM (
       SELECT owner, COUNT(*) n, CAST(ROUND(AVG(p)) AS INTEGER) avg FROM (
         SELECT q.owner owner, r.uid uid, MAX(r.p) p FROM results r JOIN quizzes q ON q.qk=r.qk GROUP BY q.owner, r.uid
       ) GROUP BY owner HAVING COUNT(*) >= ${MIN_FRIENDS}
     ) b LEFT JOIN users u ON u.id=b.owner ORDER BY b.n DESC, b.avg DESC`
  );

async function globalText(env, uid) {
  const board = await globalBoard(env);
  const vis = board.filter((r) => !r.hide);
  const lines = vis.slice(0, 10).map((r, i) => `${MEDAL[i] || i + 1 + "."} ${shortName(r.name)}: ${r.n} do'st, o'rtacha ${r.avg}%`);
  const mine = board.find((r) => r.id === uid);
  let me;
  if (mine && mine.hide) me = "🙈 Siz reytingdan yashirinib turibsiz. Boshqalar sizni ko'rmaydi.";
  else if (mine) me = `📍 Sizning o'rningiz: ${vis.findIndex((r) => r.id === uid) + 1}-o'rin (${mine.n} do'st)`;
  else me = `📍 Reytingga kirish uchun kamida ${MIN_FRIENDS} do'st testingizni yechishi kerak (hozir ${(await friendsOf(env, uid)).length} ta).`;
  return (
    "🌍 Eng mashhurlar reytingi\n(testini ko'proq do'st yechgan odam yuqorida turadi)\n\n" +
    (lines.length ? lines.join("\n") : "Hali hech kim reytingga kirmagan. Birinchi bo'ling! 🚀") +
    "\n\n" + me
  );
}

async function ratingKb(env, uid, view) {
  const u = await first(env, "SELECT hide FROM users WHERE id=?", uid);
  const hidden = !!(u && u.hide);
  const rows = [[view === "g" ? cb("👤 Mening reytingim", "rt:me") : cb("🌍 Umumiy reyting", "rt:g")]];
  if (view === "g") rows.push([cb(hidden ? "👁 Reytingda ko'rinish" : "🙈 Reytingdan yashirinish", hidden ? "rt:show" : "rt:hide")]);
  rows.push([cb("🎮 Test tuzish", "new")]);
  return ik(rows);
}

async function showResults(ctx) {
  const { env } = ctx;
  return ctx.reply((await ratingText(env, ctx.from.id)) || NO_RESULTS, await ratingKb(env, ctx.from.id, "me"));
}

// ------------------------------------------------------------------ kunlik savol
const tkDate = () => new Date(Date.now() + TZ_MS);
const todayKey = () => tkDate().toISOString().slice(0, 10);
const prevKey = (key) => new Date(Date.parse(key + "T00:00:00Z") - DAY).toISOString().slice(0, 10);
const dailyHour = (env) => {
  const h = env.DAILY_HOUR;
  return h && Number.isInteger(Number(h)) ? Math.min(23, Math.max(0, Number(h))) : 19;
};

async function ensureDay(env, key) {
  const qi = Math.floor(Date.parse(key + "T00:00:00Z") / DAY) % DAILY.length;
  await run(env, "INSERT OR IGNORE INTO daily(day,qi) VALUES(?,?)", key, qi);
  return { day: key, qi: (await first(env, "SELECT qi FROM daily WHERE day=?", key)).qi };
}
const getDay = (env, key) => first(env, "SELECT day, qi FROM daily WHERE day=?", key);
const dayQ = (day) => (day && DAILY[day.qi]) || null;

async function dayVotes(env, key, nopts) {
  const votes = Array(nopts).fill(0);
  for (const r of await all(env, "SELECT opt, COUNT(*) c FROM daily_votes WHERE day=? GROUP BY opt", key)) if (r.opt < nopts) votes[r.opt] = r.c;
  return votes;
}
const sum = (a) => a.reduce((s, v) => s + (Number(v) || 0), 0);

async function prevSummary(env, key) {
  const pk = prevKey(key);
  const q = dayQ(await getDay(env, pk));
  if (!q) return "";
  const votes = await dayVotes(env, pk, q.opts.length);
  const total = sum(votes);
  if (total < 3) return "";
  const top = votes.indexOf(Math.max(...votes));
  return `📊 Kechagi savol: «${q.q}»\nEng ko'p tanlangan: ${q.opts[top]} (${Math.round((votes[top] / total) * 100)}%)\n\n`;
}

const dailyToggleBtn = (off) => cb(off ? "🔔 Kunlik savolni yoqish" : "🔕 Kunlik savolni o'chirish", off ? "dq:on" : "dq:off");

// MUHIM: o'chirish/yoqish tugmasi doim OXIRGI qatorda turadi (dq:on/off uni shu joydan almashtiradi)
async function dailyView(env, key, day, uid) {
  const q = dayQ(day);
  const u = uid ? await first(env, "SELECT nodq FROM users WHERE id=?", uid) : null;
  const off = !!(u && u.nodq);
  const mineRow = uid ? await first(env, "SELECT opt FROM daily_votes WHERE day=? AND uid=?", key, uid) : null;
  if (!mineRow) {
    return {
      text: `🎯 Kunlik savol\n\n${await prevSummary(env, key)}${q.q}\n\n👇 Javobingizni tanlang. Boshqalar nima tanlaganini ham ko'rasiz!`,
      extra: ik([...q.opts.map((o, i) => [cb(o, `dq:${key}:${i}`)]), [dailyToggleBtn(off)]]),
    };
  }
  const votes = await dayVotes(env, key, q.opts.length);
  const total = sum(votes);
  const lines = q.opts.map((o, i) => {
    const pct = total ? Math.round((votes[i] / total) * 100) : 0;
    const f = Math.round(pct / 10);
    return `${o}${mineRow.opt === i ? "  ✅ siz" : ""}\n${"▰".repeat(f)}${"▱".repeat(10 - f)} ${pct}%`;
  });
  const link = `https://t.me/${await botName(env)}?start=dq`;
  const share = "https://t.me/share/url?url=" + encodeURIComponent(link) + "&text=" + encodeURIComponent(`🎯 Bugungi savol: «${q.q}»\nSen nima tanlaysan? 👇`);
  return {
    text: `🎯 Kunlik savol\n\n${q.q}\n\n${lines.join("\n\n")}\n\n👥 Jami ${total} kishi javob berdi`,
    extra: ik([[urlBtn("📤 Do'stlarga yuborish", share)], [cb("🎮 Do'stim meni qanchalik biladi? Test tuzish", "new")], [dailyToggleBtn(off)]]),
  };
}

async function sendDaily(ctx) {
  const key = todayKey();
  const day = await ensureDay(ctx.env, key);
  const v = await dailyView(ctx.env, key, day, ctx.from.id);
  return ctx.reply(v.text, v.extra);
}

const setNoDaily = (env, id, off) => run(env, "UPDATE users SET nodq=? WHERE id=?", off ? 1 : 0, id);

async function dailyTick(env) {
  if (env.DAILY_OFF === "1") return;
  const key = todayKey();
  const h = tkDate().getUTCHours();
  const start = dailyHour(env);
  if (h < start || h >= start + DAILY_WINDOW) return;
  if ((await kvGet(env, "daily:done")) === key) return;
  if (!(await lease(env, "daily", 120000))) return;
  try {
    const day = await ensureDay(env, key);
    if (!dayQ(day)) return;
    const list = await all(
      env,
      `SELECT id FROM users u WHERE blocked=0 AND nodq=0 AND dq_day != ? AND (last_seen=0 OR last_seen>?)
       AND NOT EXISTS (SELECT 1 FROM daily_votes d WHERE d.day=? AND d.uid=u.id) ORDER BY id LIMIT ?`,
      key, Date.now() - DAILY_SKIP_AFTER, key, batchSize(env)
    );
    if (!list.length) {
      await kvSet(env, "daily:done", key);
      console.log(`Kunlik savol ${key}: hammaga yuborildi`);
      return;
    }
    const v = await dailyView(env, key, day, 0); // hali hech kim javob bermagan ko'rinish
    const mark = [];
    const block = [];
    let ok = 0, blocked = 0, fail = 0;
    for (const u of list) {
      try {
        await tg(env, "sendMessage", { chat_id: u.id, text: v.text, ...v.extra });
        ok++; mark.push(u.id);
      } catch (e) {
        if (e.code === 429) break; // keyingi daqiqada davom etadi
        if (e.code === 403 || /chat not found|deactivated/i.test(e.desc || "")) { blocked++; block.push(u.id); }
        else { fail++; mark.push(u.id); } // qayta-qayta urinmaslik uchun bugunga belgilab qo'yamiz
      }
    }
    const st = [
      ...mark.map((id) => env.DB.prepare("UPDATE users SET dq_day=? WHERE id=?").bind(key, id)),
      ...block.map((id) => env.DB.prepare("UPDATE users SET blocked=1 WHERE id=?").bind(id)),
    ];
    if (st.length) await env.DB.batch(st);
    console.log(`Kunlik savol ${key}: yuborildi ${ok}, bloklagan ${blocked}, xato ${fail}`);
  } finally {
    await release(env, "daily");
  }
}

// eski ma'lumotlarni tozalash (soatiga bir marta)
async function housekeeping(env) {
  await run(env, "DELETE FROM polls WHERE t<?", Date.now() - 2 * DAY);
  const cutoff = new Date(Date.parse(todayKey() + "T00:00:00Z") - 3 * DAY).toISOString().slice(0, 10);
  await run(env, "DELETE FROM daily WHERE day<?", cutoff);
  await run(env, "DELETE FROM daily_votes WHERE day<?", cutoff);
}

async function tick(env) {
  await ensureSchema(env);
  const busy = await broadcastTick(env).catch((e) => { console.log("Broadcast xato:", e.message); return false; });
  if (!busy) await dailyTick(env).catch((e) => console.log("Kunlik savol xato:", e.message));
  if (new Date().getUTCMinutes() === 0) await housekeeping(env).catch((e) => console.log("Tozalash xato:", e.message));
}

// ------------------------------------------------------------------ buyruqlar va tugmalar
async function cmdStart(ctx, key) {
  const { env } = ctx;
  if (key === "dq") {
    // kunlik savol havolasi orqali kelgan yangi odam: salom + bugungi savol
    await sendSticker(env, ctx.chatId, "welcome");
    await ctx.reply(WELCOME, mainKb(env, ctx.from.id));
    return sendDaily(ctx);
  }
  const quiz = key ? await getQuiz(env, key) : null;
  if (!quiz || quiz.answers.length !== quiz.qids.length) {
    await sendSticker(env, ctx.chatId, "welcome");
    return ctx.reply(WELCOME, mainKb(env, ctx.from.id));
  }
  if (quiz.owner === ctx.from.id) {
    return ctx.reply("Bu sizning o'z testingiz 😄 Havolani do'stingizga yuboring!", await shareKb(env, key));
  }
  const prev = await first(env, "SELECT p FROM results WHERE qk=? AND uid=?", key, ctx.from.id);
  if (prev) {
    return ctx.reply(`Siz bu testni allaqachon yechgansiz: ${L.sufName(quiz.ownerName, "ni")} ${prev.p}% taniysiz.\n\nO'zingiz ham test tuzib ko'ring 👇`, MENU);
  }
  const pr = await first(env, "SELECT guesses FROM progress WHERE qk=? AND uid=?", key, ctx.from.id);
  const guesses = pr ? JSON.parse(pr.guesses) : [];
  if (guesses.length >= quiz.qids.length) return finishGuess(env, ctx.from, key, quiz, guesses);
  await sendSticker(env, ctx.chatId, "welcome");
  await ctx.reply(
    `👀 ${quiz.ownerName} sizga savol yubordi:\n\n"Meni qanchalik taniysan?" 😏\n\n` +
      `${quiz.qids.length} ta savol bor. Har birida ${quiz.ownerName} nima tanlaganini toping!`,
    mainKb(env, ctx.from.id)
  );
  await sleep(1200);
  return sendGuessQ(env, ctx.from.id, key, guesses.length, quiz); // yarim qolgan bo'lsa, shu joydan davom etadi
}

const COMMANDS = {
  start: (ctx, arg) => cmdStart(ctx, arg),
  yordam: (ctx) => ctx.reply(HELP, MENU),
  natijalar: (ctx) => showResults(ctx),
  reyting: (ctx) => showResults(ctx),
  kunlik: (ctx) => sendDaily(ctx),
  kunlik_off: async (ctx) => {
    await setNoDaily(ctx.env, ctx.from.id, true);
    return ctx.reply("🔕 Kunlik savol o'chirildi. Qayta yoqish: /kunlik_on");
  },
  kunlik_on: async (ctx) => {
    await setNoDaily(ctx.env, ctx.from.id, false);
    return ctx.reply("🔔 Kunlik savol yoqildi! Har kuni kechqurun yangi savol yuboraman.");
  },
  admin: (ctx) => openPanel(ctx),
  id: (ctx) => ctx.reply(`Sizning Telegram ID: ${ctx.from.id}`),
  bekor: async (ctx) => {
    await kvDel(ctx.env, `adm:${ctx.from.id}`);
    return ctx.reply("Bekor qilindi ✅", mainKb(ctx.env, ctx.from.id));
  },
};

const HEARS = {
  [BTN.new]: (ctx) => askLength(ctx),
  [BTN.res]: (ctx) => showResults(ctx),
  [BTN.daily]: (ctx) => sendDaily(ctx),
  [BTN.help]: (ctx) => ctx.reply(HELP, MENU),
  [BTN.links]: (ctx) => myLinks(ctx),
  [BTN.admin]: (ctx) => openPanel(ctx),
};

async function onMessage(ctx, m) {
  const { env } = ctx;
  if (await adminCapture(ctx, m)) return;
  if (typeof m.text !== "string") return;
  const cm = /^\/(\w+)(?:@\w+)?(?:\s+([\s\S]*))?$/.exec(m.text);
  if (cm) {
    const h = COMMANDS[cm[1].toLowerCase()];
    if (h) return h(ctx, ((cm[2] || "").trim().split(/\s+/)[0]) || "");
  } else if (HEARS[m.text]) {
    return HEARS[m.text](ctx);
  }
  return ctx.reply("Quyidagilardan birini tanlang 👇", mainKb(env, ctx.from.id));
}

async function onCallback(ctx, c) {
  const { env } = ctx;
  const d = String(c.data || "");
  let m;

  if ((m = /^a:(\w+)$/.exec(d))) {
    if (!isAdmin(env, ctx.from.id)) return ctx.answer("⛔ Faqat admin uchun");
    return adminAction(ctx, m[1]);
  }
  if (d === "help") { await ctx.answer(); return ctx.reply(HELP, MENU); }
  if (d === "res") { await ctx.answer(); return showResults(ctx); }
  if (d === "new") {
    await ctx.answer();
    try { await ctx.editMarkup(); } catch (e) {}
    return askLength(ctx);
  }
  if ((m = /^len:(\d+)$/.exec(d))) {
    await ctx.answer();
    const n = Number(m[1]);
    if (!LENGTHS.includes(n)) return;
    const btn = ([k, v]) => cb(v.label, `sty:${n}:${k}`);
    const [mix, ...rest] = Object.entries(L.STYLES);
    const rows = [[btn(mix)]];
    for (let i = 0; i < rest.length; i += 2) rows.push(rest.slice(i, i + 2).map(btn));
    return put(ctx, "Qanday savollar bo'lsin? 👇", ik(rows));
  }
  if ((m = /^sty:(\d+):(\w+)$/.exec(d))) {
    await ctx.answer();
    const n = Number(m[1]);
    const style = m[2];
    if (!LENGTHS.includes(n) || !L.STYLES[style]) return;
    const qids = L.pick(QUESTIONS, style, n);
    let qk = rid();
    for (let i = 0; i < 4; i++) {
      const r = await run(env, "INSERT OR IGNORE INTO quizzes(qk,owner,owner_name,style,qids,answers,t) VALUES(?,?,?,?,?,?,?)",
        qk, ctx.from.id, nameOf(ctx.from), style, JSON.stringify(qids), "[]", Date.now());
      if (changed(r)) break;
      qk = rid();
    }
    return showOwnerQ(ctx, { key: qk, qids }, 0);
  }
  if ((m = /^o:(\w+):(\d+):(\d)$/.exec(d))) {
    const [, key, stepS, optS] = m;
    const step = Number(stepS);
    const quiz = await getQuiz(env, key);
    if (!quiz || quiz.owner !== ctx.from.id || quiz.answers.length !== step) return ctx.answer();
    await ctx.answer("✅");
    quiz.answers.push(Number(optS));
    await run(env, "UPDATE quizzes SET answers=? WHERE qk=?", JSON.stringify(quiz.answers), key);
    if (step + 1 < quiz.qids.length) return showOwnerQ(ctx, quiz, step + 1);
    const link = await linkFor(env, key);
    await put(
      ctx,
      `${L.bar(quiz.qids.length, quiz.qids.length)}  ✅ Test tayyor!\n\nMana sizning havolangiz:\n${link}\n\n` +
        `Uni do'stlaringizga yuboring. Javoblaringiz sir saqlanadi, ular faqat taxmin qiladi 🤫`,
      await shareKb(env, key)
    );
    return sendSticker(env, ctx.chatId, "win");
  }
  if ((m = /^r:(\w+):(\d+)$/.exec(d))) {
    const [, key, stepS] = m;
    const step = Number(stepS);
    const quiz = await getQuiz(env, key);
    if (!quiz || quiz.owner !== ctx.from.id || quiz.answers.length !== step) return ctx.answer();
    const free = L.pool(QUESTIONS, quiz.style).filter((i) => !quiz.qids.includes(i));
    if (!free.length) return ctx.answer("Boshqa savol qolmadi 😅");
    await ctx.answer("🔄");
    quiz.qids[step] = free[Math.floor(Math.random() * free.length)];
    await run(env, "UPDATE quizzes SET qids=? WHERE qk=?", JSON.stringify(quiz.qids), key);
    return showOwnerQ(ctx, quiz, step);
  }
  // zaxira: so'rovnoma yuborib bo'lmasa, tugmalar bilan
  if ((m = /^g:(\w+):(\d+):(\d)$/.exec(d))) {
    const [, key, stepS, optS] = m;
    const quiz = await getQuiz(env, key);
    await ctx.answer();
    if (!quiz) return;
    try { await ctx.editMarkup(); } catch (e) {}
    await ctx.reply(Number(optS) === quiz.answers[Number(stepS)] ? "✅ To'g'ri topdingiz!" : "❌ Xato");
    return recordGuess(env, ctx.from, key, Number(stepS), Number(optS));
  }
  if (d === "rt:me") {
    await ctx.answer();
    return put(ctx, (await ratingText(env, ctx.from.id)) || NO_RESULTS, await ratingKb(env, ctx.from.id, "me"));
  }
  if (d === "rt:g") {
    await ctx.answer();
    return put(ctx, await globalText(env, ctx.from.id), await ratingKb(env, ctx.from.id, "g"));
  }
  if ((m = /^rt:(hide|show)$/.exec(d))) {
    await run(env, "UPDATE users SET hide=? WHERE id=?", m[1] === "hide" ? 1 : 0, ctx.from.id);
    await ctx.answer(m[1] === "hide" ? "🙈 Endi reytingda ko'rinmaysiz" : "👁 Reytingda ko'rinasiz");
    return put(ctx, await globalText(env, ctx.from.id), await ratingKb(env, ctx.from.id, "g"));
  }
  if ((m = /^dq:(\d{4}-\d{2}-\d{2}):([0-3])$/.exec(d))) {
    const key = m[1];
    const opt = Number(m[2]);
    const day = await getDay(env, key);
    const q = dayQ(day);
    if (!q || opt >= q.opts.length) {
      await ctx.answer("Bu savol eskirgan 😅");
      try { await ctx.editMarkup(); } catch (e) {}
      return;
    }
    const ins = await run(env, "INSERT OR IGNORE INTO daily_votes(day,uid,opt) VALUES(?,?,?)", key, ctx.from.id, opt);
    await ctx.answer(changed(ins) ? "✅ Javobingiz qabul qilindi" : "Siz allaqachon javob bergansiz ✅");
    const v = await dailyView(env, key, day, ctx.from.id);
    try { await ctx.edit(v.text, v.extra); } catch (e) {}
    return;
  }
  if ((m = /^dq:(on|off)$/.exec(d))) {
    const off = m[1] === "off";
    await setNoDaily(env, ctx.from.id, off);
    await ctx.answer(off ? "🔕 Kunlik savol o'chirildi. Qayta yoqish: /kunlik_on" : "🔔 Kunlik savol yoqildi!", true);
    // faqat oxirgi qatordagi tugma matnini almashtiramiz
    const mk = c.message && c.message.reply_markup;
    if (mk && Array.isArray(mk.inline_keyboard)) {
      const rows = mk.inline_keyboard.map((r) => r.slice());
      rows[rows.length - 1] = [dailyToggleBtn(off)];
      try { await ctx.editMarkup({ inline_keyboard: rows }); } catch (e) {}
    }
    return;
  }
  return ctx.answer();
}

async function onPollAnswer(ctx, a) {
  const { env } = ctx;
  const p = await first(env, "SELECT * FROM polls WHERE poll_id=?", a.poll_id);
  if (!p || !a.option_ids.length || a.user.id !== p.uid) return;
  if (!changed(await run(env, "DELETE FROM polls WHERE poll_id=?", a.poll_id))) return; // ikki marta kelsa, bittasini oladi
  const order = JSON.parse(p.ord);
  return recordGuess(env, a.user, p.qk, p.step, order[a.option_ids[0]]);
}

async function handleUpdate(env, u) {
  await ensureSchema(env);
  const ctx = makeCtx(env, u);
  // foydalanuvchi botni bloklasa/qayta ochsa belgilab qo'yamiz
  if (u.my_chat_member) {
    const mc = u.my_chat_member;
    if (mc.chat && mc.chat.type === "private") {
      await run(env, "UPDATE users SET blocked=? WHERE id=?", ["kicked", "left"].includes(mc.new_chat_member.status) ? 1 : 0, mc.from.id);
    }
    return;
  }
  if (ctx.from && !ctx.from.is_bot) await touch(env, ctx.from);
  if (u.poll_answer) return onPollAnswer(ctx, u.poll_answer);
  if (u.callback_query) return onCallback(ctx, u.callback_query);
  if (u.message) return onMessage(ctx, u.message);
}

// ------------------------------------------------------------------ Worker
const COMMAND_LIST = [
  { command: "start", description: "Boshlash" },
  { command: "natijalar", description: "Mening natijalarim va reyting" },
  { command: "kunlik", description: "Bugungi kunlik savol" },
  { command: "yordam", description: "Qanday o'ynaladi" },
];

const text = (s, status) => new Response(s, { status: status || 200, headers: { "content-type": "text/plain; charset=utf-8" } });

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const authed = () => env.WEBHOOK_SECRET && url.searchParams.get("key") === env.WEBHOOK_SECRET;

    if (url.pathname === "/setup") {
      if (!authed()) return text("forbidden", 403);
      const res = await tg(env, "setWebhook", {
        url: url.origin + "/webhook",
        secret_token: env.WEBHOOK_SECRET,
        allowed_updates: ["message", "callback_query", "poll_answer", "my_chat_member"],
      }).catch((e) => "XATO: " + e.message);
      await tg(env, "setMyCommands", { commands: COMMAND_LIST }).catch(() => {});
      return text("setWebhook: " + JSON.stringify(res));
    }

    if (url.pathname === "/debug") {
      if (!authed()) return text("forbidden", 403);
      const out = [];
      const has = (k) => (env[k] ? "bor (" + String(env[k]).length + " belgi)" : "YO'Q");
      out.push("BOT_TOKEN: " + has("BOT_TOKEN"), "WEBHOOK_SECRET: " + has("WEBHOOK_SECRET"), "ADMIN_IDS: " + has("ADMIN_IDS"));
      try {
        await ensureSchema(env);
        const u = (await first(env, "SELECT COUNT(*) c FROM users")).c;
        const q = (await first(env, "SELECT COUNT(*) c FROM quizzes")).c;
        out.push(`D1 baza: ishlayapti (${u} foydalanuvchi, ${q} test)`);
      } catch (e) {
        out.push("D1 baza XATO: " + e.message);
      }
      try {
        const me = await tg(env, "getMe", {});
        out.push("Bot: @" + me.username);
        const wh = await tg(env, "getWebhookInfo", {});
        out.push("Webhook: " + (wh.url || "ulanmagan") + (wh.last_error_message ? " | oxirgi xato: " + wh.last_error_message : "") + ` | kutayotgan: ${wh.pending_update_count || 0}`);
      } catch (e) {
        out.push("Telegram XATO: " + e.message);
      }
      return text(out.join("\n"));
    }

    if (url.pathname === "/webhook" && request.method === "POST") {
      if (!env.WEBHOOK_SECRET || request.headers.get("x-telegram-bot-api-secret-token") !== env.WEBHOOK_SECRET) return text("forbidden", 403);
      const u = await request.json();
      ctx.waitUntil(
        handleUpdate(env, u).catch((e) => console.error("xato:", e && e.stack ? e.stack : e))
      );
      return text("ok");
    }

    return text("ok");
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(tick(env).catch((e) => console.error("cron xato:", e.message)));
  },
};

// sinov uchun
export const __test = { tick, handleUpdate, backupData, mergeBackup, ensureSchema };
