import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
export default function Footer() {
  return (
    <footer className="bg-[#233e35] py-14 text-[#f3eddf]">
      <div className="culture-shell">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3 font-serif text-2xl">
              <img
                src="/logo.png"
                alt="UEHCMUT logo"
                width={56}
                height={56}
                className="h-14 w-14 shrink-0 rounded-full bg-white object-contain"
              />
              Viet Culture
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-[#c5cdbf]">
              A space for cultural discovery, shared knowledge and the people
              who keep traditions moving forward.
            </p>
          </div>
          <div>
            <p className="eyebrow text-[#b7c3ad]">Keep exploring</p>
            <div className="mt-5 flex flex-col gap-3 text-sm">
              <Link href="/#collections">3D museums</Link>
              <Link href="/products">Souvenir shop</Link>
              <Link href="/#workshops">Workshops</Link>
              <Link href="/image-credits">Image credits</Link>
            </div>
          </div>
          <div>
            <p className="eyebrow text-[#b7c3ad]">For cultural organizations</p>
            <p className="mt-5 text-sm leading-7 text-[#c5cdbf]">
              Built for museums, cultural centres and organizations preserving
              <span className="culture-keyword culture-keyword-light">
                Vietnamese
              </span>{" "}
              heritage.
            </p>
            <Link
              href="/#about"
              className="mt-4 inline-flex items-center gap-2 text-sm"
            >
              Our purpose <ArrowUpRight size={15} />
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-between gap-3 border-t border-white/15 pt-6 text-xs text-[#bdc7b7]">
          <p>© {new Date().getFullYear()} Viet Culture · UEHCMUT project</p>
          <p>Discover. Understand. Take part.</p>
        </div>
      </div>
    </footer>
  );
}
