import Image from "next/image";
import { assetUrl, getArtworks } from "@/content";

export const metadata = { title: "Art" };

export default function ArtPage() {
  const artworks = getArtworks();

  return (
    <div>
      <h1 className="font-funnel mb-2 text-4xl font-bold">Art</h1>
      <p className="mb-10 max-w-prose text-gray-500">Artwork and visual studies.</p>

      {artworks.length === 0 ? (
        <p className="text-sm text-gray-400">No artwork yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {artworks.map((artwork) => (
            <li key={artwork.slug}>
              <Image
                src={assetUrl(artwork.image.src)}
                alt={artwork.image.alt}
                width={artwork.image.width}
                height={artwork.image.height}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                className="h-auto w-full rounded-sm object-contain"
              />
              <h2 className="font-funnel mt-3 text-lg font-semibold">{artwork.name}</h2>
              {artwork.description && (
                <p className="mt-1 text-sm text-gray-500">{artwork.description}</p>
              )}
              {(artwork.medium || artwork.materials || artwork.year || artwork.dimensions || artwork.series) && (
                <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                  {artwork.medium && <div><dt className="sr-only">Medium</dt><dd>{artwork.medium}</dd></div>}
                  {artwork.materials && <div><dt className="sr-only">Materials</dt><dd>{artwork.materials}</dd></div>}
                  {artwork.year && <div><dt className="sr-only">Year</dt><dd>{artwork.year}</dd></div>}
                  {artwork.dimensions && <div><dt className="sr-only">Dimensions</dt><dd>{artwork.dimensions}</dd></div>}
                  {artwork.series && <div><dt className="sr-only">Series</dt><dd>{artwork.series}</dd></div>}
                </dl>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}