import ProductGrid from "@/components/product-grid"

export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-stone-50 pt-[4rem]">
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">Authentic Hoi An Lanterns</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Handcrafted by skilled artisans, each lantern carries the soul of Vietnamese heritage
          </p>
        </div>
        <ProductGrid />
      </div>
    </main>
  )
}