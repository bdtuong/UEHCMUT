"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import ProductCard from "./product-card"

export default function ProductGrid() {
  const categories = ['Traditional Lanterns', 'Festival Lanterns', 'Decorative Lanterns']
  const [currentCategory, setCurrentCategory] = useState(categories[0])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState('name-asc')

  const products = [
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

  let filteredProducts = products.filter(product => 
    product.category === currentCategory &&
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
    <div>
      <div className="mb-8 flex flex-col space-y-4">
        <div className="flex justify-center space-x-4">
          {categories.map(category => (
            <Button
              key={category}
              onClick={() => setCurrentCategory(category)}
              className={currentCategory === category ? 'bg-red-700 text-white' : 'bg-gray-200 text-black'}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="flex justify-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded w-full max-w-xs"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}