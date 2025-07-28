'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import VideoModal from './video-modal'

export default function Hero() {
  const [showVideo, setShowVideo] = useState(false)

  return (
    <>
      <section
        className="relative bg-cover bg-center text-white min-h-screen flex items-center justify-start px-10 md:px-20 py-28"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 1) 0%, rgba(0,0,0,1) 10%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0) 95%), url('/images/hero-1.png')`,

        }}
      >
        <div className="max-w-3xl text-left ">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 font-serif leading-tight">
            LanternVerse
          </h1>
          <h2 className="text-2xl md:text-3xl mb-4 text-red-500 font-light">
            UEHCMUT
          </h2>
          <p className="text-xl md:text-2xl mb-10 text-gray-200 leading-relaxed">
            Discover the timeless beauty of Vietnam through every glowing light ✨
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-start">
            <Button
              size="lg"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
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
