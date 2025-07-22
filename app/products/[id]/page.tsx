import ProductDetail from "@/components/product-detail"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <main className="min-h-screen bg-white">
      <ProductDetail productId={params.id} />
    </main>
  )
}
