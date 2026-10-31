import Cart from "@/components/cart";
export default function CartPage() {
  return (
    <main className="min-h-screen bg-[#f7f3e9] py-12">
      <div className="culture-shell">
        <p className="eyebrow">The museum shop</p>
        <h1 className="mb-10 mt-4 font-serif text-4xl md:text-5xl">
          Your souvenir bag
        </h1>
        <Cart />
      </div>
    </main>
  );
}
