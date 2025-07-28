"use client";

import { motion } from "framer-motion";

export default function CulturalHistory() {
  const lanterns = Array.from({ length: 40 });

  return (
    <section className="relative overflow-hidden bg-black text-red-100 py-28 min-h-[100vh]">
      {/* Red glow particles floating */}
      {lanterns.map((_, index) => {
        const size = Math.floor(Math.random() * 40) + 30;
        const top = Math.random() * 100;
        const offset = index < 20 ? Math.random() * 15 : 85 + Math.random() * 15;

        const colors = [
          "rgba(255, 80, 80, 0.6)",
          "rgba(255, 120, 120, 0.5)",
          "rgba(255, 100, 0, 0.5)",
          "rgba(255, 50, 50, 0.4)",
          "rgba(255, 150, 100, 0.4)"
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const duration = (Math.random() * 3 + 2).toFixed(2);

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

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.blockquote
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
            className="border-l-4 border-red-500 italic bg-white/10 backdrop-blur-md px-8 py-6 text-xl md:text-2xl leading-relaxed mb-10 rounded-r-xl shadow-xl text-red-100"
          >
            "Traditional lanterns are not just decorations — they are vessels of light, memory, and cultural identity that continue to shine through generations."
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
            viewport={{ once: true }}
            className="prose prose-invert prose-lg max-w-none"
          >
            <h3 className="text-3xl font-bold mb-6 font-serif text-red-600">
              The Timeless Glow of Vietnamese Lanterns
            </h3>

            <p className="text-red-200 leading-relaxed mb-6">
              Vietnamese traditional lanterns have long played a meaningful role in cultural rituals, festivals, and family life. They are lovingly crafted by hand using natural materials such as bamboo frames and colorful tissue paper or silk.
            </p>

            <p className="text-red-200 leading-relaxed mb-6">
              These lanterns take on many shapes—lotus flowers, stars, carps—and are especially iconic during the Mid-Autumn Festival, where children parade with glowing lights in celebration of unity and harvest.
            </p>

            <p className="text-red-200 leading-relaxed mb-6">
              Each piece reflects the skill and patience of artisans who pass down techniques through generations. Beyond their beauty, lanterns embody wishes for happiness, warmth, and good fortune.
            </p>

            <p className="text-red-200 leading-relaxed">
              Whether hung outside homes or floated down rivers during ceremonies, traditional lanterns continue to light the way for Vietnamese culture—bridging the past and present with every flicker.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
