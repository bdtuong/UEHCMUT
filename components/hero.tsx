import Link from "next/link";
import { ArrowUpRight, MoveDown } from "lucide-react";
import HeroVase from "./hero-vase";
import CulturalText from "./cultural-text";
export default function Hero() {
  return (
    <section className="culture-hero">
      <div className="culture-shell grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <p className="eyebrow">
            <CulturalText>An open door to Vietnamese culture</CulturalText>
          </p>
          <h1 className="mt-6 font-serif text-5xl leading-[1.08] tracking-tight md:text-7xl">
            Many traditions.
            <br />
            <em className="text-[#a95e40]">Living stories.</em>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-[#62685f]">
            Step inside a digital museum of Vietnam. Discover the craft, art and
            shared rituals that connect people, places and generations.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/#collections" className="culture-button">
              Explore the museums <ArrowUpRight size={18} />
            </Link>
            <Link href="/#about" className="culture-link">
              Get to know the project <span>↗</span>
            </Link>
          </div>
          <div className="mt-14 flex gap-8 border-t border-[#d6d1c3] pt-6 text-sm">
            <div>
              <strong className="block font-serif text-2xl">03</strong>
              <span className="text-[#62685f]">Cultural perspectives</span>
            </div>
            <div>
              <strong className="block font-serif text-2xl">3D</strong>
              <span className="text-[#62685f]">Spaces to explore</span>
            </div>
            <div>
              <strong className="block font-serif text-2xl">Together</strong>
              <span className="text-[#62685f]">Keep culture in motion</span>
            </div>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-xl">
          <div className="hero-art">
            <HeroVase />
          </div>
          <div className="mt-4 flex items-center justify-between border border-[#d6d1c3] bg-[#faf7ef] px-5 py-4 shadow-sm">
            <div>
              <p className="eyebrow text-[10px]">Inside the collection</p>
              <p className="mt-1 font-serif text-xl">A closer look at clay</p>
            </div>
            <span className="text-2xl text-[#a95e40]">01 / 03</span>
          </div>
          <p className="mt-3 text-right text-[10px] leading-5 text-[#62685f]">
            <a
              href="https://polyhaven.com/a/ceramic_vase_01"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              Ceramic Vase 01 · James Ray Cock · CC0
            </a>
            <span className="block">
              Modern material study · Not a historical artefact
            </span>
          </p>
        </div>
      </div>
      <div className="culture-shell flex items-center gap-3 pb-8 text-xs uppercase tracking-[.2em] text-[#73786c]">
        <MoveDown size={14} /> A little curiosity goes a long way
      </div>
    </section>
  );
}
