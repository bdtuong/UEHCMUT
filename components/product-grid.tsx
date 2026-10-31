"use client";
import { useState } from "react";
import { products } from "@/lib/culture";
import ProductCard from "./product-card";
export default function ProductGrid() {
  const [category, setCategory] = useState("All souvenirs");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name");
  const categories = [
    "All souvenirs",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];
  const visible = products
    .filter(
      (p) =>
        (category === "All souvenirs" || p.category === category) &&
        `${p.name} ${p.description}`
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "low"
        ? a.price - b.price
        : sort === "high"
          ? b.price - a.price
          : a.name.localeCompare(b.name),
    );
  return (
    <div>
      <div className="mb-7 flex flex-wrap gap-3">
        {categories.map((c) => (
          <button
            key={c}
            aria-pressed={c === category}
            className={
              c === category ? "culture-button" : "culture-button-secondary"
            }
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Search souvenirs</span>
          <input
            className="culture-input"
            placeholder="Search art prints, keepsakes, festival crafts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
        <label>
          <span className="sr-only">Sort souvenirs</span>
          <select
            className="culture-input"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="name">Name A–Z</option>
            <option value="low">Price low to high</option>
            <option value="high">Price high to low</option>
          </select>
        </label>
      </div>
      <p className="mb-5 text-sm text-[#62685f]" role="status">
        {visible.length} souvenirs found
      </p>
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {visible.length === 0 && (
        <div className="py-16 text-center">
          <h2 className="font-serif text-2xl">No souvenirs found</h2>
          <p className="mt-3">Try another search or collection.</p>
          <button
            className="culture-button-secondary mt-5"
            onClick={() => {
              setQuery("");
              setCategory("All souvenirs");
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
}
