import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, orderBy, query, serverTimestamp, where } from "firebase/firestore";

const ALL_QUESTIONS = [
  {
    q: "What is the Arabic name for the act of slaughtering an animal during Eid al-Adha?",
    options: ["Sadaqah", "Zakat", "Udhiyah", "Fidyah"],
    answer: 2,
    fact: "Udhiyah is the ritual slaughter performed between the 10th and 13th of Dhul Hijjah.",
  },
  {
    q: "Which Surah in the Quran directly references the story of Ibrahim's sacrifice?",
    options: ["Surah Al-Baqarah", "Surah As-Saffat", "Surah Ibrahim", "Surah Al-Hajj"],
    answer: 1,
    fact: "Surah As-Saffat (37:99-111) narrates the story of Ibrahim (AS) and his willingness to sacrifice his son.",
  },
  {
    q: "What is the ruling on performing Udhiyah for a Muslim who can afford it?",
    options: ["Fard (obligatory)", "Sunnah Mu'akkadah (confirmed Sunnah)", "Mustahabb (recommended)", "Mubah (permissible)"],
    answer: 1,
    fact: "According to the majority of scholars, Udhiyah is a Sunnah Mu'akkadah — a strongly confirmed Sunnah for those who can afford it.",
  },
  {
    q: "Until what time can Udhiyah be performed after Eid al-Adha?",
    options: ["End of 10th Dhul Hijjah", "End of 11th Dhul Hijjah", "Sunset of 13th Dhul Hijjah", "End of Dhul Hijjah"],
    answer: 2,
    fact: "Udhiyah can be performed on the 10th, 11th, 12th, and 13th of Dhul Hijjah — the days of Tashreeq.",
  },
  {
    q: "What did Allah replace the sacrifice with at the last moment?",
    options: ["A camel", "A white bull", "A ram from Jannah", "A black goat"],
    answer: 2,
    fact: "Allah sent a ram (kibsh) from Jannah as a ransom, which Ibrahim (AS) sacrificed instead of his son.",
  },
  {
    q: "What is the minimum number of shares in a camel for Udhiyah?",
    options: ["3 shares", "5 shares", "7 shares", "10 shares"],
    answer: 2,
    fact: "A camel can be shared by up to 7 people for Udhiyah, same as a cow or buffalo.",
  },
  {
    q: "On the Day of Arafah (9th Dhul Hijjah), what is recommended for non-pilgrims?",
    options: ["Performing Umrah", "Fasting the entire day", "Giving extra Sadaqah", "Reading Surah Al-Kahf"],
    answer: 1,
    fact: "Fasting on the Day of Arafah expiates sins of the previous and coming year, according to a hadith in Sahih Muslim.",
  },
  {
    q: "What is the name of the valley where Hajar (AS) ran between two hills searching for water?",
    options: ["Mina", "Muzdalifah", "Between Safa and Marwa", "Wadi al-Nahr"],
    answer: 2,
    fact: "Hajar (AS) ran seven times between the hills of Safa and Marwa. This act is commemorated in the Sa'i ritual of Hajj and Umrah.",
  },
  {
    q: "Which of the Five Pillars of Islam is directly connected to Eid al-Adha?",
    options: ["Salah", "Sawm", "Zakat", "Hajj"],
    answer: 3,
    fact: "Hajj, the annual pilgrimage to Makkah, takes place in Dhul Hijjah and culminates with Eid al-Adha.",
  },
  {
    q: "What is the Takbeer al-Tashriq recited after every Fard prayer from?",
    options: ["Fajr of 8th to Asr of 12th Dhul Hijjah", "Fajr of 9th to Asr of 13th Dhul Hijjah", "Dhuhr of 10th to Maghrib of 13th", "Fajr of 10th to Isha of 12th"],
    answer: 1,
    fact: "Takbeer al-Tashriq begins after Fajr on the 9th of Dhul Hijjah and ends after Asr on the 13th.",
  },
  {
    q: "What is the well that miraculously sprang up for Ismail (AS) as an infant called?",
    options: ["Bir Tuwa", "Zamzam", "Bir Aris", "Bir Haa"],
    answer: 1,
    fact: "The Zamzam well sprang up beneath the feet of baby Ismail (AS) when Hajar (AS) was desperately searching for water.",
  },
  {
    q: "According to Islamic scholars, which son did Ibrahim (AS) intend to sacrifice?",
    options: ["Ishaq (Isaac)", "Ismail (Ishmael)", "Both opinions exist in scholarship", "Yusuf (Joseph)"],
    answer: 1,
    fact: "The majority of Islamic scholars hold that it was Ismail (AS), based on Quranic context and hadith, though some early scholars said Ishaq (AS).",
  },
  {
    q: "What is the condition of the animal's health for a valid Udhiyah?",
    options: ["It must be completely healthy with no defects", "Minor defects are allowed", "Only blind animals are excluded", "Any animal is acceptable"],
    answer: 0,
    fact: "The animal must be free from obvious defects — it cannot be one-eyed, lame, sick, or extremely thin.",
  },
  {
    q: "What does 'Dhul Hijjah' literally mean in Arabic?",
    options: ["Month of Fasting", "Month of Pilgrimage", "Month of Sacrifice", "Month of Remembrance"],
    answer: 1,
    fact: "Dhul Hijjah means 'Possessor of the Pilgrimage' — it is the month in which Hajj takes place.",
  },
];

const CONFETTI_COLORS = ["#fbbf24", "#f59e0b", "#fde68a", "#fb923c", "#ff6b9d", "#a78bfa", "#34d399", "#ffffff"];
const CELEBRATION_EMOJIS = ["🎉", "🏆", "💛", "❤️", "🌟", "✨", "🎊", "💫", "🐑", "☪️"];
const MAX_TRIES = 3;
const Q_PER_ROUND = 7;

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }
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
          <div key={p.id} className="absolute text-2xl" style={{ left: p.x, top: "-40px", animation: `confettiFall ${p.duration}s ease-in forwards`, animationDelay: `${p.delay}s`, "--drift": `${p.drift}px` }}>
            {p.emoji}
          </div>
        ) : (
          <div key={p.id} className="absolute" style={{ left: p.x, top: "-20px", width: p.size, height: p.size, backgroundColor: p.color, borderRadius: p.round ? "50%" : "2px", animation: `confettiFall ${p.duration}s ease-in forwards`, animationDelay: `${p.delay}s`, "--drift": `${p.drift}px` }} />
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
      type: Math.random() > 0.5 ? "❤️" : "💛",
    }))
  );
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {hearts.map((h) => (
        <div key={h.id} className="absolute" style={{ left: h.left, bottom: 0, fontSize: h.size, animation: `floatUp ${h.duration}s ease-out ${h.delay}s forwards` }}>
          {h.type}
        </div>
      ))}
    </div>
  );
}

function TryRow({ attempt, score, total }) {
  const perfect = score === total;
  const pct = Math.round((score / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span className="text-yellow-500/50 text-xs w-14 shrink-0">Try {attempt}</span>
      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${perfect ? "bg-yellow-400" : score >= total * 0.7 ? "bg-green-400" : score >= total * 0.4 ? "bg-orange-400" : "bg-red-400"}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-10 text-right ${perfect ? "text-yellow-300" : "text-white/60"}`}>
        {score}/{total} {perfect ? "🏆" : ""}
      </span>
    </div>
  );
}

export default function EidQuiz({ playerName: initialName, onNameSet }) {
  const [nameInput, setNameInput] = useState("");
  const [playerName, setPlayerName] = useState(initialName || null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [tryNumber, setTryNumber] = useState(1);
  const [tryHistory, setTryHistory] = useState([]); // [{attempt, score, total}]
  const [celebrating, setCelebrating] = useState(false);
  const [showFact, setShowFact] = useState(false);
  const [globalResults, setGlobalResults] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "quizResults"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setGlobalResults(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoadingResults(false);
    });
    return () => unsub();
  }, []);

  function startQuiz(name) {
    setQuestions(shuffle(ALL_QUESTIONS).slice(0, Q_PER_ROUND));
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setDone(false);
    setShowFact(false);
  }

  function handleNameSubmit(e) {
    e.preventDefault();
    if (!nameInput.trim()) return;
    const name = nameInput.trim();
    setPlayerName(name);
    onNameSet?.(name);
    startQuiz(name);
  }

  async function handleDone(finalScore) {
    const newHistory = [...tryHistory, { attempt: tryNumber, score: finalScore, total: Q_PER_ROUND }];
    setTryHistory(newHistory);
    setDone(true);
    const perfect = finalScore === Q_PER_ROUND;
    if (perfect) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 4500);
    }
    await addDoc(collection(db, "quizResults"), {
      name: playerName,
      score: finalScore,
      total: Q_PER_ROUND,
      attempt: tryNumber,
      createdAt: serverTimestamp(),
    });
  }

  function handleAnswer(i) {
    if (selected !== null) return;
    setSelected(i);
    setShowFact(true);
    const newScore = i === questions[current].answer ? score + 1 : score;
    if (i === questions[current].answer) setScore(newScore);
    setTimeout(() => {
      if (current + 1 >= questions.length) {
        handleDone(newScore);
      } else {
        setCurrent((c) => c + 1);
        setSelected(null);
        setShowFact(false);
      }
    }, 1800);
  }

  function tryAgain() {
    setTryNumber((n) => n + 1);
    startQuiz(playerName);
  }

  const perfect = score === Q_PER_ROUND;
  const noTriesLeft = tryNumber >= MAX_TRIES;
  const triesLeft = MAX_TRIES - tryNumber;
  const q = questions[current];
  const isCorrect = selected === q?.answer;

  // group global results by name for the leaderboard on name screen
  const leaderboard = Object.values(
    globalResults.reduce((acc, r) => {
      const key = r.name.toLowerCase();
      if (!acc[key]) acc[key] = { name: r.name, best: 0, tries: 0 };
      if (r.score > acc[key].best) acc[key].best = r.score;
      acc[key].tries += 1;
      return acc;
    }, {})
  ).sort((a, b) => b.best - a.best).slice(0, 8);

  if (!playerName) {
    return (
      <section className="w-full max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-yellow-500/70 text-xs uppercase tracking-[0.3em] mb-2">Test Your Knowledge</p>
          <h2 className="text-3xl font-bold text-white">Eid al-Adha Quiz 🕌</h2>
          <p className="text-white/40 text-sm mt-2">{Q_PER_ROUND} questions · {MAX_TRIES} tries · How well do you know your deen?</p>
        </div>
        <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-yellow-500/20 rounded-3xl p-8">
          <p className="text-white/70 text-center mb-6">Enter your name to start</p>
          <form onSubmit={handleNameSubmit} className="flex gap-2 mb-8">
            <input
              type="text"
              placeholder="Your name..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              maxLength={30}
              className="flex-1 bg-white/10 border border-yellow-500/40 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/40 outline-none focus:border-yellow-400 transition"
            />
            <button type="submit" disabled={!nameInput.trim()} className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 text-stone-900 font-bold px-6 rounded-xl transition-all active:scale-95">
              Start 🚀
            </button>
          </form>

          {!loadingResults && leaderboard.length > 0 && (
            <>
              <p className="text-yellow-500/60 text-xs uppercase tracking-widest mb-3">🏆 Leaderboard</p>
              <div className="flex flex-col gap-2">
                {leaderboard.map((r, i) => (
                  <div key={r.name} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2">
                    <span className="text-white/30 text-xs w-5">{i + 1}.</span>
                    <span className="text-yellow-300 text-sm font-semibold flex-1">{r.name}</span>
                    <span className="text-white/40 text-xs">{r.tries} {r.tries === 1 ? "try" : "tries"}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.best === Q_PER_ROUND ? "bg-yellow-500/30 text-yellow-300" : "bg-white/10 text-white/50"}`}>
                      {r.best === Q_PER_ROUND ? "🏆" : "⭐"} {r.best}/{Q_PER_ROUND}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-16">
      {celebrating && <CelebrationBurst />}
      {celebrating && <FloatingHearts />}

      <div className="text-center mb-10">
        <p className="text-yellow-500/70 text-xs uppercase tracking-[0.3em] mb-2">Test Your Knowledge</p>
        <h2 className="text-3xl font-bold text-white">Eid al-Adha Quiz 🕌</h2>
        <p className="text-white/40 text-sm mt-2">
          Playing as <span className="text-yellow-400">{playerName}</span> · Try {tryNumber} of {MAX_TRIES}
        </p>
      </div>

      <div className="bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-yellow-500/20 rounded-3xl p-8">
        {done ? (
          <div className="text-center">
            <div className="text-8xl mb-4 inline-block" style={{ animation: perfect ? "float 2s ease-in-out infinite" : undefined }}>
              {perfect ? "🏆" : score >= 5 ? "🌟" : score >= 3 ? "🐑" : "📖"}
            </div>
            <p className="text-yellow-300 text-5xl font-black mb-1">
              {score}<span className="text-white/30 text-3xl"> / {Q_PER_ROUND}</span>
            </p>

            {/* Per-try history */}
            {tryHistory.length > 0 && (
              <div className="mt-6 mb-6 text-left bg-white/5 rounded-2xl p-4 flex flex-col gap-3">
                <p className="text-yellow-500/60 text-xs uppercase tracking-widest mb-1">Your Results</p>
                {tryHistory.map((t) => (
                  <TryRow key={t.attempt} attempt={t.attempt} score={t.score} total={t.total} />
                ))}
              </div>
            )}

            {perfect ? (
              <>
                <p className="text-2xl font-bold text-yellow-300 mb-1">Mashallah, {playerName}! 🎉</p>
                <p className="text-white/60 text-sm mb-2">Perfect score! You truly know your deen!</p>
                <p className="text-yellow-400/80 text-sm mb-4" style={{ fontFamily: "Amiri, serif" }}>
                  بَارَكَ اللهُ فِيكُم — May Allah bless you
                </p>
              </>
            ) : (
              <>
                <p className="text-white/60 mb-4">
                  {score >= 5 ? "So close! Almost perfect! 💪" : score >= 3 ? "Good effort! Keep learning the deen! 📖" : "Keep studying! Every question is a lesson. 🌙"}
                </p>
                {!noTriesLeft ? (
                  <>
                    <p className="text-yellow-500/50 text-sm mb-4">
                      {triesLeft} {triesLeft === 1 ? "try" : "tries"} remaining — you'll get different questions!
                    </p>
                    <button onClick={tryAgain} className="bg-yellow-500 hover:bg-yellow-400 text-stone-900 font-bold px-10 py-3 rounded-xl transition-all active:scale-95 text-lg">
                      Try Again 🔄
                    </button>
                  </>
                ) : (
                  <p className="text-red-400/70 text-sm">No more tries left. Better luck next Eid! 🌙</p>
                )}
              </>
            )}

            {/* Leaderboard always visible on done screen */}
            {leaderboard.length > 0 && (
              <div className="mt-8 text-left">
                <p className="text-yellow-500/60 text-xs uppercase tracking-widest mb-3">🏆 Leaderboard</p>
                <div className="flex flex-col gap-2">
                  {leaderboard.map((r, i) => (
                    <div key={r.name} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2">
                      <span className="text-white/30 text-xs w-5">{i + 1}.</span>
                      <span className={`text-sm font-semibold flex-1 ${r.name === playerName ? "text-yellow-300" : "text-white/70"}`}>{r.name} {r.name === playerName ? "(you)" : ""}</span>
                      <span className="text-white/40 text-xs">{r.tries} {r.tries === 1 ? "try" : "tries"}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.best === Q_PER_ROUND ? "bg-yellow-500/30 text-yellow-300" : "bg-white/10 text-white/50"}`}>
                        {r.best === Q_PER_ROUND ? "🏆" : "⭐"} {r.best}/{Q_PER_ROUND}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <span className="text-yellow-500/60 text-sm">Question {current + 1} <span className="text-white/30">/ {Q_PER_ROUND}</span></span>
              <div className="flex items-center gap-3">
                <span className="bg-yellow-500/20 text-yellow-400 font-bold text-sm px-3 py-1 rounded-full">⭐ {score}</span>
                <span className="text-white/30 text-xs">Try {tryNumber}/{MAX_TRIES}</span>
              </div>
            </div>

            <div className="w-full h-1.5 bg-white/10 rounded-full mb-8 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all duration-700" style={{ width: `${(current / Q_PER_ROUND) * 100}%` }} />
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
                  <button key={i} onClick={() => handleAnswer(i)} className={`border rounded-xl px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${cls}`}>
                    <span className="text-white/30 mr-2">{["A", "B", "C", "D"][i]}.</span>{opt}
                  </button>
                );
              })}
            </div>

            {showFact && (
              <div className={`rounded-xl px-4 py-3 text-sm mt-2 ${isCorrect ? "bg-green-500/10 border border-green-500/30 text-green-200" : "bg-red-500/10 border border-red-500/30 text-red-200"}`}>
                <span className="font-bold mr-1">{isCorrect ? "✅ Correct!" : "❌ Wrong!"}</span>{q.fact}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
