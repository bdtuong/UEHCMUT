"use client"

import { useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VideoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
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
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-4xl mx-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 z-10"
        >
          <X className="h-6 w-6" />
        </Button>
        <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
          <iframe
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Hoi An Lantern Making Documentary"
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  )
}
