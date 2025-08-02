"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus, Star, ShoppingCart, Heart, Share2, Loader2, ArrowLeft } from "lucide-react"

interface ProductDetailProps {
  productId?: string
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

// Mock hooks
const useCart = () => ({
  addToCart: (item: any) => console.log('Added to cart:', item)
})

const useNotification = () => ({
  notification: { message: '', type: 'success', isVisible: false },
  showNotification: (message: string, type: string) => console.log(`${type}: ${message}`),
  hideNotification: () => {}
})

const StarLoader = () => (
  <div className="flex justify-center items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
  </div>
)

const Notification = ({ message, type, isVisible, onClose }: any) => null

export default function ProductDetail({ productId = "1" }: ProductDetailProps) {
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
    name: "Traditional Vietnamese Mid-Autumn Paper Lantern",
    price: 15000,
    images: [
      "/paper-lantern.jpg",
      "/paper-lantern-1.png",
      "/paper-lantern-2.png",
    ],
    description:
      "This exquisite traditional Vietnamese Mid-Autumn paper lantern is meticulously handcrafted, embodying the rich cultural heritage of Vietnam's Moon Festival. Made from premium cellophane paper with a sturdy natural bamboo frame, it creates a meaningful gift for children and families during this special celebration.",
    features: [
      "100% handcrafted by traditional Vietnamese artisans",
      "Premium cellophane paper with vibrant, fade-resistant colors",
      "Natural bamboo frame carefully treated for durability",
      "Decorated with traditional Vietnamese patterns",
      "Child-safe materials, non-toxic construction",
      "Includes safe LED candle to replace real flames",
    ],
    specifications: {
      "Diameter": "25 cm (10 inches)",
      "Height": "30 cm (12 inches)", 
      "Material": "Cellophane paper, natural bamboo frame",
      "Weight": "200g (7 oz)",
      "Origin": "Vietnam",
      "Age Range": "3+ years"
    },
    symbolism:
      "In Vietnamese culture, Mid-Autumn lanterns symbolize family reunion, happiness, and childhood joy. The lantern's light represents wisdom, dispelling darkness and bringing good fortune to families in the coming year.",
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
      <div className="min-h-screen bg-black text-white">
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <StarLoader />
            <p className="mt-6 text-gray-300 text-base sm:text-lg text-center">
              Loading product details...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🏮</div>
            <h2 className="text-2xl font-semibold text-white mb-4">
              Product not found
            </h2>
            <p className="text-gray-300 mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button 
              onClick={() => window.history.back()}
              className="bg-red-700 hover:bg-red-800 text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => window.history.back()}
          className="mb-6 text-gray-300 hover:text-white hover:bg-gray-800 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Back to Products</span>
          <span className="sm:hidden">Back</span>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl bg-gray-900 border border-gray-700">
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
                    aspect-square rounded-lg overflow-hidden shadow-lg transition-all duration-300 border
                    ${selectedImageIndex === index 
                      ? 'ring-2 ring-red-500 shadow-xl scale-105 border-red-500' 
                      : 'hover:shadow-xl hover:scale-102 border-gray-700 hover:border-gray-500'
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
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 font-serif leading-tight">
                {product.name}
              </h1>
              
              {/* Rating */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-gray-300 text-sm">(47 reviews)</span>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-2 sm:ml-auto">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 hover:bg-gray-800">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Save</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 hover:bg-gray-800">
                    <Share2 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                </div>
              </div>
              
              <p className="text-2xl sm:text-3xl font-bold text-red-400 mb-6">
                ₫{product.price.toLocaleString()}
              </p>
              
              <p className="text-base sm:text-lg text-gray-300 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-6 p-6 bg-gray-900 rounded-xl border border-gray-700">
              {/* Quantity Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="text-lg font-medium text-white">
                  Quantity:
                </span>
                <div className="flex items-center border border-gray-600 rounded-lg bg-gray-800">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isAddingToCart || isBuyingNow}
                    className="px-3 py-2 hover:bg-gray-700 text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 text-lg font-medium min-w-[3rem] text-center text-white">
                    {quantity}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setQuantity(quantity + 1)} 
                    disabled={isAddingToCart || isBuyingNow}
                    className="px-3 py-2 hover:bg-gray-700 text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              <div className="flex justify-between items-center py-2 border-t border-gray-700">
                <span className="text-lg font-medium text-white">
                  Total:
                </span>
                <span className="text-2xl font-bold text-red-400">
                  ₫{(product.price * quantity).toLocaleString()}
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
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-900 rounded-lg border border-gray-700">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-300 text-sm sm:text-base leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white font-serif">
                Specifications
              </h3>
              <div className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <div 
                    key={key} 
                    className={`px-4 py-3 flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-4 ${
                      index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'
                    }`}
                  >
                    <span className="font-medium text-white text-sm sm:text-base">
                      {key}:
                    </span>
                    <span className="text-gray-300 text-sm sm:text-base">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cultural Symbolism */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 font-serif flex items-center gap-2">
                <span className="text-2xl">🏮</span>
                Cultural Symbolism
              </h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
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
    </div>
  )
}