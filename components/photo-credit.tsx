import Link from "next/link";
import sources from "@/public/culture/photos/sources.json";
export default function PhotoCredit({
  src,
  className = "",
  linked = true,
}: {
  src: string;
  className?: string;
  linked?: boolean;
}) {
  const photo = sources.find((p) => p.src === src);
  if (!photo) return null;
  const label = `${photo.id === "folk-art" ? "Artwork source" : "Photo"}: ${photo.author} · ${photo.license}`;
  if (!linked)
    return (
      <p className={`text-[10px] leading-5 text-[#62685f] ${className}`}>
        {label}
      </p>
    );
  return (
    <p className={`text-[10px] leading-5 text-[#62685f] ${className}`}>
      <Link
        href={`/image-credits#${photo.id}`}
        className="underline decoration-[#a8aa9a] underline-offset-2"
      >
        {photo.id === "folk-art" ? "Artwork source" : "Photo"}: {photo.author} ·{" "}
        {photo.license}
      </Link>
    </p>
  );
}
