"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { Minus, Plus, Star, ShoppingCart, Heart, Share2, Loader2, ArrowLeft } from "lucide-react"
import StarLoader from "./starloader"
import Notification, { useNotification } from "./notification"

interface ProductDetailProps {
  productId: string
}

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  description: string
  features: string[]
  specifications: Record<string, string>
  symbolism: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isBuyingNow, setIsBuyingNow] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const { addToCart } = useCart()
  const { notification, showNotification, hideNotification } = useNotification()

  const mockProduct: Product = {
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

  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 1200))
        setProduct(mockProduct)
      } catch (error) {
        showNotification('Failed to load product details. Please try again.', 'error')
      } finally {
        setIsLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  const handleAddToCart = async () => {
    if (!product || isAddingToCart) return
    
    setIsAddingToCart(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
      })
      
      showNotification(
        `${quantity} ${product.name}${quantity > 1 ? 's' : ''} added to your cart!`, 
        'success'
      )
    } catch (error) {
      showNotification('Failed to add item to cart. Please try again.', 'error')
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleBuyNow = async () => {
    if (!product || isBuyingNow) return
    
    setIsBuyingNow(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        quantity,
      })
      
      showNotification('Redirecting to checkout...', 'success')
    } catch (error) {
      showNotification('Failed to process order. Please try again.', 'error')
    } finally {
      setIsBuyingNow(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <StarLoader />
          <p className="mt-6 text-gray-600 text-base sm:text-lg text-center">
            Loading product details...
          </p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏮</div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Product not found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button 
            onClick={() => window.history.back()}
            className="bg-red-700 hover:bg-red-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => window.history.back()}
        className="mb-6 text-gray-600 hover:text-gray-900 p-2"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Back to Products</span>
        <span className="sm:hidden">Back</span>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-100">
            <img
              src={product.images[selectedImageIndex] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover transition-all duration-300"
            />
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`
                  aspect-square rounded-lg overflow-hidden shadow-lg transition-all duration-300
                  ${selectedImageIndex === index 
                    ? 'ring-2 ring-red-500 shadow-xl scale-105' 
                    : 'hover:shadow-xl hover:scale-102'
                  }
                `}
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} view ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6 lg:space-y-8">
          {/* Product Header */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 font-serif leading-tight">
              {product.name}
            </h1>
            
            {/* Rating */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-gray-600 text-sm">(47 reviews)</span>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2 sm:ml-auto">
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600">
                  <Heart className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Save</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
                  <Share2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </div>
            
            <p className="text-2xl sm:text-3xl font-bold text-red-700 mb-6">
              ${product.price}
            </p>
            
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
            {/* Quantity Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <span className="text-lg font-medium text-gray-900">
                Quantity:
              </span>
              <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isAddingToCart || isBuyingNow}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 text-lg font-medium min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setQuantity(quantity + 1)} 
                  disabled={isAddingToCart || isBuyingNow}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Total Price */}
            <div className="flex justify-between items-center py-2 border-t border-gray-200">
              <span className="text-lg font-medium text-gray-900">
                Total:
              </span>
              <span className="text-2xl font-bold text-red-700">
                ${(product.price * quantity).toFixed(2)}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || isBuyingNow}
                size="lg"
                className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
              >
                {isAddingToCart ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Adding to Cart...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleBuyNow}
                disabled={isAddingToCart || isBuyingNow}
                size="lg"
                className="flex-1 bg-red-700 hover:bg-red-800 text-white py-3 sm:py-4 text-base sm:text-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:opacity-50"
              >
                {isBuyingNow ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Buy Now'
                )}
              </Button>
            </div>
          </div>

          {/* Product Features */}
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
              Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-serif">
              Specifications
            </h3>
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              {Object.entries(product.specifications).map(([key, value], index) => (
                <div 
                  key={key} 
                  className={`px-4 py-3 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <span className="font-medium text-gray-900 text-sm sm:text-base">
                    {key}:
                  </span>
                  <span className="text-gray-700 text-sm sm:text-base">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Cultural Symbolism */}
          <div className="bg-gradient-to-r from-stone-50 to-yellow-50 p-6 rounded-xl border border-stone-200">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 font-serif flex items-center gap-2">
              <span className="text-2xl">🏮</span>
              Cultural Symbolism
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
              {product.symbolism}
            </p>
          </div>
        </div>
      </div>

      {/* Notification */}
      <Notification
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  )
}