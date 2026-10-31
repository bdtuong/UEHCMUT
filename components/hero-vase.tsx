"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode } from "react";

function VaseFallback({ failed = false }: { failed?: boolean }) {
  return (
    <div className="relative flex h-full items-center justify-center bg-[#e7dece]">
      <img
        src="/models/ceramic-vase/preview.png"
        alt="Preview of the Ceramic Vase 01 model"
        className="h-[78%] w-[78%] object-contain"
      />
      <p
        role="status"
        className="absolute inset-x-5 bottom-12 text-center text-xs text-[#62685f]"
      >
        {failed
          ? "3D preview unavailable · Model preview shown"
          : "Preparing your 3D object…"}
      </p>
    </div>
  );
}

const VaseScene = dynamic(() => import("./hero-vase-scene"), {
  ssr: false,
  loading: () => <VaseFallback />,
});

class VaseBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <VaseFallback failed /> : this.props.children;
  }
}

export default function HeroVase() {
  return (
    <VaseBoundary>
      <VaseScene />
    </VaseBoundary>
  );
}
