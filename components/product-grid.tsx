"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import ProductCard from "./product-card"
import StarLoader from "./starloader"
import Notification, { useNotification } from "./notification"

export default function ProductGrid() {
  const categories = ['Traditional Lanterns', 'Festival Lanterns', 'Decorative Lanterns']
  const [currentCategory, setCurrentCategory] = useState(categories[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('name-asc')
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const { notification, showNotification, hideNotification } = useNotification()

  interface Product {
    id: string
    name: string
    price: number
    image: string
    description: string
    category: string
  }

  const allProducts = [
    { id: "1", name: "Classic Round Lantern", price: 45, image: "/placeholder.svg?height=400&width=400", description: "Traditional round silk lantern in vibrant red", category: "Traditional Lanterns" },
    { id: "2", name: "Hexagonal Festival Lantern", price: 65, image: "/placeholder.svg?height=400&width=400", description: "Elegant hexagonal design perfect for celebrations", category: "Festival Lanterns" },
    { id: "3", name: "Bamboo Cylinder Lantern", price: 55, image: "/placeholder.svg?height=400&width=400", description: "Natural bamboo construction with warm glow", category: "Traditional Lanterns" },
    { id: "4", name: "Lotus Petal Lantern", price: 75, image: "/placeholder.svg?height=400&width=400", description: "Delicate lotus-inspired design in soft pink", category: "Decorative Lanterns" },
    { id: "5", name: "Dragon Scale Lantern", price: 85, image: "/placeholder.svg?height=400&width=400", description: "Ornate dragon scale pattern in emerald and gold", category: "Festival Lanterns" },
    { id: "6", name: "Mini Boat Lantern Set", price: 120, image: "/placeholder.svg?height=400&width=400", description: "Set of 3 miniature boat-shaped lanterns", category: "Decorative Lanterns" },
    { id: "7", name: "Palace Lantern", price: 150, image: "/placeholder.svg?height=400&width=400", description: "Grand palace-style lantern with imperial motifs", category: "Traditional Lanterns" },
    { id: "8", name: "Star Festival Lantern", price: 60, image: "/placeholder.svg?height=400&width=400", description: "Star-shaped design with celestial patterns", category: "Festival Lanterns" },
    { id: "9", name: "Butterfly Garden Lantern", price: 70, image: "/placeholder.svg?height=400&width=400", description: "Beautiful butterfly motifs in vibrant colors", category: "Decorative Lanterns" },
  ]

  const loadProducts = async (category: string) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      const categoryProducts = allProducts.filter(product => product.category === category)
      setProducts(categoryProducts)
      showNotification(`Loaded ${categoryProducts.length} products successfully!`, 'success')
    } catch (error) {
      showNotification('Failed to load products. Please try again.', 'error')
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadProducts(currentCategory)
  }, [currentCategory])

  const handleCategoryChange = (category: string) => {
    setCurrentCategory(category)
    setSearchTerm('')
  }

  let filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (sortOption === 'name-asc') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortOption === 'name-desc') {
    filteredProducts.sort((a, b) => b.name.localeCompare(a.name))
  } else if (sortOption === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortOption === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price)
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* Category and Search Controls */}
      <div className="mb-8 space-y-6">
        {/* Category Buttons */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => handleCategoryChange(category)}
              disabled={isLoading}
              className={`
                px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base
                transition-all duration-200
                ${currentCategory === category 
                  ? 'bg-red-700 hover:bg-red-800 text-white shadow-lg' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Search and Sort Controls */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-2xl mx-auto">
          <div className="flex-1 min-w-0">
            <input
              type="text"
              placeholder="Search lanterns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
              className="
                w-full p-3 border border-gray-300 rounded-lg
                focus:ring-2 focus:ring-red-500 focus:border-red-500
                disabled:opacity-50 disabled:cursor-not-allowed
                text-sm sm:text-base
              "
            />
          </div>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            disabled={isLoading}
            className="
              p-3 border border-gray-300 rounded-lg min-w-0 sm:min-w-[200px]
              focus:ring-2 focus:ring-red-500 focus:border-red-500
              disabled:opacity-50 disabled:cursor-not-allowed
              text-sm sm:text-base
            "
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-16">
          <div className="text-center">
            <StarLoader />
            <p className="mt-4 text-gray-600 text-lg">Loading amazing lanterns...</p>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && (
        <>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🏮</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No lanterns found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? `No results for "${searchTerm}" in ${currentCategory}`
                  : `No products available in ${currentCategory}`
                }
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  className="bg-red-700 hover:bg-red-800"
                >
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6 text-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  Showing {filteredProducts.length} lantern{filteredProducts.length !== 1 ? 's' : ''} 
                  {searchTerm && ` for "${searchTerm}"`} in {currentCategory}
                </p>
              </div>

              {/* Product Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product}
                    onNotification={showNotification}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

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