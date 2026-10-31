"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/culture";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <ShoppingBag className="mx-auto mb-5 text-[#a95e40]" size={40} />
        <h2 className="font-serif text-3xl">
          Your bag is waiting for a story.
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-7 text-[#62685f]">
          Explore art prints, paper keepsakes and festival crafts from the
          museum collections.
        </p>
        <Link href="/products" className="culture-button mt-7">
          Explore the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="grid items-start gap-10 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-5">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex gap-4 border border-[#d6d1c3] bg-[#faf7ef] p-4 sm:gap-6"
          >
            <Link href={`/products/${item.id}`} className="shrink-0">
              <img
                src={item.image}
                alt={item.name}
                className="h-24 w-24 object-cover sm:h-32 sm:w-32"
              />
            </Link>
            <div className="min-w-0 flex-1">
              <Link href={`/products/${item.id}`}>
                <h2 className="font-serif text-xl">{item.name}</h2>
              </Link>
              <p className="mt-2 text-sm text-[#62685f]">
                {formatPrice(item.price)} each
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center border border-[#c8c9b9]">
                  <button
                    type="button"
                    aria-label={`Decrease quantity of ${item.name}`}
                    disabled={item.quantity <= 1}
                    className="p-2 disabled:opacity-30"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={15} />
                  </button>
                  <span
                    className="min-w-8 text-center text-sm"
                    aria-live="polite"
                  >
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${item.name}`}
                    className="p-2 disabled:opacity-30"
                    disabled={item.quantity >= 99}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={15} />
                  </button>
                </div>
                <button
                  aria-label={`Remove ${item.name}`}
                  className="p-2 text-[#9c513b]"
                  onClick={() => removeFromCart(item.id)}
                >
                  <Trash2 size={17} />
                </button>
              </div>
              <p className="mt-3 text-sm font-medium">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </article>
        ))}
      </div>
      <aside className="border border-[#d6d1c3] bg-[#eeeadd] p-6">
        <h2 className="font-serif text-2xl">Your collection</h2>
        <div className="mt-6 flex justify-between border-b border-[#c8c9b9] pb-5 text-sm">
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>
        <p className="mt-5 text-sm leading-7 text-[#62685f]">
          This is a preview catalogue. Checkout, delivery fees and payment
          options will be available when the organization connects its shop.
        </p>
        <button
          disabled
          className="culture-button mt-6 w-full cursor-not-allowed opacity-60"
        >
          Ordering coming soon
        </button>
        <Link href="/products" className="culture-link mt-3">
          Continue exploring →
        </Link>
      </aside>
    </div>
  );
}
