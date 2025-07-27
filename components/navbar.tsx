'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/use-cart'
import { Menu, ShoppingCart, X } from 'lucide-react'
import clsx from 'clsx'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items } = useCart()
  const itemCount = items.length

  const [showNav, setShowNav] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setShowNav(currentY < lastScrollY.current || currentY < 10)
      lastScrollY.current = currentY
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      className={clsx(
        'fixed top-0 left-0 w-full z-50 transition-transform duration-500',
        showNav ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="bg-black/90 backdrop-blur-md shadow-md">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-8">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-white/20">
                <img
                  src="/logo.png"
                  alt="LanternVerse Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-xl font-semibold text-white tracking-wide font-serif">
                LanternVerse
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['Home', 'Products', 'About', 'Contact'].map((label) => (
                <Link
                  key={label}
                  href={`/${label.toLowerCase() === 'home' ? '' : label.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors duration-200"
                >
                  {label}
                </Link>
              ))}
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative text-white hover:text-black">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-700 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
              <Link href="/cart" className="relative">
                <Button variant="ghost" size="sm" className="relative text-white hover:text-yellow-400">
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)} className="text-white">
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-gray-700">
              <div className="flex flex-col space-y-4">
                {['Home', 'Products', 'About', 'Contact'].map((label) => (
                  <Link
                    key={label}
                    href={`/${label.toLowerCase() === 'home' ? '' : label.toLowerCase()}`}
                    className="text-gray-300 hover:text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}