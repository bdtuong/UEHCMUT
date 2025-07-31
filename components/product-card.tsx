"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { ShoppingCart, Loader2 } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image: string
  description: string
}

interface ProductCardProps {
  product: Product
  onNotification?: (message: string, type: 'success' | 'error') => void
}

export default function ProductCard({ product, onNotification }: ProductCardProps) {
  const { addToCart } = useCart()
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  const handleAddToCart = async () => {
    if (isAddingToCart) return

    setIsAddingToCart(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))

      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
      })

      onNotification?.(`${product.name} has been added to your cart!`, 'success')
    } catch (error) {
      onNotification?.('Failed to add item to cart. Please try again.', 'error')
    } finally {
      setIsAddingToCart(false)
    }
  }

  return (
    <div className="group bg-neutral-900 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden max-w-sm mx-auto border border-neutral-800">
      <Link href={`/products/${product.id}`}>
        <div className="relative overflow-hidden aspect-square">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />

          {/* Mobile overlay */}
          <div className="sm:hidden absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h3 className="text-white font-semibold text-sm line-clamp-1">
              {product.name}
            </h3>
            <p className="text-yellow-400 text-xs mt-1">${product.price}</p>
          </div>
        </div>
      </Link>

      <div className="p-4 sm:p-6">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors duration-200 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-400 mb-4 text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
          {product.description}
        </p>

        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <span className="text-lg sm:text-xl lg:text-2xl font-bold text-red-500 flex-shrink-0">
            ${product.price}
          </span>

          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="
              bg-yellow-500 hover:bg-yellow-400 text-black 
              transition-all duration-300 transform hover:scale-105
              disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
              text-xs sm:text-sm lg:text-base px-2 py-1.5 sm:px-3 sm:py-2 lg:px-4 lg:py-2
              flex items-center gap-1 sm:gap-2 min-w-0 flex-shrink-0
            "
          >
            {isAddingToCart ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                <span className="hidden sm:inline">Adding...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Add to Cart</span>
                <span className="sm:hidden">Add</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
