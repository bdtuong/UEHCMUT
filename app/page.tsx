import Hero from "@/components/hero"
import VideoSection from "@/components/video-section"
import Gallery3D from "@/components/image-gallery-museum"
import CulturalHistory from "@/components/cultural-history"
import FeaturedProducts from "@/components/featured-products"
import ChatbotFloating from "@/components/chatbot"
import WelcomeSection from "@/components/welcome-section"
export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WelcomeSection />
      <VideoSection />
      <Gallery3D />
      <CulturalHistory />
      <FeaturedProducts />
      <ChatbotFloating />

    </main>
  )
}
