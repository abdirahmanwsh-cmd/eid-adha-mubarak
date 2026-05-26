import { useState, useEffect, useRef } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

const EMOJIS = ["🐑", "🕌", "🌙", "✨", "🤲", "☪️", "🌟", "🎊"];
const MESSAGES = [
  "May Allah accept your sacrifice!",
  "Taqabbal Allahu minna wa minkum!",
  "May your home be filled with joy!",
  "Wishing you peace and blessings!",
  "May Allah grant you happiness!",
];
const CONFETTI_COLORS = ["#fbbf24", "#f59e0b", "#fde68a", "#fb923c", "#ffffff"];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function Confetti({ trigger }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!trigger) return;
    const p = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: randomBetween(20, 80),
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: randomBetween(6, 12),
      duration: randomBetween(1.2, 2.2),
      delay: randomBetween(0, 0.4),
      drift: randomBetween(-30, 30),
    }));
    setParticles(p);
    const t = setTimeout(() => setParticles([]), 2600);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!particles.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm"
          style={{
            left: `${p.x}%`,
            top: "-10px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animation: `confettiFall ${p.duration}s ease-in forwards`,
            animationDelay: `${p.delay}s`,
            "--drift": `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

function timeAgo(ts) {
  if (!ts) return "just now";
  const diff = Math.floor((Date.now() - ts.toMillis()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function WishBubble({ wish, index }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 80);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <div
      className="flex items-start gap-3 bg-white/10 border border-yellow-500/20 rounded-2xl px-4 py-3 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
      }}
    >
      <span className="text-2xl">{wish.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="text-yellow-300 font-semibold text-sm">{wish.name}</p>
        <p className="text-yellow-100/80 text-xs mt-0.5">{wish.message}</p>
      </div>
      <span className="text-yellow-500/40 text-xs shrink-0">{timeAgo(wish.createdAt)}</span>
    </div>
  );
}

export default function SendWish() {
  const [name, setName] = useState("");
  const [wishes, setWishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confettiKey, setConfettiKey] = useState(0);
  const [justSent, setJustSent] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "wishes"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setWishes(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    const wish = {
      name: name.trim(),
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
      createdAt: serverTimestamp(),
    };

    setJustSent(name.trim());
    setConfettiKey((k) => k + 1);
    setName("");
    setTimeout(() => setJustSent(null), 3000);
    setTimeout(() => listRef.current?.scrollIntoView({ behavior: "smooth" }), 100);

    await addDoc(collection(db, "wishes"), wish);
  }

  return (
    <section className="w-full max-w-lg mx-auto px-4 pb-16">
      <Confetti trigger={confettiKey} />

      <h2 className="text-center text-yellow-400 text-2xl font-bold mb-2 tracking-wide">
        Send Your Wishes 🎊
      </h2>
      <p className="text-center text-yellow-200/60 text-sm mb-6">
        {loading ? "Loading wishes..." : `Join ${wishes.length} people spreading Eid joy`}
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={30}
          className="flex-1 bg-white/10 border border-yellow-500/40 rounded-xl px-4 py-3 text-yellow-100 placeholder-yellow-300/40 outline-none focus:border-yellow-400 transition"
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-stone-900 font-bold px-5 rounded-xl transition-all active:scale-95"
        >
          🐑 Send
        </button>
      </form>

      {/* Success toast */}
      <div
        className="overflow-hidden transition-all duration-500"
        style={{ maxHeight: justSent ? "60px" : "0px", opacity: justSent ? 1 : 0 }}
      >
        <div className="bg-yellow-500/20 border border-yellow-400/40 rounded-xl px-4 py-2 text-center text-yellow-300 text-sm mb-4">
          🎉 Eid Mubarak, <span className="font-bold">{justSent}</span>! Your wish has been sent!
        </div>
      </div>

      {/* Wishes list */}
      <div ref={listRef} className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-center text-yellow-500/50 text-sm py-6">Loading wishes...</p>
        ) : wishes.length === 0 ? (
          <p className="text-center text-yellow-500/50 text-sm py-6">Be the first to send a wish! 🐑</p>
        ) : (
          wishes.map((w, i) => <WishBubble key={w.id} wish={w} index={i} />)
        )}
      </div>
    </section>
  );
}
