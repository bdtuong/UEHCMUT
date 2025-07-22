import Link from "next/link"
import { Button } from "@/components/ui/button"
import ProductCard from "./product-card"

export default function FeaturedProducts() {
  const featuredProducts = [
    {
      id: "1",
      name: "Classic Round Lantern",
      price: 45,
      image: "/placeholder.svg?height=400&width=400",
      description: "Traditional round silk lantern in vibrant red",
    },
    {
      id: "2",
      name: "Hexagonal Festival Lantern",
      price: 65,
      image: "/placeholder.svg?height=400&width=400",
      description: "Elegant hexagonal design perfect for celebrations",
    },
    {
      id: "3",
      name: "Bamboo Cylinder Lantern",
      price: 55,
      image: "/placeholder.svg?height=400&width=400",
      description: "Natural bamboo construction with warm glow",
    },
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">Featured Collection</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Bring the magic of Hoi An into your home with our carefully curated selection of authentic lanterns
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
              className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105"
            >
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
