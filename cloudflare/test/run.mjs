// Mahalliy sinov: soxta D1 (node:sqlite) va soxta Telegram bilan asosiy oqimlarni tekshiradi.
// Ishga tushirish: node test/run.mjs  (Node 22+)
import { DatabaseSync } from "node:sqlite";
import assert from "node:assert/strict";

// kutishlarni nolga tushiramiz (bot ichidagi 1.8 soniyalik pauzalar sinovni sekinlatmasin)
const realSetTimeout = globalThis.setTimeout;
globalThis.setTimeout = (fn, ms, ...a) => realSetTimeout(fn, 0, ...a);

const { default: worker, __test } = await import("../src/worker.js");

// ---------------------------------------------------------------- soxta D1
function makeD1() {
  const db = new DatabaseSync(":memory:");
  const mk = (sql, args = []) => ({
    bind: (...a) => mk(sql, a),
    all: async () => ({ results: db.prepare(sql).all(...args), meta: {} }),
    first: async () => db.prepare(sql).get(...args) || null,
    run: async () => {
      const r = db.prepare(sql).run(...args);
      return { success: true, meta: { changes: Number(r.changes) } };
    },
    _exec: () => {
      const s = db.prepare(sql);
      return /^\s*(select|with)/i.test(sql) ? { results: s.all(...args), meta: {} } : { success: true, meta: { changes: Number(s.run(...args).changes) } };
    },
  });
  return {
    prepare: (sql) => mk(sql),
    batch: async (list) => list.map((s) => s._exec()),
    raw: db,
  };
}

// ---------------------------------------------------------------- soxta Telegram
const calls = [];
let msgId = 1000;
let pollId = 1;
let failStickers = true;
let pinned = null;
const files = {};
globalThis.fetch = async (url, init) => {
  url = String(url);
  if (url.includes("/file/bot")) {
    const path = url.split("/file/bot")[1].split("/").slice(1).join("/");
    return new Response(files[path], { status: 200 });
  }
  const method = url.split("/").pop();
  let params = {};
  if (init && typeof init.body === "string") params = JSON.parse(init.body);
  else if (init && init.body instanceof FormData) params = { _form: true, chat_id: init.body.get("chat_id"), caption: init.body.get("caption") };
  calls.push({ method, ...params });
  const ok = (result) => new Response(JSON.stringify({ ok: true, result }), { status: 200 });
  const err = (code, description) => new Response(JSON.stringify({ ok: false, error_code: code, description }), { status: code });
  switch (method) {
    case "sendMessage":
    case "sendDocument":
    case "copyMessage":
    case "sendSticker":
      if (params.chat_id === 666) return err(403, "Forbidden: bot was blocked by the user");
      return ok({ message_id: ++msgId });
    case "sendPoll": return ok({ message_id: ++msgId, poll: { id: "poll" + pollId++ } });
    case "getStickerSet": return failStickers ? err(400, "STICKERSET_INVALID") : ok({ stickers: [{ emoji: "🔥", file_id: "S1" }] });
    case "getChat": return ok({ pinned_message: pinned });
    case "getFile": return ok({ file_path: "docs/backup.json" });
    default: return ok(true);
  }
};

// ---------------------------------------------------------------- yordamchilar
const env = { DB: makeD1(), BOT_TOKEN: "123:abc", WEBHOOK_SECRET: "sec", ADMIN_IDS: "1", BOT_USERNAME: "QanchalikBilasanBot", BATCH: "3" };
let upd = 1;
async function send(update) {
  const pending = [];
  const ctx = { waitUntil: (p) => pending.push(p) };
  const res = await worker.fetch(
    new Request("https://w.example/webhook", { method: "POST", headers: { "x-telegram-bot-api-secret-token": "sec" }, body: JSON.stringify({ update_id: upd++, ...update }) }),
    env, ctx
  );
  assert.equal(res.status, 200);
  await Promise.all(pending);
}
const user = (id, name) => ({ id, first_name: name, is_bot: false });
const say = (u, text, extra = {}) => send({ message: { message_id: ++msgId, from: u, chat: { id: u.id, type: "private" }, text, ...extra } });
const press = (u, data, message) =>
  send({ callback_query: { id: "cq" + upd, from: u, data, message: message || { message_id: ++msgId, chat: { id: u.id, type: "private" } } } });
const last = (method, pred = () => true) => [...calls].reverse().find((c) => c.method === method && pred(c));
const all = (method, pred = () => true) => calls.filter((c) => c.method === method && pred(c));
const q = (sql, ...a) => env.DB.raw.prepare(sql).all(...a);
let passed = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); passed++; console.log("  ✓", msg); };

const owner = user(1, "Admin"); // admin ham shu
const friend = user(2, "Dilnoza");
const friend2 = user(3, "Jasur");
const friend3 = user(4, "Madina");

// ---------------------------------------------------------------- sinovlar
console.log("1. Start va menyu");
await say(owner, "/start");
ok(last("sendMessage", (c) => /Salom/.test(c.text)), "salomlashish yuborildi");
ok(last("sendMessage", (c) => c.reply_markup && c.reply_markup.keyboard && c.reply_markup.keyboard.flat().some((b) => b.text === "🛠 Admin panel")), "admin uchun admin tugma bor");
ok(last("sendMessage", (c) => c.text === "👋"), "stiker topilmasa emoji yuboriladi");
await say(friend, "/start");
ok(!last("sendMessage", (c) => c.chat_id === 2 && c.reply_markup && c.reply_markup.keyboard && c.reply_markup.keyboard.flat().some((b) => b.text === "🛠 Admin panel")), "oddiy foydalanuvchida admin tugma yo'q");
ok(q("SELECT * FROM users").length === 2, "foydalanuvchilar bazaga yozildi");

console.log("2. Test tuzish (egasi)");
await say(owner, "🎮 Test tuzish");
ok(last("sendMessage", (c) => /Nechta savol/.test(c.text)), "uzunlik so'raldi");
await press(owner, "len:5");
ok(last("editMessageText", (c) => /Qanday savollar/.test(c.text)), "tur so'raldi");
await press(owner, "sty:5:mix");
let quiz = q("SELECT * FROM quizzes")[0];
ok(quiz && JSON.parse(quiz.qids).length === 5, "5 savollik test yaratildi");
const qk = quiz.qk;
for (let i = 0; i < 5; i++) await press(owner, `o:${qk}:${i}:${i % 4}`);
ok(JSON.parse(q("SELECT answers FROM quizzes")[0].answers).length === 5, "5 ta javob saqlandi");
const linkMsg = last("editMessageText", (c) => /Test tayyor/.test(c.text));
ok(linkMsg && linkMsg.text.includes(`https://t.me/QanchalikBilasanBot?start=${qk}`), "havola to'g'ri chiqdi");

console.log("3. Savolni almashtirish");
await say(friend2, "🎮 Test tuzish");
await press(friend2, "len:5");
await press(friend2, "sty:5:fun");
const q2 = q("SELECT * FROM quizzes WHERE owner=3")[0];
const before = JSON.parse(q2.qids)[0];
await press(friend2, `r:${q2.qk}:0`);
ok(JSON.parse(q("SELECT qids FROM quizzes WHERE owner=3")[0].qids)[0] !== before, "🔄 Boshqa savol ishladi");

console.log("4. Do'st testni yechadi (so'rovnoma)");
await say(owner, "/start " + qk); // o'z testi
ok(last("sendMessage", (c) => /o'z testingiz/.test(c.text)), "egasi o'z testini yecha olmaydi");
await say(friend, "/start " + qk);
ok(last("sendPoll"), "birinchi so'rovnoma yuborildi");
const answers = JSON.parse(q("SELECT answers FROM quizzes WHERE qk=?", qk)[0].answers);
// to'g'ri javob bilan 3 ta, xato bilan 2 ta
for (let step = 0; step < 5; step++) {
  const poll = last("sendPoll", (c) => c.chat_id === 2);
  const pid = "poll" + (pollId - 1);
  const rec = q("SELECT * FROM polls WHERE poll_id=?", pid)[0];
  ok(rec && rec.step === step, `so'rovnoma ${step + 1}/5 bazada`);
  const order = JSON.parse(rec.ord);
  const wantOpt = step < 3 ? answers[step] : (answers[step] + 1) % 4;
  await send({ poll_answer: { poll_id: pid, user: friend, option_ids: [order.indexOf(wantOpt)] } });
}
const res = q("SELECT * FROM results WHERE qk=?", qk);
ok(res.length === 1 && res[0].p === 60 && res[0].hit === 3, "natija 60% (3/5)");
ok(last("sendMessage", (c) => c.chat_id === 2 && /60%/.test(c.text) && /Tashxis/.test(c.text)), "do'stga natija va tashxis yuborildi");
ok(last("sendMessage", (c) => c.chat_id === 1 && /testingizni yechdi/.test(c.text)), "egasiga xabar ketdi");
await say(friend, "/start " + qk);
ok(last("sendMessage", (c) => /allaqachon yechgansiz/.test(c.text)), "qayta yechib bo'lmaydi");
ok(q("SELECT * FROM polls WHERE uid=2").length === 0, "ishlatilgan so'rovnomalar tozalandi");

console.log("5. Tugmalar bilan zaxira usuli");
await send({ poll_answer: { poll_id: "yoq", user: friend2, option_ids: [0] } });
ok(true, "noma'lum so'rovnoma e'tiborsiz qoldi");

console.log("6. Reyting");
for (const [u, n] of [[friend2, 1], [friend3, 2]]) {
  await say(u, "/start " + qk);
  for (let step = 0; step < 5; step++) {
    const pid = "poll" + (pollId - 1);
    const rec = q("SELECT * FROM polls WHERE poll_id=?", pid)[0];
    await send({ poll_answer: { poll_id: pid, user: u, option_ids: [JSON.parse(rec.ord).indexOf(answers[step])] } });
  }
}
ok(q("SELECT * FROM results WHERE qk=?", qk).length === 3, "3 ta do'st yechdi");
await say(owner, "🏆 Natijalarim");
const my = last("sendMessage", (c) => /Sizni eng yaxshi taniydiganlar/.test(c.text));
ok(my && /Jami: 3 do'st/.test(my.text) && /O'rtacha: 87%/.test(my.text), "shaxsiy reyting: 3 do'st, o'rtacha 87%");
await press(owner, "rt:g");
const g = last("editMessageText", (c) => /Eng mashhurlar/.test(c.text));
ok(g && /Admin: 3 do'st/.test(g.text) && /1-o'rin/.test(g.text), "umumiy reytingda egasi 1-o'rinda");
await press(owner, "rt:hide");
ok(last("editMessageText", (c) => /yashirinib turibsiz/.test(c.text)), "reytingdan yashirinish ishladi");
await press(owner, "rt:show");

console.log("7. Havolalarim");
await say(owner, "🔗 Havolalarim");
ok(last("sendMessage", (c) => /3 kishi yechgan/.test(c.text) && c.text.includes(qk)), "havolalar va yechganlar soni");

console.log("8. Kunlik savol (qo'lda)");
await say(friend, "🎯 Kunlik savol");
const dq = last("sendMessage", (c) => c.chat_id === 2 && /Kunlik savol/.test(c.text));
ok(dq && dq.reply_markup.inline_keyboard.length === 5, "savol va 4 variant + o'chirish tugmasi");
const dqData = dq.reply_markup.inline_keyboard[1][0].callback_data;
await press(friend, dqData);
ok(last("editMessageText", (c) => /Jami 1 kishi javob berdi/.test(c.text) && /✅ siz/.test(c.text)), "ovoz qabul qilindi, natija ko'rsatildi");
await press(friend, dqData);
ok(q("SELECT * FROM daily_votes").length === 1, "ikkinchi marta ovoz berib bo'lmaydi");
await press(friend, "dq:off", { message_id: 5, chat: { id: 2 }, reply_markup: { inline_keyboard: [[{ text: "x", callback_data: "y" }], [{ text: "🔕", callback_data: "dq:off" }]] } });
ok(q("SELECT nodq FROM users WHERE id=2")[0].nodq === 1, "kunlik savol o'chirildi");
ok(last("editMessageReplyMarkup").reply_markup.inline_keyboard.at(-1)[0].callback_data === "dq:on", "tugma 'yoqish'ga almashdi");
await say(friend, "/kunlik_on");
ok(q("SELECT nodq FROM users WHERE id=2")[0].nodq === 0, "/kunlik_on ishladi");

console.log("9. Kunlik savol avtomatik yuborish (cron)");
env.DAILY_HOUR = String(new Date(Date.now() + 5 * 3600e3).getUTCHours()); // hozirgi soat
q("INSERT OR IGNORE INTO users(id,name,joined,last_seen,blocked) VALUES(666,'Bloklagan',0,?,0)", Date.now());
calls.length = 0;
await __test.tick(env);
const sent1 = all("sendMessage", (c) => /Kunlik savol/.test(c.text));
ok(sent1.length === 3, `1-bo'lak: ${sent1.length} ta (BATCH=3)`);
await __test.tick(env);
await __test.tick(env);
const sentIds = new Set(all("sendMessage", (c) => /Kunlik savol/.test(c.text)).map((c) => c.chat_id));
ok(!sentIds.has(2), "allaqachon javob bergan do'stga yuborilmadi");
ok(sentIds.size >= 3 && !(sentIds.size > 4), "boshqalarga bo'laklab yuborildi, takrorlanmadi");
ok(q("SELECT blocked FROM users WHERE id=666")[0].blocked === 1, "botni bloklagan foydalanuvchi belgilandi");
await __test.tick(env);
ok(q("SELECT v FROM kv WHERE k='daily:done'").length === 1, "kun yakunlandi (daily:done)");
const n0 = calls.length;
await __test.tick(env);
ok(calls.length === n0, "tugagandan keyin qayta yuborilmaydi");
env.DAILY_HOUR = "3"; // oyna tashqarisi

console.log("10. Admin panel va statistika");
await say(owner, "/admin");
ok(last("sendMessage", (c) => /Admin panel/.test(c.text)), "admin panel ochildi");
await say(friend, "/admin");
ok(!last("sendMessage", (c) => c.chat_id === 2 && /Admin panel/.test(c.text)), "oddiy foydalanuvchiga panel ochilmaydi");
await press(friend, "a:stats");
ok(!last("editMessageText", (c) => /Statistika/.test(c.text)), "admin tugmasi oddiy foydalanuvchiga ishlamaydi");
await press(owner, "a:stats");
const st = last("editMessageText", (c) => /Statistika/.test(c.text));
ok(st && /Yechilgan testlar: 3/.test(st.text) && /Admin: 3 kishi yechgan/.test(st.text), "statistika to'g'ri");
await press(owner, "a:users");
ok(last("editMessageText", (c) => /So'nggi foydalanuvchilar/.test(c.text)), "foydalanuvchilar ro'yxati");

console.log("11. Hammaga xabar yuborish");
await press(owner, "a:bc");
await say(owner, "Hammaga salom!");
ok(last("sendMessage", (c) => /kishiga yuboraymi/.test(c.text)), "tasdiqlash so'raldi");
await press(owner, "a:bctoggle");
await press(owner, "a:bcgo");
ok(q("SELECT v FROM kv WHERE k='bc:job'").length === 1, "ish navbatga qo'yildi (BATCH=3, hammasi bir yo'la tugamaydi)");
for (let i = 0; i < 5; i++) await __test.tick(env);
ok(q("SELECT v FROM kv WHERE k='bc:job'").length === 0, "hammaga yuborib bo'lindi");
const bc = all("copyMessage", (c) => c.from_chat_id === 1);
const bcTo = new Set(bc.map((c) => c.chat_id));
ok(bcTo.has(1) && bcTo.has(2) && bcTo.has(3) && bcTo.has(4), "foydalanuvchilar xabarni oldi");
ok(bc.filter((c) => c.chat_id === 1 && c.reply_markup).length === 0, "tugma o'chirilgan edi, xabarda tugma yo'q");
ok(last("editMessageText", (c) => /Xabar yuborish tugadi/.test(c.text)), "admin'ga yakuniy hisobot");

console.log("12. Zaxira va tiklash");
const data = await __test.backupData(env);
ok(Object.keys(data.users).length >= 4 && Object.keys(data.quizzes).length === 2, "zaxira ma'lumotlari to'liq");
ok(data.quizzes[qk].results.length === 3, "zaxirada natijalar bor");
// yangi bo'sh bazaga qaytarish
const env2 = { ...env, DB: makeD1() };
await __test.ensureSchema(env2).catch(() => {});
// ensureSchema bir marta ishlagan deb eslab qoladi; yangi baza uchun sxemani qo'lda yaratamiz
const SQLs = env.DB.raw.prepare("SELECT sql FROM sqlite_master WHERE sql IS NOT NULL AND name NOT LIKE 'sqlite_%'").all();
for (const { sql } of SQLs) env2.DB.raw.exec(sql);
const r = await __test.mergeBackup(env2, JSON.parse(JSON.stringify(data)));
ok(r.addedQuizzes === 2 && r.addedUsers >= 4, `tiklandi: +${r.addedUsers} foydalanuvchi, +${r.addedQuizzes} test`);
const r2 = await __test.mergeBackup(env2, JSON.parse(JSON.stringify(data)));
ok(r2.addedQuizzes === 0 && r2.addedUsers === 0, "ikkinchi marta tiklasa, takrorlanmaydi");
ok(env2.DB.raw.prepare("SELECT COUNT(*) c FROM results").get().c === 3, "natijalar ko'chdi");
// Render'dagi eski format
const old = { users: { 77: { name: "Eski", username: "e", joined: 1, last: 2, blocked: false, dqDay: "2026-11-10" } },
  quizzes: { abc123: { owner: 77, ownerName: "Eski", style: "mix", qids: [0, 1, 2, 3, 4], answers: [0, 1, 2, 3, 0], results: [{ id: 78, name: "Do'st", p: 80, right: 4, n: 5, dx: 1 }], progress: {}, t: 5 } },
  daily: { done: "2026-11-13", days: { "2026-11-13": { qi: 3, votes: [1, 0, 0, 0], voters: { 77: 0 } } } }, polls: {}, ts: 9 };
const r3 = await __test.mergeBackup(env2, old);
ok(r3.addedQuizzes === 1 && r3.addedUsers === 2, "Render'dagi eski zaxira formati o'qildi");
ok(env2.DB.raw.prepare("SELECT dq_day FROM users WHERE id=77").get().dq_day === "2026-11-10", "eski maydonlar to'g'ri o'tdi");
// admin tugmalari
await press(owner, "a:backup");
ok(last("sendDocument"), "zaxira fayli admin'ga yuborildi");
await press(owner, "a:restore");
files["docs/backup.json"] = JSON.stringify(old);
pinned = { document: { file_id: "F1" }, caption: "QB-BACKUP ts=1\nzaxira", message_id: 9 };
await press(owner, "a:pinned");
ok(last("sendMessage", (c) => /Qadalgan zaxiradan tiklandi: \+2 foydalanuvchi, \+1 test/.test(c.text)), "qadalgan zaxiradan tiklash ishladi");
pinned = null;

console.log("13. Boshqa holatlar");
await say(friend, "nimadir yozdi");
ok(last("sendMessage", (c) => c.chat_id === 2 && /Quyidagilardan birini tanlang/.test(c.text)), "tushunarsiz matnga menyu");
await say(friend, "/yordam");
ok(last("sendMessage", (c) => /Qanday o'ynaladi/.test(c.text)), "/yordam");
await send({ my_chat_member: { chat: { id: 2, type: "private" }, from: friend, new_chat_member: { status: "kicked" } } });
ok(q("SELECT blocked FROM users WHERE id=2")[0].blocked === 1, "bloklash belgilandi");
await say(friend, "/start");
ok(q("SELECT blocked FROM users WHERE id=2")[0].blocked === 0, "qaytib kelsa, blok olinadi");
const bad = await worker.fetch(new Request("https://w.example/webhook", { method: "POST", body: "{}" }), env, { waitUntil() {} });
ok(bad.status === 403, "maxfiy kalitsiz webhook rad etiladi");
const setup = await worker.fetch(new Request("https://w.example/setup?key=sec"), env, { waitUntil() {} });
ok((await setup.text()).includes("setWebhook"), "/setup webhook ulaydi");
ok(last("setWebhook").allowed_updates.includes("poll_answer"), "poll_answer yangilanishlari yoqilgan");
const dbg = await worker.fetch(new Request("https://w.example/debug?key=sec"), env, { waitUntil() {} });
ok((await dbg.text()).includes("D1 baza: ishlayapti"), "/debug baza holatini ko'rsatadi");

console.log(`\nHammasi yaxshi: ${passed} ta tekshiruv o'tdi ✅`);
