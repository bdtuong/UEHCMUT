"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react"
import Notification, { useNotification } from "./notification"

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart()
  const [loadingItems, setLoadingItems] = useState<{ [key: string]: boolean }>({})
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const { notification, showNotification, hideNotification } = useNotification()

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (loadingItems[id]) return
    
    setLoadingItems(prev => ({ ...prev, [id]: true }))
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      updateQuantity(id, newQuantity)
      showNotification('Quantity updated successfully!', 'success')
    } catch (error) {
      showNotification('Failed to update quantity. Please try again.', 'error')
    } finally {
      setLoadingItems(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleRemoveFromCart = async (id: string, itemName: string) => {
    if (loadingItems[id]) return
    
    setLoadingItems(prev => ({ ...prev, [id]: true }))
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      removeFromCart(id)
      showNotification(`${itemName} has been removed from your cart`, 'success')
    } catch (error) {
      showNotification('Failed to remove item. Please try again.', 'error')
    } finally {
      setLoadingItems(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      showNotification('Order placed successfully! Thank you for your purchase.', 'success')
    } catch (error) {
      showNotification('Checkout failed. Please try again.', 'error')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed">
              Add some beautiful Vietnamese lanterns to get started on your journey of illumination
            </p>
          </div>
          <Button 
            className="bg-red-700 hover:bg-red-800 text-white px-8 py-3 text-base sm:text-lg"
            onClick={() => window.history.back()}
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
          Shopping Cart
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          {items.length} item{items.length !== 1 ? 's' : ''} in your cart
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Cart Items */}
        <div className="xl:col-span-2 space-y-4 sm:space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Product Image */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    className="w-32 h-32 sm:w-24 sm:h-24 lg:w-32 lg:h-32 object-cover rounded-lg"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xl sm:text-2xl font-bold text-red-700 mb-4">
                      ${item.price}
                    </p>
                  </div>

                  {/* Quantity and Remove Controls */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        disabled={loadingItems[item.id] || item.quantity <= 1}
                        className="px-3 py-2 hover:bg-gray-200 disabled:opacity-50"
                      >
                        {loadingItems[item.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                      </Button>
                      
                      <span className="px-4 py-2 font-medium text-lg min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        disabled={loadingItems[item.id]}
                        className="px-3 py-2 hover:bg-gray-200 disabled:opacity-50"
                      >
                        {loadingItems[item.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFromCart(item.id, item.name)}
                      disabled={loadingItems[item.id]}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      {loadingItems[item.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-2" />
                      )}
                      <span className="hidden sm:inline">Remove</span>
                      <span className="sm:hidden">Delete</span>
                    </Button>
                  </div>

                  {/* Item Total (Mobile) */}
                  <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Item total:</span>
                      <span className="text-lg font-bold text-gray-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Item Total (Desktop) */}
                <div className="hidden sm:flex flex-col justify-center items-end min-w-[100px]">
                  <span className="text-lg font-bold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ${item.price} each
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="xl:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-6">
              Order Summary
            </h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-base">
                <span className="text-gray-600">
                  Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items):
                </span>
                <span className="font-medium">${total.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-base">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">
                  {total >= 100 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    '$15.00'
                  )}
                </span>
              </div>

              {total < 100 && (
                <div className="text-sm text-gray-500 bg-yellow-50 p-3 rounded-lg">
                  💡 Add ${(100 - total).toFixed(2)} more for free shipping!
                </div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg sm:text-xl">
                  <span>Total:</span>
                  <span className="text-red-700">
                    ${(total + (total >= 100 ? 0 : 15)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-red-700 hover:bg-red-800 text-white py-3 sm:py-4 text-base sm:text-lg font-medium rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isCheckingOut ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                'Proceed to Checkout'
              )}
            </Button>

            {/* Security Badge */}
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
                Secure checkout powered by SSL
              </div>
            </div>
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