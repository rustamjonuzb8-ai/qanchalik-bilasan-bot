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

module.exports = { shuffle, STYLES, pool, pick, bar, marks, title, mood, cleanName, sufName, ask };
