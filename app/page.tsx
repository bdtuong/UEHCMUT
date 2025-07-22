import Hero from "@/components/hero"
import VideoSection from "@/components/video-section"
import ImageGallery from "@/components/image-gallery"
import CulturalHistory from "@/components/cultural-history"
import FeaturedProducts from "@/components/featured-products"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <VideoSection />
      <ImageGallery />
      <CulturalHistory />
      <FeaturedProducts />
    </main>
  )
}
