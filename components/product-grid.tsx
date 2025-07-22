import ProductCard from "./product-card"

export default function ProductGrid() {
  const products = [
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
    {
      id: "4",
      name: "Lotus Petal Lantern",
      price: 75,
      image: "/placeholder.svg?height=400&width=400",
      description: "Delicate lotus-inspired design in soft pink",
    },
    {
      id: "5",
      name: "Dragon Scale Lantern",
      price: 85,
      image: "/placeholder.svg?height=400&width=400",
      description: "Ornate dragon scale pattern in emerald and gold",
    },
    {
      id: "6",
      name: "Mini Boat Lantern Set",
      price: 120,
      image: "/placeholder.svg?height=400&width=400",
      description: "Set of 3 miniature boat-shaped lanterns",
    },
    {
      id: "7",
      name: "Palace Lantern",
      price: 150,
      image: "/placeholder.svg?height=400&width=400",
      description: "Grand palace-style lantern with imperial motifs",
    },
    {
      id: "8",
      name: "Star Festival Lantern",
      price: 60,
      image: "/placeholder.svg?height=400&width=400",
      description: "Star-shaped design with celestial patterns",
    },
    {
      id: "9",
      name: "Butterfly Garden Lantern",
      price: 70,
      image: "/placeholder.svg?height=400&width=400",
      description: "Beautiful butterfly motifs in vibrant colors",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
