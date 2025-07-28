"use client";

import { motion } from "framer-motion";

export default function CulturalHeritage() {
  const sparkles = Array.from({ length: 30 });

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-black via-gray-900 to-black text-white py-28 min-h-[100vh]">
      {/* ✨ Floating Sparkles on both sides */}
      {sparkles.map((_, i) => {
        const size = Math.random() * 20 + 10;
        const left = i < 15 ? Math.random() * 10 : 90 + Math.random() * 10;
        const top = Math.random() * 100;
        const color = `hsl(${Math.random() * 60 + 40}, 100%, 70%)`;
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

      {/* 🌿 Section Content */}
      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold font-serif text-yellow-300 mb-8"
          >
            Lanterns: The Living Spirit of Vietnamese Heritage
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-yellow-100 leading-relaxed mb-10"
          >
            Through the gentle glow of traditional lanterns, we witness stories passed down from generations—tales of craftsmanship,
            identity, and celebration rooted in Vietnam’s cultural fabric.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-10 text-left"
          >
            <div className="bg-white/10 p-6 rounded-xl shadow-md backdrop-blur-sm">
              <h4 className="text-yellow-300 font-semibold text-xl mb-2">Crafted with Soul</h4>
              <p className="text-yellow-100">
                Each lantern is a handcrafted marvel, blending bamboo frames, colorful silk, and age-old symbolism. They reflect not only skill but emotion and ancestral legacy.
              </p>
            </div>
            <div className="bg-white/10 p-6 rounded-xl shadow-md backdrop-blur-sm">
              <h4 className="text-yellow-300 font-semibold text-xl mb-2">Beyond Decoration</h4>
              <p className="text-yellow-100">
                Lanterns are not just ornaments—they're cultural beacons seen in every Mid-Autumn celebration, embodying light, unity, and the passage of time.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}