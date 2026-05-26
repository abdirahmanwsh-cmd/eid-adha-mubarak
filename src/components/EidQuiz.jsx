import { useState, useEffect } from "react";

const QUESTIONS = [
  {
    q: "On which Islamic calendar date does Eid al-Adha fall?",
    options: ["1st Shawwal", "10th Dhul Hijjah", "27th Rajab", "15th Sha'ban"],
    answer: 1,
    fact: "Eid al-Adha begins on the 10th of Dhul Hijjah, the last month of the Islamic calendar.",
  },
  {
    q: "How many years did Ibrahim (AS) wait before being blessed with a son?",
    options: ["20 years", "40 years", "60 years", "80 years"],
    answer: 3,
    fact: "Ibrahim (AS) was approximately 86 years old when Ismail (AS) was born after decades of supplication.",
  },
  {
    q: "What is the minimum age for a goat/sheep to be valid for Qurbani?",
    options: ["6 months", "1 year", "2 years", "3 years"],
    answer: 1,
    fact: "A goat or sheep must be at least 1 year old to be valid for Qurbani.",
  },
  {
    q: "How should the meat of Qurbani be divided?",
    options: [
      "All given to the poor",
      "Half kept, half given away",
      "One-third kept, one-third to family, one-third to poor",
      "All kept for the family",
    ],
    answer: 2,
    fact: "The Sunnah is to divide Qurbani meat into three equal parts: family, relatives/friends, and the poor.",
  },
  {
    q: "What is the name of the pilgrimage that coincides with Eid al-Adha?",
    options: ["Umrah", "Hajj", "Tawaf", "Sa'i"],
    answer: 1,
    fact: "Hajj is the annual pilgrimage to Makkah and is one of the Five Pillars of Islam.",
  },
  {
    q: "Which mountain did Ibrahim (AS) take his son to for the sacrifice?",
    options: ["Mount Sinai", "Mount Arafat", "Mount Moriah (Mina)", "Mount Uhud"],
    answer: 2,
    fact: "The sacrifice took place near Mina, close to Makkah, which is also where pilgrims perform the symbolic stoning.",
  },
  {
    q: "What does 'Taqabbal Allahu minna wa minkum' mean?",
    options: [
      "Peace be upon you",
      "May Allah accept from us and from you",
      "Allah is the Greatest",
      "In the name of Allah",
    ],
    answer: 1,
    fact: "This is the traditional Eid greeting exchanged between Muslims, meaning 'May Allah accept from us and from you'.",
  },
];

const CONFETTI_COLORS = ["#fbbf24", "#f59e0b", "#fde68a", "#fb923c", "#ff6b9d", "#a78bfa", "#34d399", "#ffffff"];
const CELEBRATION_EMOJIS = ["🎉", "🏆", "💛", "❤️", "🌟", "✨", "🎊", "💫", "🐑", "☪️"];

function randomBetween(a, b) { return a + Math.random() * (b - a); }

function CelebrationBurst() {
  const [particles] = useState(() =>
    Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: `${randomBetween(5, 95)}%`,
      size: randomBetween(8, 20),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      duration: randomBetween(1.5, 3),
      delay: randomBetween(0, 1.2),
      drift: randomBetween(-200, 200),
      round: Math.random() > 0.5,
      isEmoji: Math.random() > 0.7,
      emoji: CELEBRATION_EMOJIS[Math.floor(Math.random() * CELEBRATION_EMOJIS.length)],
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) =>
        p.isEmoji ? (
          <div
            key={p.id}
            className="absolute text-2xl"
            style={{
              left: p.x,
              top: "-40px",
              animation: `confettiFall ${p.duration}s ease-in forwards`,
              animationDelay: `${p.delay}s`,
              "--drift": `${p.drift}px`,
            }}
          >
            {p.emoji}
          </div>
        ) : (
          <div
            key={p.id}
            className="absolute"
            style={{
              left: p.x,
              top: "-20px",
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              borderRadius: p.round ? "50%" : "2px",
              animation: `confettiFall ${p.duration}s ease-in forwards`,
              animationDelay: `${p.delay}s`,
              "--drift": `${p.drift}px`,
            }}
          />
        )
      )}
    </div>
  );
}

function FloatingHearts() {
  const [hearts] = useState(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${randomBetween(5, 95)}%`,
      duration: randomBetween(2, 4),
      delay: randomBetween(0, 2),
      size: randomBetween(20, 40),
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute"
          style={{
            left: h.left,
            bottom: 0,
            fontSize: h.size,
            animation: `floatUp ${h.duration}s ease-out ${h.delay}s forwards`,
          }}
        >
          {Math.random() > 0.5 ? "❤️" : "💛"}
        </div>
      ))}
    </div>
  );
}

export default function EidQuiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [celebrating, setCelebrating] = useState(false);
  const [showFact, setShowFact] = useState(false);

  const perfect = score === QUESTIONS.length;

  useEffect(() => {
    if (done && perfect) {
      setCelebrating(true);
      const t = setTimeout(() => setCelebrating(false), 4500);
      return () => clearTimeout(t);
    }
  }, [done, perfect]);

  function handleAnswer(i) {
    if (selected !== null) return;
    setSelected(i);
    setShowFact(true);
    if (i === QUESTIONS[current].answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (current + 1 >= QUESTIONS.length) {
        setDone(true);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setShowFact(false);
      }
    }, 1800);
  }

  function reset() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setCelebrating(false);
    setShowFact(false);
  }

  const q = QUESTIONS[current];
  const isCorrect = selected === q?.answer;

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-16">
      {celebrating && <CelebrationBurst />}
      {celebrating && <FloatingHearts />}

      <div className="text-center mb-10">
        <p className="text-yellow-500/70 text-xs uppercase tracking-[0.3em] mb-2">Test Your Knowledge</p>
        <h2 className="text-3xl font-bold text-white">Eid al-Adha Quiz 🕌</h2>
        <p className="text-white/40 text-sm mt-2">{QUESTIONS.length} questions · How well do you know your deen?</p>
      </div>

      <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-yellow-500/20 rounded-3xl p-8">
        {done ? (
          <div className="text-center">
            <div
              className="text-8xl mb-4 inline-block"
              style={{ animation: perfect ? "float 2s ease-in-out infinite" : undefined }}
            >
              {perfect ? "🏆" : score >= 5 ? "🌟" : score >= 3 ? "🐑" : "📖"}
            </div>

            <p className="text-yellow-300 text-5xl font-black mb-1">{score}<span className="text-white/30 text-3xl"> / {QUESTIONS.length}</span></p>

            {perfect ? (
              <>
                <p className="text-2xl font-bold text-yellow-300 mt-3 mb-1">Mashallah! 🎉</p>
                <p className="text-white/60 text-sm mb-2">Perfect score! You truly know your deen!</p>
                <p className="text-yellow-400/80 text-sm mb-8" style={{ fontFamily: "Amiri, serif" }}>
                  بَارَكَ اللهُ فِيكُم — May Allah bless you
                </p>
              </>
            ) : (
              <>
                <p className="text-white/60 mt-3 mb-6">
                  {score >= 5 ? "So close! Almost perfect! 💪" : score >= 3 ? "Good effort! Keep learning the deen! 📖" : "Keep studying! Every question is a lesson. 🌙"}
                </p>
                <button
                  onClick={reset}
                  className="bg-yellow-500 hover:bg-yellow-400 text-stone-900 font-bold px-10 py-3 rounded-xl transition-all active:scale-95 text-lg"
                >
                  Try Again 🔄
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-yellow-500/60 text-sm">Question {current + 1} <span className="text-white/30">/ {QUESTIONS.length}</span></span>
              <span className="bg-yellow-500/20 text-yellow-400 font-bold text-sm px-3 py-1 rounded-full">⭐ {score}</span>
            </div>

            <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${(current / QUESTIONS.length) * 100}%` }}
              />
            </div>

            <p className="text-white text-xl font-semibold mb-6 leading-snug">{q.q}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {q.options.map((opt, i) => {
                let cls = "bg-white/5 border-white/10 text-white/80 hover:border-yellow-400/50 hover:bg-white/10 cursor-pointer";
                if (selected !== null) {
                  if (i === q.answer) cls = "bg-green-500/20 border-green-400 text-green-300 scale-[1.02]";
                  else if (i === selected) cls = "bg-red-500/20 border-red-400 text-red-300";
                  else cls = "bg-white/5 border-white/5 text-white/30 cursor-default";
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    className={`border rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${cls}`}
                  >
                    <span className="text-white/30 mr-2">{["A", "B", "C", "D"][i]}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>

            {showFact && (
              <div className={`rounded-xl px-4 py-3 text-sm mt-2 transition-all duration-500 ${isCorrect ? "bg-green-500/10 border border-green-500/30 text-green-200" : "bg-red-500/10 border border-red-500/30 text-red-200"}`}>
                <span className="font-bold mr-1">{isCorrect ? "✅ Correct!" : "❌ Wrong!"}</span>
                {q.fact}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
