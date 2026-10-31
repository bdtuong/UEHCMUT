import Link from "next/link";
import sources from "@/public/culture/photos/sources.json";
export const metadata = { title: "Image credits | Viet Culture" };
export default function ImageCredits() {
  return (
    <main className="culture-shell py-14">
      <Link href="/" className="culture-link">
        ← Back to the museum
      </Link>
      <p className="eyebrow mt-8">Sources and acknowledgements</p>
      <h1 className="mt-4 font-serif text-4xl">Image credits</h1>
      <p className="mt-6 max-w-3xl leading-8 text-[#62685f]">
        These images were downloaded from Wikimedia Commons and are served from
        this repository. Copyright remains with the credited creators. Each
        optimized image retains its original license; any reuse must follow that
        license. Images used for concept products or workshops do not document
        actual merchandise or scheduled classes.
      </p>
      <div className="mt-10 grid gap-8 md:grid-cols-2">
        {sources.map((p) => (
          <article
            id={p.id}
            key={p.id}
            className="scroll-mt-24 border border-[#d6d1c3] bg-[#faf7ef] p-5"
          >
            <img
              src={p.src}
              alt={p.description || p.title}
              className="aspect-[4/3] w-full bg-[#e7dfcf] object-contain"
            />
            <h2 className="mt-5 break-words font-serif text-xl">{p.title}</h2>
            <p className="mt-3 text-sm leading-7">Creator: {p.author}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-sm underline">
              <a href={p.source} target="_blank" rel="noreferrer">
                Original source
              </a>
              {p.licenseUrl ? (
                <a href={p.licenseUrl} target="_blank" rel="noreferrer">
                  {p.license}
                </a>
              ) : (
                <span>{p.license}</span>
              )}
            </div>
            <p className="mt-4 text-xs leading-6 text-[#62685f]">
              Changes: {p.changes} Optimized files are available under the
              license linked above.
            </p>
          </article>
        ))}
      </div>
      <p className="mt-10 text-sm leading-7 text-[#62685f]">
        The original Mid-Autumn images were already present in the project.
        Their provenance is not established by this new import and should be
        reviewed separately before publication.
      </p>
    </main>
  );
}
