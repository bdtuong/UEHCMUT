import Cart from "@/components/cart"

export default function CartPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 font-serif">Shopping Cart</h1>
        <Cart />
      </div>
    </main>
  )
}
