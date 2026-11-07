const shuffle = (a) => {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
};

const STYLES = {
  mix: { label: "🎲 Aralash", test: () => true },
  fun: { label: "😂 Kulgili", test: (t) => t === "fun" },
  deep: { label: "🧠 Chuqur va hissiy", test: (t) => t === "deep" || t === "love" },
};

const pool = (questions, style) =>
  questions.map((q, i) => [q, i]).filter(([q]) => (STYLES[style] || STYLES.mix).test(q.tag)).map(([, i]) => i);

const pick = (questions, style, n) => shuffle(pool(questions, style)).slice(0, n);

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

module.exports = { shuffle, STYLES, pool, pick, bar, marks, title, mood };
