"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { Minus, Plus, Star } from "lucide-react"

interface ProductDetailProps {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  // Mock product data - in real app, fetch by ID
  const product = {
    id: productId,
    name: "Classic Round Lantern",
    price: 45,
    images: [
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600",
    ],
    description:
      "This exquisite round lantern represents the pinnacle of Vietnamese craftsmanship. Hand-made by skilled artisans in Hoi An, each piece features premium silk fabric stretched over a carefully constructed bamboo frame.",
    features: [
      "Handcrafted by master artisans in Hoi An",
      "Premium silk fabric with vibrant, fade-resistant colors",
      "Sustainable bamboo frame construction",
      "Traditional golden tassels and decorative elements",
      "Weather-resistant for both indoor and outdoor use",
      "Includes LED light kit for safe illumination",
    ],
    specifications: {
      Diameter: "12 inches (30 cm)",
      Height: "16 inches (40 cm)",
      Material: "Silk fabric, bamboo frame",
      Weight: "0.8 lbs (360g)",
      Origin: "Hoi An, Vietnam",
    },
    symbolism:
      "In Vietnamese culture, red lanterns symbolize good fortune, prosperity, and joy. They are traditionally used during festivals and celebrations to bring positive energy and ward off evil spirits.",
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    })
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(1).map((image, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 2}`}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 font-serif">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-gray-600 ml-2">(47 reviews)</span>
            </div>
            <p className="text-3xl font-bold text-red-700 mb-6">${product.price}</p>
            <p className="text-lg text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-lg font-medium">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 text-lg font-medium">{quantity}</span>
                <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)} className="px-3">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                size="lg"
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-4 text-lg transition-all duration-300 transform hover:scale-105"
              >
                Add to Cart
              </Button>
              <Button
                size="lg"
                className="flex-1 bg-red-700 hover:bg-red-800 text-white py-4 text-lg transition-all duration-300 transform hover:scale-105"
              >
                Buy Now
              </Button>
            </div>
          </div>

          {/* Product Features */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 font-serif">Features</h3>
            <ul className="space-y-3">
              {product.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Specifications */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900 font-serif">Specifications</h3>
            <div className="divide-y divide-gray-200">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="py-3 flex justify-between">
                  <span className="font-medium text-gray-900">{key}:</span>
                  <span className="text-gray-700">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Symbolism */}
          <div className="bg-stone-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-3 font-serif">Cultural Symbolism</h3>
            <p className="text-gray-700 leading-relaxed">{product.symbolism}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
