"use client";
import { useState } from "react";
import PhotoCredit from "./photo-credit";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
const workshops = [
  {
    id: "print",
    name: "Stories on paper",
    type: "Art & illustration",
    image: "/culture/photos/folk-art.webp",
    text: "Explore bold outlines and everyday subjects through an introductory print-inspired drawing session.",
    time: "90 minutes",
  },
  {
    id: "clay",
    name: "A conversation with clay",
    type: "Craft & material",
    image: "/culture/photos/pottery.webp",
    text: "Discover form, surface and pattern through a guided introduction to ceramic decoration.",
    time: "120 minutes",
  },
  {
    id: "lantern",
    name: "Make a little festival",
    type: "Seasonal craft",
    image: "/culture/photos/lanterns.webp",
    text: "Explore bamboo-and-paper lantern forms and the creativity of Mid-Autumn craft.",
    time: "90 minutes",
  },
];
export default function CulturalWorkshops() {
  const [selected, setSelected] = useState<(typeof workshops)[number] | null>(
    null,
  );
  return (
    <section
      id="workshops"
      className="scroll-mt-24 border-t border-[#d6d1c3] bg-[#eeeadd] py-20"
    >
      <div className="culture-shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Learn by taking part</p>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">
              From looking to making.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[#62685f]">
            An invitation to explore materials and ideas. Organizations can
            offer sessions when facilitators and venues are available.
          </p>
        </div>
        <div className="mt-10 grid gap-7 md:grid-cols-3">
          {workshops.map((w) => (
            <article
              key={w.id}
              className="flex flex-col border border-[#d6d1c3] bg-[#faf7ef]"
            >
              <img
                src={w.image}
                alt={w.name + " reference image"}
                className={`aspect-[16/10] w-full bg-[#e7dfcf] ${w.id === "print" ? "object-contain" : "object-cover"}`}
              />
              <div className="flex flex-1 flex-col p-6">
                <PhotoCredit src={w.image} className="mb-3" />
                <p className="eyebrow text-[10px]">{w.type}</p>
                <h3 className="mt-3 font-serif text-2xl">{w.name}</h3>
                <p className="mb-6 mt-4 flex-1 text-sm leading-6 text-[#62685f]">
                  {w.text}
                </p>
                <div className="mb-5 flex items-center gap-2 text-xs text-[#62685f]">
                  <Clock size={14} />
                  {w.time}
                  <span className="ml-auto rounded-full bg-[#e8ecdf] px-3 py-1">
                    Schedule to be announced
                  </span>
                </div>
                <button
                  className="culture-link justify-between border-t border-[#d6d1c3] pt-4"
                  onClick={() => setSelected(w)}
                >
                  Workshop details <ArrowUpRight size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-xs text-[#73786c]">
          Workshop concepts · Booking opens when an organization publishes a
          confirmed session.
        </p>
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        {selected && (
          <DialogContent className="max-h-[90vh] w-[calc(100%-32px)] overflow-y-auto rounded-none bg-[#faf7ef] p-8">
            <p className="eyebrow">{selected.type}</p>
            <DialogTitle className="font-serif text-3xl font-normal">
              {selected.name}
            </DialogTitle>
            <DialogDescription className="leading-7 text-[#62685f]">
              {selected.text}
            </DialogDescription>
            <p className="flex items-center gap-2 text-sm">
              <Clock size={16} />
              {selected.time}
            </p>
            <p className="flex items-center gap-2 text-sm">
              <MapPin size={16} />
              Venue to be confirmed
            </p>
            <div className="bg-[#e8ecdf] p-5 text-sm leading-7">
              No sessions are currently open for booking. Dates, fees,
              facilitators and participant requirements will appear here when
              the organization confirms a schedule.
            </div>
            <button
              className="culture-button"
              onClick={() => setSelected(null)}
            >
              Back to workshops
            </button>
          </DialogContent>
        )}
      </Dialog>
    </section>
  );
}
