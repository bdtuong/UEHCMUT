"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import VideoModal from "./video-modal"

export default function VideoSection() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <>
      <section className="py-20 bg-stone-100">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">The Art of Creation</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch master artisans breathe life into silk and bamboo, creating lanterns that have illuminated
              Vietnamese culture for centuries
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div
              className="relative aspect-video rounded-2xl shadow-2xl overflow-hidden cursor-pointer group transition-all duration-500 hover:shadow-3xl transform hover:scale-[1.02]"
              onClick={() => setShowVideo(true)}
            >
              <img
                src="/placeholder.svg?height=720&width=1280"
                alt="Artisan making lanterns"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 rounded-full p-6 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
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
