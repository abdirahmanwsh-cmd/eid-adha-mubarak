import { useEffect, useState } from "react";

function ShootingStar({ id, onDone }) {
  const top = `${Math.random() * 50}%`;
  const left = `${Math.random() * 80}%`;
  const duration = Math.random() * 1 + 0.6;

  useEffect(() => {
    const t = setTimeout(onDone, duration * 1000 + 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed pointer-events-none z-20"
      style={{
        top,
        left,
        width: 120,
        height: 2,
        background: "linear-gradient(90deg, #fff, #fbbf24, transparent)",
        borderRadius: 999,
        animation: `shootingStar ${duration}s ease-out forwards`,
        transform: "rotate(-35deg)",
      }}
    />
  );
}

export default function ShootingStars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const spawn = () => {
      const id = Date.now() + Math.random();
      setStars((s) => [...s, id]);
      setTimeout(() => setStars((s) => s.filter((x) => x !== id)), 2000);
    };
    spawn();
    const interval = setInterval(spawn, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {stars.map((id) => (
        <ShootingStar key={id} id={id} onDone={() => {}} />
      ))}
    </>
  );
}
