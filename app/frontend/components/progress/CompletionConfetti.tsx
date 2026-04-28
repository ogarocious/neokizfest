import React, { useMemo } from "react";

const COLORS = [
  "#FFD700", "#F45D00", "#FF8C00", "#FFB347",
  "#FFFFFF", "#E8E0D8", "#32CD32", "#FFF8DC",
];
const COUNT = 90;

const CompletionConfetti: React.FC = () => {
  const pieces = useMemo(() =>
    Array.from({ length: COUNT }, (_, i) => {
      const r = Math.random();
      const isCircle = r < 0.3;
      const isStrip = r >= 0.3 && r < 0.55;
      return {
        id: i,
        x: Math.random() * 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        width: isStrip ? 3 : isCircle ? 7 + Math.random() * 4 : 7 + Math.random() * 7,
        height: isStrip ? 14 + Math.random() * 10 : isCircle ? 7 + Math.random() * 4 : 5 + Math.random() * 6,
        borderRadius: isCircle ? "50%" : 2,
        duration: 2.2 + Math.random() * 2.4,
        delay: Math.random() * 2,
        endRotation: (Math.random() > 0.5 ? 1 : -1) * (360 + Math.random() * 540),
      };
    }),
  []);

  return (
    <>
      <style>{`
        @keyframes nkfConfettiFall {
          0%   { transform: translateY(-40px) rotate(0deg); opacity: 1; }
          75%  { opacity: 1; }
          100% { transform: translateY(105vh) rotate(var(--nkf-rot)); opacity: 0; }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 9999,
          overflow: "hidden",
        }}
      >
        {pieces.map((p) => (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: 0,
              width: p.width,
              height: p.height,
              borderRadius: p.borderRadius,
              backgroundColor: p.color,
              "--nkf-rot": `${p.endRotation}deg`,
              animation: `nkfConfettiFall ${p.duration}s ${p.delay}s ease-in forwards`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
};

export default CompletionConfetti;
