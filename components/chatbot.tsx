'use client'

import { useState, useRef, useEffect } from 'react'
import { findBestAnswer } from '@/utils/matchAnswer'

const ChatbotFloating = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<
    { sender: 'user' | 'bot'; text: string }[]
  >([])

  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen && messages.length === 0) {
      setMessages([
        {
          sender: 'bot',
          text: "Welcome to the magical world of Saigon's traditional lantern craft ✨. I'm B-Cat 🐾 — your guide through stories, colors, and glowing lights!",
        },
      ])
    }
  }

  const handleSend = () => {
    if (!input.trim()) return
    const userMessage = input.trim()
    const botAnswer =
      findBestAnswer(userMessage) || "Hmm... I don't have an answer for that yet 🐱"
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMessage },
      { sender: 'bot', text: botAnswer },
    ])
    setInput('')
  }

  // 🔽 Auto-scroll to bottom when messages update
  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {isOpen && (
        <div className="w-80 h-[460px] bg-white rounded-xl border border-gray-300 shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-gray-300 overflow-hidden">
                <img
                  src="/avatar.png"
                  alt="B-Cat"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-semibold text-gray-800 text-sm">B-CAT</span>
            </div>
            <button
              onClick={toggleChat}
              className="text-gray-500 text-sm hover:text-gray-700"
            >
              ✖
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-end ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'bot' && (
                  <img
                    src="/avatar.png"
                    alt="B-Cat"
                    className="w-7 h-7 rounded-full mr-2"
                  />
                )}

                <div
                  className={`px-3 py-2 rounded-xl text-sm max-w-[70%] ${
                    msg.sender === 'user'
                      ? 'bg-gray-800 text-white rounded-br-none'
                      : 'bg-gray-200 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {/* 👇 This ref ensures auto-scroll works */}
            <div ref={endOfMessagesRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t bg-white flex gap-2">
            <input
              type="text"
              className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Ask me something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-black"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating avatar button */}
      {!isOpen && (
        <button
          onClick={toggleChat}
          className="w-16 h-16 rounded-full bg-white shadow-xl border border-gray-300 overflow-hidden animate-bounce"
          aria-label="Open chatbot"
        >
          <img
            src="/avatar.png"
            alt="B-Cat Avatar"
            className="w-full h-full object-cover"
          />
        </button>
      )}
    </div>
  )
}

export default ChatbotFloating
