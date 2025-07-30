

import Hero from "@/components/hero";
import VideoSection from "@/components/video-section";
import Gallery3D from "@/components/image-gallery-museum";
import CulturalHistory from "@/components/cultural-history";
import FeaturedProducts from "@/components/featured-products";
import ChatbotFloating from "@/components/chatbot";
import WelcomeSection from "@/components/welcome-section";
import Gallery3D2 from "@/components/image-gallery-museum-2";
import Gallery3D3 from "@/components/image-gallery-museum-3";
import CulturalHeritage from "@/components/cultural-history-2";
import CulturalHeritage2 from "@/components/cultural-heritage-3";
import LanternDesigner from "@/components/lanterncustomizer";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <WelcomeSection />
      <VideoSection />
      <CulturalHistory />
      <Gallery3D />
      <CulturalHeritage />
      <Gallery3D2 />
      <CulturalHeritage2 />
      <Gallery3D3 />
      <FeaturedProducts />
      <ChatbotFloating />
      <LanternDesigner />

    </main>
  );
}
