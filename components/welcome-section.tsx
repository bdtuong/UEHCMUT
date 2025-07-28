"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function WelcomeSection() {
  const [stars, setStars] = useState<
    { id: number; top: number; left: number; color: string }[]
  >([]);

  useEffect(() => {
    let id = 0;

    const interval = setInterval(() => {
      const top = Math.random() * 60 + 10;
      const left = Math.random() * 80 + 5;
      const colors = [
        "#ffe082",
        "#ff8a80",
        "#ea80fc",
        "#80d8ff",
        "#a7ffeb",
        "#ffd180",
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];

      const newStar = { id: id++, top, left, color };
      setStars((prev) => [...prev, newStar]);

      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== newStar.id));
      }, 1200);
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  const imageClass =
    "w-44 h-72 object-cover rounded-xl shadow-xl transition-transform duration-500 ease-out hover:scale-105 hover:shadow-yellow-300/30 border border-yellow-400";

  return (
    <section className="py-20 bg-black text-white relative overflow-hidden">

      {/* === Shooting Stars === */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="shooting-star"
          style={{
            top: `${star.top}vh`,
            left: `${star.left}vw`,
            "--star-color": star.color,
          } as React.CSSProperties}
        />
      ))}

      {/* === Main Content === */}
      <div className="mx-auto max-w-7xl px-6 flex flex-col lg:flex-row items-center justify-center gap-12 relative z-10">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="relative max-w-md px-6 py-8 rounded-xl"
        >
          <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-white" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-white" />

          <h2 className="text-3xl font-serif font-bold text-white mb-4">
            Welcome to{" "}
            <span className="relative color-cycle">
              Lanternverse
            </span>
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Journey into the heart of Vietnam’s traditional lantern craft. At
            LanternVerse, we celebrate the timeless glow, intricate artistry,
            and cultural soul of Saigon’s historic lantern villages.
          </p>
        </motion.div>

        {/* Images */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          viewport={{ once: true }}
          className="group relative flex items-center justify-center gap-6"
        >
          <img src="/welcome-section/wc-lantern-1.jpg" alt="Lantern 1" className={imageClass} />
          <div className="flex flex-col gap-6">
            <img src="/welcome-section/wc-lantern-2.jpg" alt="Lantern 2" className={imageClass} />
            <img src="/welcome-section/wc-lantern-3.jpg" alt="Lantern 3" className={imageClass} />
          </div>
        </motion.div>
      </div>

      {/* === Custom Styles === */}
      <style>{`
        .shooting-star {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--star-color);
          opacity: 0;
          box-shadow: 0 0 10px 4px var(--star-color);
          animation: shoot-left 1s ease-out forwards;
          transform: rotate(135deg);
        }

        .shooting-star::after {
          content: '';
          position: absolute;
          width: 100px;
          height: 2px;
          top: 1px;
          right: 2px;
          transform: rotate(0deg);
          background: linear-gradient(
            270deg,
            var(--star-color),
            transparent
          );
          filter: blur(3px);
        }

        @keyframes shoot-left {
          0% {
            transform: translate(0, 0) rotate(135deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate(-250px, 250px) rotate(135deg);
            opacity: 0;
          }
        }

        @keyframes colorCycle {
          0%, 100% {
            color: #f87171;
          }
          50% {
            color: #facc15;
          }
        }

        .color-cycle {
          animation: colorCycle 2s ease-in-out infinite;
        }

        .group::before {
          content: "";
          position: absolute;
          inset: -20px;
          background: radial-gradient(circle, rgba(255,255,255,0.08), transparent 70%);
          filter: blur(30px);
          z-index: 0;
          pointer-events: none;
          border-radius: 2rem;
        }
      `}</style>
    </section>
  );
}