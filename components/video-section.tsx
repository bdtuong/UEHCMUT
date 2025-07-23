"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import VideoModal from "./video-modal"

export default function VideoSection() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <>
      <section className="py-20 bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a] text-white">
        <div className="container mx-auto px-6">
          {/* Title + Desc */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold font-serif mb-4 text-white">
              The Art of Creation
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Watch master artisans breathe life into silk and bamboo, creating lanterns that have illuminated
              Vietnamese culture for centuries.
            </p>
          </div>

          {/* Video preview */}
          <div className="max-w-4xl mx-auto">
            <div
              className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              onClick={() => setShowVideo(true)}
            >
              <img
                src="/placeholder.svg?height=720&width=1280"
                alt="Artisan making lanterns"
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

      <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />
    </>
  )
}
