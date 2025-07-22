"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
}

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    })
  }

  return (
    <div className="group bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden">
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-80 object-cover group-hover:brightness-110 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-red-700 transition-colors duration-200">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed">{product.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-red-700">${product.price}</span>
          <Button
            onClick={handleAddToCart}
            className="bg-yellow-600 hover:bg-yellow-700 text-white transition-all duration-300 transform hover:scale-105"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
