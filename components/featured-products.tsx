import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductCard from "./product-card";
import { products } from "@/lib/culture";
export default function FeaturedProducts() {
  return (
    <section className="bg-[#f7f3e9] py-20">
      <div className="culture-shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">The museum shop</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              A small piece of the story.
            </h2>
          </div>
          <Link href="/products" className="culture-link">
            Browse all souvenirs <ArrowUpRight size={18} />
          </Link>
        </div>
        <p className="mb-9 mt-5 max-w-xl text-[#62685f]">
          Art prints, paper keepsakes and festival crafts inspired by the
          collections. Explore a little further, or bring a memory home.
        </p>
        <div className="grid gap-7 md:grid-cols-3">
          {[products[1], products[2], products[0]].map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <p className="mt-6 text-xs text-[#73786c]">
          Preview catalogue · Product availability and prices are illustrative.
        </p>
      </div>
    </section>
  );
}
