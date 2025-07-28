"use client"

import { useEffect, useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import StarLoader from "@/components/starloader" // <- Nhớ tạo component này

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
      setLoading(true) // reset loader mỗi lần mở
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div className="relative w-full max-w-xl lg:max-w-3xl mx-4 z-50">
        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
        >
          <X className="h-6 w-6" />
        </Button>

        {/* Video with Loader */}
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black">
          {loading && (
            <div className="absolute inset-0 bg-black flex items-center justify-center z-10 transition-opacity duration-500">
              <StarLoader />
            </div>
          )}

          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Hoi An Lantern Making Documentary"
            className="w-full h-full relative z-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setLoading(false)}
          />
        </div>
      </div>
    </div>
  )
}
