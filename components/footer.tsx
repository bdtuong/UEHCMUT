import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-neutral-950 text-white/90 border-t border-white/10">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
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
            </div>
            <p className="text-white/60 leading-relaxed text-sm">
              Bringing the timeless beauty of Vietnamese heritage to your home through authentic, handcrafted lanterns.
            </p>
            <div className="flex space-x-4 pt-2">
              <Facebook className="h-5 w-5 text-yellow-500 hover:text-yellow-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-yellow-500 hover:text-yellow-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-yellow-500 hover:text-yellow-400 cursor-pointer transition-colors" />
              <Youtube className="h-5 w-5 text-yellow-500 hover:text-yellow-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/" className="block text-white/60 hover:text-yellow-400 transition-colors">Home</Link>
              <Link href="/products" className="block text-white/60 hover:text-yellow-400 transition-colors">Products</Link>
              <Link href="/about" className="block text-white/60 hover:text-yellow-400 transition-colors">About Us</Link>
              <Link href="/contact" className="block text-white/60 hover:text-yellow-400 transition-colors">Contact</Link>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Customer Service</h3>
            <div className="space-y-2 text-sm">
              <Link href="/shipping" className="block text-white/60 hover:text-yellow-400 transition-colors">Shipping Info</Link>
              <Link href="/returns" className="block text-white/60 hover:text-yellow-400 transition-colors">Returns</Link>
              <Link href="/faq" className="block text-white/60 hover:text-yellow-400 transition-colors">FAQ</Link>
              <Link href="/support" className="block text-white/60 hover:text-yellow-400 transition-colors">Support</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-2 text-sm text-white/60">
              <p>Uehcmut</p>
              <p>HCM City, Vietnam</p>
              <p>Phone: +84 235 123 4567</p>
              <p>Email: uehcmut@123.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-white/50">
          <p>
            &copy; 2024 UEHCMUT LanternVerse. All rights reserved. Preserving Vietnamese heritage through authentic craftsmanship.
          </p>
        </div>
      </div>
    </footer>
  )
}
