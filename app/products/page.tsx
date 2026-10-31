import ProductGrid from "@/components/product-grid";
export default function ProductsPage() {
  return (
    <main className="min-h-screen bg-[#f7f3e9] py-14">
      <div className="culture-shell">
        <p className="eyebrow">The museum shop</p>
        <h1 className="mt-4 font-serif text-4xl md:text-6xl">
          Culture to carry with you.
        </h1>
        <p className="mb-10 mt-5 max-w-xl leading-7 text-[#62685f]">
          Discover art prints, illustrated keepsakes and festival crafts from
          across the collections. Preview catalogue with illustrative prices.
        </p>
        <ProductGrid />
      </div>
    </main>
  );
}
