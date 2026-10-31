import Hero from "@/components/hero";
import CulturalHome from "@/components/cultural-home";
import FeaturedProducts from "@/components/featured-products";
import CulturalWorkshops from "@/components/cultural-workshops";
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <CulturalHome />
      <FeaturedProducts />
      <CulturalWorkshops />
    </main>
  );
}
