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
      name: "Silk Moon Lantern",
      price: 42,
      image: "/placeholder.svg?height=400&width=400",
      description:
        "A graceful round lantern crafted with premium silk, radiating warm tradition.",
    },
    {
      id: "2",
      name: "Heritage Hex Lantern",
      price: 58,
      image: "/placeholder.svg?height=400&width=400",
      description:
        "Hexagonal bamboo frame with hand-painted patterns, perfect for gifting.",
    },
    {
      id: "3",
      name: "Artisan Cylinder Glow",
      price: 49,
      image: "/placeholder.svg?height=400&width=400",
      description:
        "Cylinder-shaped lantern blending craftsmanship and modern elegance.",
    },
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

      <section className="relative py-20 bg-neutral-950 text-white overflow-hidden border-t border-neutral-800">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4 font-serif">
              Order Your Custom-Designed Lantern
            </h2>
            <p className="text-lg text-white/70 max-w-2xl mx-auto">
              Upload your custom design and leave a message for our amazing artisans!
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-center mb-12">
            <div className="w-[300px] h-[300px] bg-white/5 border border-yellow-500/20 rounded-2xl backdrop-blur-sm flex items-center justify-center">
              {customImage ? (
                <img src={customImage} alt="Uploaded Design" className="object-contain w-full h-full rounded-xl" />
              ) : (
                <span className="text-yellow-500 text-6xl">🏮</span>
              )}
            </div>

            <div className="max-w-md space-y-4 w-full">
              <label className="block cursor-pointer">
                <span className="text-sm text-white/70">Upload your design (JPG, PNG):</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-1 block w-full text-sm text-white bg-white/10 border border-yellow-500/20 rounded-md p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-400 cursor-pointer"
                  title="Upload"
                />
              </label>

              <label className="block">
                <span className="text-sm text-white/70">Message to the artisan (optional):</span>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  rows={4}
                  className="mt-1 w-full p-3 rounded-md bg-white/10 border border-yellow-500/20 text-white placeholder:text-white/50 text-sm"
                  placeholder="Share your idea, meaning, or inspiration behind this design..."
                />
              </label>

              <Button
                onClick={() =>
                  addToCart({
                    id: "custom-lantern",
                    name: "Custom Designed Lantern",
                    price: 70,
                    image: customImage || "/lantern-custom.png",
                    quantity: 1,
                    note: customDescription,
                  })
                }
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold text-base transition-transform duration-300 hover:scale-105"
              >
                Add to Cart – $70
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
