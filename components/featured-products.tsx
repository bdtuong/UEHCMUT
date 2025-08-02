'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "./product-card"
import { useCart } from "@/hooks/use-cart"
import { useState } from "react"

export default function FeaturedProducts() {
  const { addToCart } = useCart()
  const [customDescription, setCustomDescription] = useState("")
  const [customImage, setCustomImage] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setCustomImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const featuredProducts = [
    {
  id: "1",
  name: "Red Moon Rabbit Lantern",
  price: 15.000,
  image: "/rabbit.jpg",
  description:
    "A traditional handcrafted lantern in the shape of a rabbit, symbolizing innocence and the Mid-Autumn spirit. Made with colored cellophane and bamboo, this timeless piece brings back childhood memories under the harvest moon.",
},

    {
  id: "2",
  name: "Colorful Carp Lantern",
  price: 10.000,
  image: "/carp.jpg",
  description:
    "Inspired by the legendary carp that leaps over the Dragon Gate, this vibrant lantern embodies courage, growth, and celebration. Crafted with cheerful hues and traditional patterns, it brings a joyful splash of Mid-Autumn spirit to children and collectors alike.",
}
,
    {
  id: "3",
  name: "Traditional Star Lantern",
  price: 15.000,
  image: "/star.jpg",
  description:
    "A five-pointed star lantern handcrafted with vibrant cellophane and bamboo, glowing with childhood nostalgia. Symbolizing harmony and reunion, this iconic lantern lights up Mid-Autumn nights across Vietnam with joy and tradition.",
}

  ]

  return (
    <>
      <section className="relative py-20 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-30 blur-sm animate-float-glow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            />
          ))}
        </div>
        <div className="absolute -top-60 left-1/2 transform -translate-x-1/2 w-[1000px] h-[1000px] bg-yellow-500 opacity-10 rounded-full blur-3xl z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4 font-serif">
              Lantern Souvenir Shop
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto mb-8">
              Discover timeless Vietnamese lanterns — perfect as cultural gifts or cherished home decor.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 font-semibold"
              >
                Browse All Lanterns
              </Button>
            </Link>
          </div>
        </div>
        <style jsx>{`
          @keyframes floatGlow {
            0% {
              transform: translateY(0px) scale(1);
              opacity: 0.3;
            }
            50% {
              transform: translateY(-20px) scale(1.4);
              opacity: 0.6;
            }
            100% {
              transform: translateY(0px) scale(1);
              opacity: 0.3;
            }
          }
          .animate-float-glow {
            animation: floatGlow 5s ease-in-out infinite;
          }
        `}</style>
      </section>

      
    </>
  )
}
