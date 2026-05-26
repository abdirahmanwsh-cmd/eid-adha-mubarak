import { useState, useCallback, useEffect } from "react";
import StarField from "./components/StarField";
import ShootingStars from "./components/ShootingStars";
import Lantern from "./components/Lantern";
import WishesSection from "./components/WishesSection";
import SendWish from "./components/SendWish";
import EidQuiz from "./components/EidQuiz";

const BLESSINGS = [
  { ar: "تَقَبَّلَ اللهُ مِنَّا وَمِنكُم", en: "May Allah accept from us and from you" },
  { ar: "كُلُّ عَامٍ وَأَنتُم بِخَيْر", en: "May you be well every year" },
  { ar: "اللهُ أَكْبَر", en: "Allah is the Greatest" },
  { ar: "عِيدٌ مُبَارَك", en: "Blessed Eid" },
  { ar: "بَارَكَ اللهُ فِيكُم", en: "May Allah bless you" },
];

const CONFETTI_COLORS = ["#fbbf24", "#f59e0b", "#fde68a", "#fb923c", "#ffffff", "#34d399", "#a78bfa"];
const FLOAT_EMOJIS = ["🐑", "🌙", "✨", "🕌", "🤲", "☪️", "🌟", "🎊", "🌸", "💛"];

const LANTERNS = [
  { hue: "#f59e0b", delay: "0s" },
  { hue: "#ea580c", delay: "0.5s" },
  { hue: "#d97706", delay: "1s" },
  { hue: "#f97316", delay: "0.25s" },
  { hue: "#b45309", delay: "0.75s" },
  { hue: "#fbbf24", delay: "0.4s" },
  { hue: "#c2410c", delay: "0.9s" },
];

function FloatingEmojis() {
  const [emojis] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      emoji: FLOAT_EMOJIS[i % FLOAT_EMOJIS.length],
      left: `${5 + Math.random() * 90}%`,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 8,
      size: 20 + Math.random() * 24,
    }))
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {emojis.map((e) => (
        <div
          key={e.id}
          className="absolute bottom-0 opacity-20"
          style={{
            left: e.left,
            fontSize: e.size,
            animation: `floatUp ${e.duration}s ease-in-out ${e.delay}s infinite`,
          }}
        >
          {e.emoji}
        </div>
      ))}
    </div>
  );
}

function FloatingBlessing({ blessing, origin }) {
  return (
    <div
      className="fixed z-50 pointer-events-none flex flex-col items-center text-center"
      style={{
        left: origin.x,
        top: origin.y,
        transform: "translate(-50%, -50%)",
        animation: "blessingFloat 3s ease-out forwards",
      }}
    >
      <p className="text-yellow-300 font-extrabold text-4xl sm:text-6xl" style={{ fontFamily: "Amiri, serif", textShadow: "0 0 40px #f59e0b, 0 0 80px #fbbf24" }}>
        {blessing.ar}
      </p>
      <p className="text-yellow-100 text-lg sm:text-2xl font-semibold mt-2" style={{ textShadow: "0 0 20px #f59e0b" }}>
        {blessing.en}
      </p>
    </div>
  );
}

function ConfettiBurst({ particles }) {
  if (!particles.length) return null;
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.round ? "50%" : "2px",
            animation: `confettiFall ${p.duration}s ease-in forwards`,
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

function RippleEffect({ ripples }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full border-2 border-yellow-400/60"
          style={{
            left: r.x,
            top: r.y,
            transform: "translate(-50%, -50%)",
            animation: "rippleOut 1s ease-out forwards",
          }}
        />
      ))}
    </div>
  );
}

function MosqueSilhouette() {
  return (
    <div className="w-full flex justify-center items-end pointer-events-none select-none" style={{ height: 120 }}>
      <svg viewBox="0 0 800 120" className="w-full max-w-3xl" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="60" y="40" width="18" height="80" fill="#1e1b4b" />
        <ellipse cx="69" cy="40" rx="9" ry="14" fill="#1e1b4b" />
        <rect x="65" y="26" width="8" height="14" fill="#1e1b4b" />
        <rect x="722" y="40" width="18" height="80" fill="#1e1b4b" />
        <ellipse cx="731" cy="40" rx="9" ry="14" fill="#1e1b4b" />
        <rect x="727" y="26" width="8" height="14" fill="#1e1b4b" />
        <rect x="150" y="60" width="500" height="60" fill="#1e1b4b" />
        <ellipse cx="400" cy="60" rx="100" ry="60" fill="#1e1b4b" />
        <rect x="390" y="5" width="20" height="55" fill="#1e1b4b" />
        <text x="393" y="10" fontSize="18" fill="#fbbf24">☪</text>
        <ellipse cx="250" cy="70" rx="55" ry="35" fill="#1e1b4b" />
        <ellipse cx="550" cy="70" rx="55" ry="35" fill="#1e1b4b" />
        {[200, 280, 360, 440, 520].map((x, i) => (
          <rect key={i} x={x} y="85" width="22" height="35" rx="11" fill="#0d1b4b" />
        ))}
      </svg>
    </div>
  );
}

export default function App() {
  const [blessings, setBlessings] = useState([]);
  const [confetti, setConfetti] = useState([]);
  const [ripples, setRipples] = useState([]);
  const [clicked, setClicked] = useState(false);

  const handleEidClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

    // pulse the text
    setClicked(true);
    setTimeout(() => setClicked(false), 400);

    // floating blessing
    const blessing = BLESSINGS[Math.floor(Math.random() * BLESSINGS.length)];
    const id = Date.now();
    setBlessings((prev) => [...prev, { ...blessing, id, origin }]);
    setTimeout(() => setBlessings((prev) => prev.filter((b) => b.id !== id)), 3100);

    // massive confetti from center
    const particles = Array.from({ length: 180 }, (_, i) => ({
      id: i,
      x: origin.x + (Math.random() - 0.5) * 300,
      y: origin.y - Math.random() * 40,
      size: Math.random() * 18 + 5,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      duration: Math.random() * 1.8 + 1,
      drift: (Math.random() - 0.5) * 500,
      round: Math.random() > 0.5,
    }));
    setConfetti(particles);
    setTimeout(() => setConfetti([]), 3000);

    // ripple rings
    const newRipples = Array.from({ length: 4 }, (_, i) => ({
      id: id + i,
      x: origin.x,
      y: origin.y,
      delay: i * 150,
    }));
    setRipples(newRipples);
    setTimeout(() => setRipples([]), 1500);
  }, []);

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #020617 0%, #0a0a2e 30%, #0d1b4b 60%, #1e1b4b 100%)" }}
    >
      <StarField />
      <ShootingStars />
      <FloatingEmojis />
      <ConfettiBurst particles={confetti} />
      <RippleEffect ripples={ripples} />
      {blessings.map((b) => <FloatingBlessing key={b.id} blessing={b} origin={b.origin} />)}

      {/* Moon */}
      <div className="absolute top-10 right-12 moon-rise z-10 pointer-events-none">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-yellow-100" style={{ boxShadow: "0 0 40px #fde68a, 0 0 80px #f59e0b55" }} />
          <div className="absolute inset-0 rounded-full bg-[#0a0a2e]" style={{ transform: "translate(18px, -4px)" }} />
        </div>
      </div>

      {/* Lanterns */}
      <div className="relative z-10 flex justify-center gap-6 sm:gap-10 pt-6 px-4 flex-wrap">
        {LANTERNS.map((l, i) => <Lantern key={i} hue={l.hue} delay={l.delay} />)}
      </div>

      {/* Hero */}
      <header className="relative z-10 flex flex-col items-center text-center px-4 pt-8 pb-16">
        <p className="text-yellow-400/80 text-xs uppercase tracking-[0.4em] mb-6">بسم الله الرحمن الرحيم</p>

        <h1 className="shimmer-text text-7xl sm:text-9xl font-extrabold mb-3 leading-none">
          عيد مبارك
        </h1>

        <div className="flex items-center gap-3 mb-4">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-yellow-500/60" />
          <span className="text-yellow-400 text-lg">☪</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-yellow-500/60" />
        </div>

        {/* CLICKABLE Eid Mubarak */}
        <button
          onClick={handleEidClick}
          className="relative group mb-5 focus:outline-none"
          style={{ transform: clicked ? "scale(1.12)" : "scale(1)", transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          <span
            className="text-3xl sm:text-5xl font-extrabold tracking-wide block"
            style={{
              background: "linear-gradient(90deg, #fbbf24, #fde68a, #f59e0b)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: clicked ? "drop-shadow(0 0 30px #fbbf24)" : "drop-shadow(0 0 8px #f59e0b88)",
              transition: "filter 0.15s",
            }}
          >
            Eid Mubarak
          </span>
          <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[10px] text-yellow-500/50 group-hover:text-yellow-400/80 transition-colors tracking-widest uppercase whitespace-nowrap">
            ✦ tap me ✦
          </span>
        </button>

        <p className="text-white/50 max-w-lg text-sm sm:text-base leading-relaxed mt-6 mb-10">
          Commemorating the devotion of Ibrahim (AS) — may this blessed day of sacrifice bring peace, mercy, and joy to you and your family.
        </p>

        <div className="text-6xl float">🐑</div>
      </header>

      {/* Mosque */}
      <div className="relative z-10 -mb-1">
        <MosqueSilhouette />
      </div>

      <div style={{ background: "linear-gradient(180deg, #1e1b4b 0%, #0d1b4b 100%)" }}>

        <div className="relative z-10 flex items-center gap-4 px-8 max-w-5xl mx-auto pt-12">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-500/30" />
          <span className="text-yellow-500/60 text-sm uppercase tracking-widest">Blessings</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-500/30" />
        </div>

        <div className="relative z-10"><WishesSection /></div>

        <div className="relative z-10 flex items-center gap-4 px-8 max-w-5xl mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-500/30" />
          <span className="text-yellow-500/60 text-sm uppercase tracking-widest">Quiz</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-500/30" />
        </div>

        <div className="relative z-10"><EidQuiz /></div>

        <div className="relative z-10 flex items-center gap-4 px-8 max-w-5xl mx-auto">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-yellow-500/30" />
          <span className="text-yellow-500/60 text-sm uppercase tracking-widest">Community</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-yellow-500/30" />
        </div>

        <div className="relative z-10 pt-8"><SendWish /></div>

        <footer className="relative z-10 text-center pb-8">
          <p className="text-white/20 text-xs tracking-widest">تقبل الله منا ومنكم — May Allah accept from us and from you</p>
        </footer>
      </div>
    </div>
  );
}
