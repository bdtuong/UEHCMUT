"use client";

import { motion } from "framer-motion";

export default function CulturalHeritage2() {
  const sparkles = Array.from({ length: 30 });

  return (
    <section className="relative overflow-hidden bg-black text-white py-28 min-h-[100vh]">
      {/* ✨ Floating Sparkles on both sides */}
      {sparkles.map((_, i) => {
        const size = Math.random() * 20 + 10;
        const left = i < 15 ? Math.random() * 10 : 90 + Math.random() * 10;
        const top = Math.random() * 100;
        const color = `hsl(${Math.random() * 60 + 90}, 100%, 70%)`;
        const duration = (Math.random() * 2 + 1.5).toFixed(2);

        return (
          <div
            key={i}
            className="absolute rounded-full blur-md animate-sparkle"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: color,
              top: `${top}%`,
              left: `${left}%`,
              animationDuration: `${duration}s`,
              animationDelay: `${(Math.random() * 3).toFixed(2)}s`,
            }}
          />
        );
      })}

      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.4); }
        }
        .animate-sparkle {
          animation: sparkle infinite ease-in-out;
        }
      `}</style>

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-serif text-lime-300 mb-8"
          >
            Echoes of Craft in a Modern World
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-lime-100 leading-relaxed mb-10"
          >
            As technology reshapes daily life, the heartbeat of tradition remains strong. From intricate brocade to hand-painted ceramics, Vietnam’s crafts adapt and thrive.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-10 text-left"
          >
            <div className="bg-white/5 p-6 rounded-xl shadow-md backdrop-blur-sm">
              <h4 className="text-lime-300 font-semibold text-xl mb-2">Heritage Revived</h4>
              <p className="text-lime-100">
                Young artists and creators are reviving ancient techniques—merging innovation with heritage to share stories across global platforms.
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl shadow-md backdrop-blur-sm">
              <h4 className="text-lime-300 font-semibold text-xl mb-2">Living Museums</h4>
              <p className="text-lime-100">
                Community workshops and cultural villages act as living museums, where visitors can witness—and join—the craft in motion.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
