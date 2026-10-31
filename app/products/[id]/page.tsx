import ProductDetail from "@/components/product-detail";
export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-[#f7f3e9]">
      <ProductDetail productId={id} />
    </main>
  );
}
