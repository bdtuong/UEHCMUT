"use client";
import Link from "next/link";
import PhotoCredit from "./photo-credit";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { products, formatPrice } from "@/lib/culture";
import { useCart } from "@/hooks/use-cart";
export default function ProductDetail({
  productId = "1",
}: {
  productId?: string;
}) {
  const product = products.find((p) => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const { addToCart } = useCart();
  const router = useRouter();
  if (!product)
    return (
      <section className="culture-shell py-24">
        <h1 className="font-serif text-4xl">Souvenir not found</h1>
        <Link href="/products" className="culture-link mt-6">
          Return to the shop →
        </Link>
      </section>
    );
  const add = () => {
    addToCart({ ...product, quantity });
    setMessage(`${quantity} item${quantity > 1 ? "s" : ""} added to your bag.`);
  };
  return (
    <section className="culture-shell py-12">
      <Link href="/products" className="culture-link">
        ← Back to the museum shop
      </Link>
      <div className="mt-8 grid gap-12 md:grid-cols-2">
        <img
          src={product.image}
          alt={product.name}
          className="aspect-square w-full bg-[#e7dfcf] object-contain"
        />
        <div className="py-5">
          <PhotoCredit src={product.image} className="mb-4" />
          <p className="eyebrow">{product.category}</p>
          <h1 className="mt-5 font-serif text-4xl md:text-5xl">
            {product.name}
          </h1>
          <p className="mt-6 text-2xl">{formatPrice(product.price)}</p>
          <p className="mt-6 leading-8 text-[#62685f]">{product.description}</p>
          <dl className="mt-6 border-y border-[#d6d1c3] py-5 text-sm">
            <dt className="font-semibold">Material</dt>
            <dd className="mt-2 text-[#62685f]">{product.material}</dd>
          </dl>
          <label className="mt-6 block text-sm">
            Quantity
            <input
              type="number"
              min="1"
              max="99"
              value={quantity}
              onChange={(e) =>
                setQuantity(
                  Math.max(1, Math.min(99, Number(e.target.value) || 1)),
                )
              }
              className="culture-input mt-2 max-w-24"
            />
          </label>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={add} className="culture-button">
              Add to bag
            </button>
            <button
              onClick={() => {
                add();
                router.push("/cart");
              }}
              className="culture-button-secondary"
            >
              View bag
            </button>
          </div>
          <p role="status" className="mt-4 text-sm">
            {message}
          </p>
          <p className="mt-6 text-xs leading-6 text-[#73786c]">
            Preview catalogue. Products and prices are illustrative; online
            ordering is not connected to a fulfilment service.
          </p>
        </div>
      </div>
    </section>
  );
}
