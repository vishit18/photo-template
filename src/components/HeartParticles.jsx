import React from "react";

/**
 * @param {{ hearts: { id: number, x: number, y: number, size: number, rotate: number, drift: number, rise: number, duration: number, emoji: string }[] }} props
 */
export default function HeartParticles({ hearts }) {
  return (
    <div className="heart-layer" aria-hidden="true">
      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="heart-particle"
          style={{
            left: `${heart.x}px`,
            top: `${heart.y}px`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.duration}ms`,
            "--drift": `${heart.drift}px`,
            "--rise": `${heart.rise}px`,
            "--scale": `${heart.size / 18}`,
            "--rotate": `${heart.rotate}deg`,
          }}
        >
          {heart.emoji}
        </span>
      ))}
    </div>
  );
}
