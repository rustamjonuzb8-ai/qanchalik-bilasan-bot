const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

// Test turlari. Eski testlar mix/fun/deep kalitlarini saqlagan, ularni o'zgartirmang.
const STYLES = {
  mix: { label: "🎲 Aralash (hammasidan)", test: () => true },
  fun: { label: "😂 Kulgili", test: (t) => t === "fun" },
  deep: { label: "🧠 Chuqur va hissiy", test: (t) => t === "deep" || t === "love" },
  love: { label: "❤️ Sevgi va munosabat", test: (t) => t === "love" },
  friend: { label: "👫 Do'stlik", test: (t) => t === "friend" },
  life: { label: "🏠 Kundalik hayot", test: (t) => t === "life" },
  taste: { label: "🎨 Did va qiziqish", test: (t) => t === "taste" },
  dilemma: { label: "🤔 Qiyin tanlov", test: (t) => t === "dilemma" },
  uz: { label: "🇺🇿 O'zbekona", test: (t) => t === "uz" },
  dream: { label: "🌠 Orzu va kelajak", test: (t) => t === "dream" },
};

const pool = (questions, style) =>
  questions.map((q, i) => [q, i]).filter(([q]) => (STYLES[style] || STYLES.mix).test(q.tag)).map(([, i]) => i);

// Aralash rejimda har xil mavzulardan teng olinadi (hammasi bitta mavzudan chiqib qolmasligi uchun)
function pick(questions, style, n) {
  const ids = shuffle(pool(questions, style));
  if (style !== "mix") return ids.slice(0, n);
  const groups = {};
  for (const i of ids) (groups[questions[i].tag] ||= []).push(i);
  const tags = shuffle(Object.keys(groups));
  const out = [];
  while (out.length < n && tags.some((t) => groups[t].length)) {
    for (const t of tags) if (groups[t].length && out.length < n) out.push(groups[t].pop());
  }
  return shuffle(out);
}

// Ism grammatika uchun: oxiridagi emoji/belgilarni olib tashlaymiz ("Ali 🔥" -> "Ali")
const cleanName = (name) => String(name || "").replace(/[^\p{L}\p{N}'’ʻ`]+$/u, "").trim() || "Do'sting";
const SUFFIX = ["ning", "ni", "ga", "dan", "da"];
function sufName(name, suf) {
  const n = cleanName(name);
  if (!SUFFIX.includes(suf)) return n;
  if (suf === "ga" && /k$/i.test(n)) return n + "ka";
  if (suf === "ga" && /q$/i.test(n)) return n + "qa";
  return n + suf;
}
// Do'stga ko'rinadigan savol matni: g da {N} / {N:ni} bo'lsa o'sha joyga, bo'lmasa boshiga ism qo'yiladi
const ask = (name, g) =>
  /\{N(:\w+)?\}/.test(g)
    ? g.replace(/\{N(?::(\w+))?\}/g, (_, suf) => (suf ? sufName(name, suf) : cleanName(name)))
    : `${cleanName(name)} ${g}`;

const bar = (done, total) => "▰".repeat(done) + "▱".repeat(total - done);

const marks = (guesses, answers) => guesses.map((g, i) => (g === answers[i] ? "🟩" : "🟥")).join("");

function title(p) {
  if (p >= 100) return "🏆 Bir jonu ikki tansiz!";
  if (p >= 80) return "🔥 Siz juda yaxshi do'stsiz";
  if (p >= 60) return "👌 Yaxshi do'stsiz";
  if (p >= 40) return "😅 O'rtacha. Ko'proq gaplashish kerak";
  if (p >= 20) return "🤨 Siz uni sal-pal taniysiz";
  return "😂 Siz uni umuman tanimas ekansiz";
}

const mood = (p) => (p >= 60 ? "win" : p >= 40 ? "mid" : "low");

// Kulgili "tashxis": har foiz oralig'i uchun bir nechta variant [tashxis, davo].
// Sodda so'zlar, hech kimni haqorat qilmaydi. Yangi variant qo'shsangiz, ro'yxat OXIRIGA qo'shing.
const DX = [
  { min: 100, list: [
    ["Ikkingiz egizak ekansiz! 👯", "Bir-biringizni tez-tez quchoqlang."],
    ["Siz uning ichidagini ham o'qib qo'yibsiz 🧠", "Bu kuchni faqat yaxshilikka ishlating."],
    ["Siz uning shaxsiy josusi bo'lsangiz kerak 🕵️", "Sirlarini hech kimga aytmang."],
    ["Bu do'stlik emas, bu mo'jiza! ✨", "Hech narsa kerak emas, baribir zo'rsiz."],
  ] },
  { min: 80, list: [
    ["Juda yaxshi do'stsiz! Deyarli hammasini bilasiz 🔥", "Birga choy ichib, yana gaplashing."],
    ["Sal-pal yetmadi, lekin juda yaqinsiz 😎", "Haftada bir marta gaplashib turing."],
    ["Siz unga ishonsa bo'ladigan do'stsiz 🤝", "Birga rasmga tushing."],
    ["Zo'r natija! Bir-ikki sir qolibdi 🤫", "Uning sirlarini odob bilan so'rang."],
  ] },
  { min: 60, list: [
    ["Yaxshi do'stsiz, lekin o'rganadigan narsa bor 🙂", "Birga ovqatlaning va ko'proq gaplashing."],
    ["Taniysiz, lekin ba'zan adashasiz 😅", "Uning gaplariga diqqat bilan quloq soling."],
    ["Yarmidan ko'pini bilasiz. Yomon emas! 👍", "Birga sayr qilib keling."],
    ["Yaxshi tanish ekansiz, endi chin do'st bo'lish qoldi 😄", "Ko'proq savol bering."],
  ] },
  { min: 40, list: [
    ["O'rtacha tanish ekansiz 😅", "Uchrashing, kafega boring, gaplashing."],
    ["Yarmini bilasiz, yarmini o'ylab topdingiz 🤔", "Ko'proq so'rang, kamroq taxmin qiling."],
    ["Hali bir-biringizni tanib ulgurmagansiz 🙈", "Bir soatlik suhbat yetadi."],
    ["Yaqin do'st bo'lishga oz qolibdi 😆", "Birga kulgili video ko'ring."],
  ] },
  { min: 20, list: [
    ["Siz uni sal-pal taniysiz 🤨", "Telefonni qo'ying, yuzma-yuz gaplashing."],
    ["Taxminlaringiz shamolga o'xshaydi 🌬", "Uning sevimli narsalarini so'rab oling."],
    ["Siz uni qo'shnisidek taniysiz 😄", "Birga tushlik qiling."],
    ["Bu natija sizga ogohlantirish 🚨", "Bugunoq qo'ng'iroq qilib, hol so'rang."],
  ] },
  { min: 0, list: [
    ["Siz uni umuman tanimas ekansiz 😂", "Tezroq yaqinroq tanishing!"],
    ["Boshqa odam haqida test yechgandek bo'ldingiz 🤯", "Qaytadan tanishib chiqing."],
    ["Siz boshqa odamni taniysiz shekilli 🙈", "Ismini qayta eslang va gaplashing."],
    ["Aniq tashxis: ko'proq suhbat kerak! 📞", "Har kuni 5 daqiqa gaplashing."],
  ] },
];

// idx berilsa o'sha variant, berilmasa tasodifiy. Natija: { idx, text }
function diagnosis(p, idx) {
  const tier = DX.find((t) => p >= t.min) || DX[DX.length - 1];
  const i = Number.isInteger(idx) && idx >= 0 ? idx % tier.list.length : Math.floor(Math.random() * tier.list.length);
  const [d, c] = tier.list[i];
  return { idx: i, text: `🩺 Tashxis: ${d}\n💊 Davo: ${c}` };
}

module.exports = { shuffle, STYLES, pool, pick, bar, marks, title, mood, cleanName, sufName, ask, diagnosis };
