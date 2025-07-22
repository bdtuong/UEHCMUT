"use client"

import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { Minus, Plus, Trash2 } from "lucide-react"

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8">Add some beautiful lanterns to get started</p>
        <Button className="bg-red-700 hover:bg-red-800">Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex gap-4">
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-xl font-bold text-red-700 mb-4">${item.price}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-4 py-2 font-medium">{item.quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md h-fit">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span>$15.00</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${(total + 15).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <Button className="w-full bg-red-700 hover:bg-red-800 text-white py-3 text-lg">Proceed to Checkout</Button>
      </div>
    </div>
  )
}
