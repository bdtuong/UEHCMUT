"use client";
import { Component, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import PhotoCredit from "./photo-credit";
import CulturalText from "./cultural-text";
import { ArrowUpRight, Box, BookOpen, Users } from "lucide-react";
import {
  collections,
  culturalExhibits,
  lanternExhibits,
  type CollectionId,
} from "@/lib/culture";
const Gallery = dynamic(() => import("./image-gallery-museum"), {
  ssr: false,
  loading: () => (
    <p
      className="fixed inset-0 z-50 grid place-items-center bg-[#16251f] p-8 text-white"
      role="status"
    >
      Preparing the museum…
    </p>
  ),
});
class MuseumBoundary extends Component<
  { children: ReactNode; onRead: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div role="alert" className="border border-[#c8c6b7] bg-[#faf7ef] p-8">
        <h3 className="font-serif text-2xl">
          The 3D room could not be loaded.
        </h3>
        <p className="mt-3 text-sm leading-7">
          Your browser may not support this scene, or a resource may be
          unavailable. You can still explore the exhibits in reading mode.
        </p>
        <button className="culture-button mt-5" onClick={this.props.onRead}>
          Read this collection
        </button>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function CulturalHome() {
  const [active, setActive] = useState<CollectionId>("craft");
  const [mode, setMode] = useState<"overview" | "3d" | "read">("overview");
  const collection = collections.find((c) => c.id === active)!;
  const exhibits =
    active === "art"
      ? [
          culturalExhibits[3],
          culturalExhibits[2],
          culturalExhibits[4],
          culturalExhibits[0],
          culturalExhibits[1],
          culturalExhibits[5],
        ]
      : culturalExhibits;
  return (
    <>
      <section id="collections" className="scroll-mt-24 bg-[#eeeadd] py-20">
        <div className="culture-shell">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Choose your path</p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">
                A culture with many chapters.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-[#62685f]">
              Wander through a virtual gallery, pause at an object, and find a
              story worth carrying with you.
            </p>
          </div>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {collections.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActive(c.id);
                  setMode("overview");
                }}
                className={`group overflow-hidden text-left transition-shadow ${active === c.id ? "ring-2 ring-[#365449] ring-offset-4 ring-offset-[#eeeadd]" : "hover:shadow-lg"}`}
                aria-pressed={active === c.id}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.category + " collection image"}
                    className={`aspect-[4/3] w-full bg-[#e7dfcf] ${c.id === "art" ? "object-contain" : "object-cover"} transition-transform duration-500 group-hover:scale-105`}
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#faf7ef] px-3 py-1 text-xs">
                    Collection {c.number}
                  </span>
                </div>
                <div className="bg-[#f9f6ee] p-6">
                  <PhotoCredit src={c.image} className="mb-3" linked={false} />
                  <p className="eyebrow text-[10px]">{c.category}</p>
                  <div className="mt-3 flex justify-between gap-3">
                    <h3 className="font-serif text-2xl">{c.title}</h3>
                    <ArrowUpRight className="shrink-0" size={20} />
                  </div>
                  <p className="mt-4 text-sm leading-6 text-[#62685f]">
                    {c.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-10 border-t border-[#c9c8b9] pt-8">
            <div className="flex flex-wrap items-center justify-between gap-5">
              <div>
                <p className="eyebrow">
                  Selected collection · {collection.number}
                </p>
                <h3 className="mt-2 font-serif text-2xl">{collection.title}</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  className="culture-button"
                  onClick={() => setMode("3d")}
                >
                  <Box size={17} /> Enter the 3D museum
                </button>
                <button
                  className="culture-button-secondary"
                  onClick={() => setMode(mode === "read" ? "overview" : "read")}
                >
                  <BookOpen size={17} /> Read the collection
                </button>
              </div>
            </div>
            {mode === "3d" && (
              <div className="mt-8">
                <MuseumBoundary key={active} onRead={() => setMode("read")}>
                  <Gallery
                    collectionId={active}
                    onClose={() => setMode("overview")}
                    onRead={() => setMode("read")}
                  />
                </MuseumBoundary>
              </div>
            )}
            {mode === "read" && (
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {(active === "festival" ? lanternExhibits : exhibits).map(
                  (e) => (
                    <article key={e.id} className="bg-[#faf7ef] p-5">
                      <img
                        src={e.imageUrl}
                        alt={e.title}
                        className="mb-2 aspect-[4/3] w-full bg-[#eeeadd] object-contain"
                      />
                      <PhotoCredit src={e.imageUrl} className="mb-4" />
                      <h4 className="font-serif text-xl">{e.title}</h4>
                      <p className="mt-3 text-sm leading-7 text-[#62685f]">
                        <CulturalText>{e.description}</CulturalText>
                      </p>
                    </article>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </section>
      <section
        id="about"
        className="scroll-mt-24 bg-[#233e35] py-20 text-[#f3eddf]"
      >
        <div className="culture-shell grid gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow text-[#c2c7ae]">
              Culture belongs in the conversation
            </p>
            <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
              More than objects.
              <br />
              <em className="text-[#d2b88d]">Connections that last.</em>
            </h2>
          </div>
          <div>
            <p className="text-lg leading-8 text-[#d6dccc]">
              <span className="culture-keyword culture-keyword-light">
                Vietnamese
              </span>{" "}
              culture lives in everyday gestures, in things made by hand and in
              the ways people gather. This museum is a place to look closer, ask
              questions and discover those connections.
            </p>
            <p className="mt-5 text-sm leading-7 text-[#bdc9b6]">
              Created for cultural preservation and development organizations,
              the platform connects exhibitions with opportunities to learn and
              take part. Documentary photographs introduce craft, textiles and
              architecture, while the original lantern collection remains part
              of our festival story.
            </p>
            <div className="mt-8 flex gap-3 border-t border-white/20 pt-6">
              <Users className="shrink-0 text-[#d2b88d]" />
              <p className="text-sm leading-6">
                For curious visitors, learners and the communities who carry
                cultural knowledge forward.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
