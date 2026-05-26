export default function Lantern({ hue = "#f59e0b", delay = "0s" }) {
  return (
    <div className="flex flex-col items-center sway" style={{ animationDelay: delay }}>
      {/* rope */}
      <div className="w-px h-10 bg-gradient-to-b from-yellow-200/60 to-yellow-400/40" />
      {/* top cap */}
      <div className="w-7 h-2 rounded-t-full" style={{ backgroundColor: hue, opacity: 0.9 }} />
      {/* body */}
      <div
        className="lantern-glow relative w-8 h-14 rounded-[40%] flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: hue }}
      >
        {/* inner glow */}
        <div className="absolute inset-1 rounded-[40%] bg-yellow-100/30" />
        {/* ribs */}
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-yellow-900/20"
            style={{ top: `${25 + i * 20}%` }}
          />
        ))}
        <div className="w-2 h-2 rounded-full bg-yellow-100/80 z-10" />
      </div>
      {/* bottom cap */}
      <div className="w-7 h-2 rounded-b-full" style={{ backgroundColor: hue, opacity: 0.9 }} />
      {/* tassel */}
      <div className="flex gap-0.5 mt-0.5">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-px h-3 bg-yellow-300/60" />
        ))}
      </div>
    </div>
  );
}
