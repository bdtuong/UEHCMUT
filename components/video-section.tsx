"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import VideoModal from "./video-modal"

export default function VideoSection() {
  const [showVideo, setShowVideo] = useState(false)

  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 80}%`,
    top: `${Math.random() * 40 + 80}%`,
    duration: `${4 + Math.random() * 3}s`,
    delay: `${Math.random() * 2}s`,
  }))

  return (
    <>
      {/* 🔸 Separator above */}
      <div className="flex items-center justify-center gap-4 bg-black py-4">
        <div className="h-0.5 flex-grow bg-gradient-to-r from-yellow-400/0 via-yellow-400/40 to-yellow-400/0" />
        <span className="text-yellow-400 text-xl animate-pulse">⭐</span>
        <div className="h-0.5 flex-grow bg-gradient-to-r from-yellow-400/0 via-yellow-400/40 to-yellow-400/0" />
      </div>

      {/* 🔸 Main section */}
      <section className="relative py-20 bg-black text-white overflow-hidden z-0">
        {/* Flying particles */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full"
              style={{
                left: p.left,
                top: p.top,
                animation: `float-diagonal ${p.duration} ease-out ${p.delay} infinite`,
                opacity: 0.9,
                filter: "blur(1px)",
              }}
            />
          ))}

          <style>
            {`
              @keyframes float-diagonal {
                0% {
                  transform: translate(0, 0) scale(1);
                  opacity: 0.9;
                }
                100% {
                  transform: translate(300px, -300px) scale(0.5);
                  opacity: 0;
                }
              }
            `}
          </style>
        </div>

        {/* Content Layer */}
        <div className="relative z-20 container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-yellow-400">
              Lanterns of Vietnam
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Step into the magic of Vietnam’s Mid-Autumn Festival, where lanterns light up the streets and
              childhood memories shine. Discover how tradition meets artistry in every handmade design.
            </p>
          </div>

          {/* Video preview */}
          <div className="max-w-2xl mx-auto">
            <div
              className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              onClick={() => setShowVideo(true)}
            >
              <img
                src="/placeholder.svg?height=720&width=1280"
                alt="Vietnamese lantern market"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 text-black rounded-full p-6 transition-all duration-300 transform group-hover:bg-yellow-500 group-hover:text-white group-hover:scale-110">
                  <Play className="h-12 w-12 ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video modal */}
      <div className="z-50 relative">
        <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />
      </div>
    </>
  )
}
