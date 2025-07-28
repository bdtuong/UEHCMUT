"use client";

import { motion } from "framer-motion";

export default function CulturalHistory() {
  // Generate 20 lanterns on each side (left/right)
  const lanterns = Array.from({ length: 40 });

  return (
    <section className="relative overflow-hidden bg-black text-yellow-100 py-28 min-h-[100vh]">
      
      {/* Glow Lights on Left and Right Sides */}
      {lanterns.map((_, index) => {
        const size = Math.floor(Math.random() * 40) + 30;
        const top = Math.random() * 100;
        const side = index < 20 ? "left" : "right";
        const offset = index < 20
          ? Math.random() * 15         // left side: 0–15%
          : 85 + Math.random() * 15;   // right side: 85–100%

        const colors = [
          "rgba(255, 195, 0, 0.6)",
          "rgba(255, 80, 80, 0.5)",
          "rgba(255, 120, 200, 0.5)",
          "rgba(255, 255, 160, 0.5)",
          "rgba(255, 100, 0, 0.4)",
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = (Math.random() * 3 + 2).toFixed(2); // 2–5s

        return (
          <div
            key={index}
            className="absolute rounded-full animate-twinkle-strong blur-md"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              left: `${offset}%`,
              top: `${top}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${(Math.random() * 5).toFixed(2)}s`,
            }}
          />
        );
      })}

      {/* Twinkle Animation */}
      <style>{`
        @keyframes twinkle-strong {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        .animate-twinkle-strong {
          animation-name: twinkle-strong;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>

      {/* Main Content in Center */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="border-l-4 border-yellow-500 italic bg-white/10 backdrop-blur-md px-8 py-6 text-xl md:text-2xl leading-relaxed mb-10 rounded-r-xl shadow-xl text-yellow-100"
          >
            "A traditional Vietnamese lantern is more than just a craft—it's a glowing thread that weaves the past into
            the present, lighting the way for future generations."
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <h3 className="text-3xl font-bold mb-6 font-serif text-yellow-300">
              Illuminating Vietnamese Tradition
            </h3>

            <p className="text-yellow-200 leading-relaxed mb-6">
              For centuries, traditional Vietnamese lanterns have brought beauty, warmth, and symbolism to homes,
              festivals, and sacred spaces. These lanterns, often crafted from silk and bamboo, reflect the nation's
              harmony with nature and its deep spiritual roots.
            </p>

            <p className="text-yellow-200 leading-relaxed mb-6">
              Passed down through generations, the art of lantern-making blends precision and artistry. From the vibrant
              reds symbolizing happiness to the gentle yellows representing prosperity, each color carries meaning and
              purpose.
            </p>

            <p className="text-yellow-200 leading-relaxed">
              During festive nights, especially the Mid-Autumn Festival and Lunar New Year, lanterns light up streets
              and skies across Vietnam—uniting communities in joy, remembrance, and hope.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
