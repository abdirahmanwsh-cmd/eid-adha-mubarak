import { useEffect, useState } from "react";

const EID_DATE = new Date("2026-05-27T00:00:00");

function pad(n) {
  return String(n).padStart(2, "0");
}

function getTimeLeft() {
  const diff = EID_DATE - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function Countdown({ onCountdownClick }) {
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!time) return (
    <div
      onClick={onCountdownClick}
      className="pulse-ring rounded-2xl px-8 py-4 bg-yellow-500/20 border border-yellow-400/40 cursor-pointer select-none hover:bg-yellow-500/30 transition-colors"
    >
      <p className="text-yellow-300 text-2xl font-bold tracking-widest">🎉 Eid Mubarak! 🎉</p>
    </div>
  );

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <div className="text-center">
      <p
        onClick={onCountdownClick}
        className="text-yellow-500/70 text-xs uppercase tracking-[0.25em] mb-5 cursor-pointer hover:text-yellow-400 transition-colors select-none"
      >
        Eid al-Adha 2025 begins in
      </p>
      <div className="flex gap-3 justify-center">
        {units.map(({ label, value }, i) => (
          <div key={label} className="flex flex-col items-center">
            <div className="relative bg-gradient-to-b from-white/15 to-white/5 border border-yellow-500/30 rounded-2xl px-4 py-4 min-w-[72px] overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent" />
              <span className="text-4xl font-black text-white tabular-nums">{pad(value)}</span>
            </div>
            <span className="text-yellow-500/60 text-[10px] uppercase tracking-widest mt-2">{label}</span>
            {i < units.length - 1 && (
              <span className="absolute text-yellow-400/60 text-2xl font-bold" style={{ marginLeft: "88px", marginTop: "-28px" }}>:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
