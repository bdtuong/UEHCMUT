"use client"

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X } from 'lucide-react'

export interface NotificationProps {
  message: string
  type: 'success' | 'error'
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export default function Notification({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 3000 
}: NotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(onClose, 300)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible && !isAnimating) return null

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800'
  const iconColor = type === 'success' ? 'text-green-600' : 'text-red-600'
  const Icon = type === 'success' ? CheckCircle : XCircle

  return (
    <div className="fixed top-4 right-4 z-50 w-full max-w-sm px-4 sm:px-0">
      <div
        className={`
          ${bgColor} ${textColor} border rounded-lg shadow-lg p-4
          transform transition-all duration-300 ease-in-out
          ${isAnimating ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        `}
      >
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 ${iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium break-words leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={() => {
              setIsAnimating(false)
              setTimeout(onClose, 300)
            }}
            className={`${iconColor} hover:opacity-70 transition-opacity flex-shrink-0 ml-2`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function useNotification() {
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
    isVisible: boolean
  }>({
    message: '',
    type: 'success',
    isVisible: false
  })

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({
      message,
      type,
      isVisible: true
    })
  }

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }))
  }

  return {
    notification,
    showNotification,
    hideNotification
  }
}