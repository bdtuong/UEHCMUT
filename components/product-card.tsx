"use client";
import Link from "next/link";
import PhotoCredit from "./photo-credit";
import { useState } from "react";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/culture";
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category?: string;
}
export default function ProductCard({
  product,
  onNotification,
}: {
  product: Product;
  onNotification?: (message: string, type: "success" | "error") => void;
}) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <article className="group flex h-full flex-col overflow-hidden border border-[#dad6c9] bg-[#faf7ef]">
      <Link href={`/products/${product.id}`} className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className={`aspect-[4/3] w-full bg-[#e7dfcf] ${product.image.includes("folk-art") ? "object-contain" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
        />
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <PhotoCredit src={product.image} className="mb-3" />
        <p className="eyebrow text-[10px]">
          {product.category || "Museum souvenir"}
        </p>
        <Link href={`/products/${product.id}`}>
          <h3 className="mt-3 font-serif text-2xl text-[#263e33]">
            {product.name}
          </h3>
        </Link>
        <p className="mb-5 mt-3 flex-1 text-sm leading-6 text-[#62685f]">
          {product.description}
        </p>
        <div className="flex items-center justify-between gap-3 border-t border-[#ded9cb] pt-4">
          <span className="text-base font-medium">
            {formatPrice(product.price)}
          </span>
          <button
            type="button"
            aria-label={`Add ${product.name} to bag`}
            className="inline-flex items-center gap-2 rounded-full border border-[#b8c1af] px-4 py-2 text-sm hover:bg-[#e8ecdf]"
            onClick={() => {
              addToCart({ ...product, quantity: 1 });
              setAdded(true);
              onNotification?.(`${product.name} added to bag`, "success");
            }}
          >
            {added ? <Check size={15} /> : <Plus size={15} />}{" "}
            {added ? "Add again" : "Add to bag"}
          </button>
        </div>
        <span role="status" className="sr-only">
          {added ? `${product.name} added to bag` : ""}
        </span>
      </div>
    </article>
  );
}
