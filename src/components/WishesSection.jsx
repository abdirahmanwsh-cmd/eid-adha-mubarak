const WISHES = [
  { emoji: "🐑", title: "The Sacrifice", text: "May Allah accept your Qurbani and reward you abundantly for your devotion." },
  { emoji: "🕌", title: "The Prayer", text: "May your Eid prayers be answered and your heart filled with peace and gratitude." },
  { emoji: "🌙", title: "The Faith", text: "May the spirit of Ibrahim (AS) inspire unwavering faith in all of us. Eid Mubarak!" },
  { emoji: "🤲", title: "The Blessing", text: "May Allah shower His infinite blessings upon you and your loved ones." },
  { emoji: "🍖", title: "The Giving", text: "May the joy of sharing your Qurbani meat bring happiness to those in need." },
  { emoji: "✨", title: "The Joy", text: "Wishing you a blessed Eid filled with love, laughter, and the warmth of family." },
];

export default function WishesSection() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <p className="text-yellow-500/70 text-xs uppercase tracking-[0.3em] mb-2">Blessings of the Day</p>
        <h2 className="text-3xl font-bold text-white">Eid al-Adha Wishes</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {WISHES.map((w, i) => (
          <div
            key={i}
            className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.03] border border-yellow-500/20 rounded-3xl p-6 hover:border-yellow-400/50 hover:from-white/[0.10] transition-all duration-300 overflow-hidden"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {/* glow blob */}
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-yellow-500/10 blur-2xl group-hover:bg-yellow-500/20 transition-all duration-300" />
            <div className="text-4xl mb-4">{w.emoji}</div>
            <h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-2">{w.title}</h3>
            <p className="text-white/70 text-sm leading-relaxed">{w.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
