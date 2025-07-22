"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import VideoModal from "./video-modal"

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <>
      <section
        className="relative bg-cover bg-center text-white py-28 px-6 text-center transition-all ease-in-out duration-500 min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/placeholder.svg?height=1080&width=1920')`,
        }}
      >
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif leading-tight">UEHCMUT</h1>
          <h2 className="text-2xl md:text-3xl mb-4 text-yellow-200 font-light">Hoi An Lanterns</h2>
          <p className="text-xl md:text-2xl mb-12 text-gray-200 max-w-2xl mx-auto leading-relaxed">
            Discover the timeless beauty of Vietnam through every light
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
            >
              Explore More
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setShowVideo(true)}
              className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Video
            </Button>
          </div>
        </div>
      </section>
      <VideoModal isOpen={showVideo} onClose={() => setShowVideo(false)} />
    </>
  )
}
