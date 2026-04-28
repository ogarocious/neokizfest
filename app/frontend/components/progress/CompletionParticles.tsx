import React, { useMemo } from "react";

const COUNT = 22;

const CompletionParticles: React.FC = () => {
  const particles = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      id: i,
      x: 3 + Math.random() * 94,
      size: 2 + Math.random() * 3,
      duration: 9 + Math.random() * 14,
      delay: -(Math.random() * 20),
      opacity: 0.15 + Math.random() * 0.35,
      color: i % 3 === 0 ? "#FFD700" : i % 3 === 1 ? "#F45D00" : "#FF8C00",
      drift: (Math.random() - 0.5) * 60,
    })),
  []);

  return (
    <>
      <style>{`
        @keyframes nkfParticleDrift {
          0%   { transform: translateY(0px) translateX(0px); opacity: 0; }
          8%   { opacity: var(--nkf-pop); }
          92%  { opacity: var(--nkf-pop); }
          100% { transform: translateY(-280px) translateX(var(--nkf-drift)); opacity: 0; }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 8,
          overflow: "hidden",
        }}
      >
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              bottom: `${5 + Math.random() * 30}%`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              backgroundColor: p.color,
              boxShadow: `0 0 ${p.size * 2.5}px ${p.color}88`,
              "--nkf-pop": p.opacity,
              "--nkf-drift": `${p.drift}px`,
              animation: `nkfParticleDrift ${p.duration}s ${p.delay}s linear infinite`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
};

export default CompletionParticles;
