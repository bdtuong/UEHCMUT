"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
const links = [
  { label: "Museums", href: "/#collections" },
  { label: "Our purpose", href: "/#about" },
  { label: "Souvenirs", href: "/products" },
  { label: "Workshops", href: "/#workshops" },
];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { items } = useCart();
  const count = items.reduce((n, item) => n + item.quantity, 0);
  return (
    <header className="sticky top-0 z-40 border-b border-[#ded9cb] bg-[#f7f3e9]/95 backdrop-blur-md">
      <nav
        className="culture-shell flex h-20 items-center justify-between"
        aria-label="Main navigation"
      >
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.png"
            alt="UEHCMUT logo"
            width={48}
            height={48}
            className="h-12 w-12 shrink-0 rounded-full bg-white object-contain"
          />
          <span className="font-serif text-xl tracking-tight">
            Viet Culture
            <span className="block font-sans text-[9px] uppercase tracking-[.26em] text-[#697062]">
              The digital museum
            </span>
          </span>
        </Link>
        <div className="hidden items-center gap-8 text-sm md:flex">
          {links.map((l) => (
            <Link
              className="transition-colors hover:text-[#a95e40]"
              key={l.label}
              href={l.href}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/cart"
            aria-label={`Shopping bag, ${count} items`}
            className="relative p-2"
          >
            <ShoppingBag size={21} />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 rounded-full bg-[#a95e40] px-1.5 text-xs text-white">
                {count}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="p-2 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </nav>
      {open && (
        <div
          id="mobile-navigation"
          className="culture-shell flex flex-col gap-5 border-t border-[#ded9cb] py-6 md:hidden"
        >
          {links.map((l) => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
