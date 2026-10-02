import Image from "next/image";
import { FlowTitle } from "@/components/flow/Flow";
import { assetUrl, getArtworks, getVideos } from "@/content";

export const metadata = { title: "Media" };

function SectionTitle({ id, children, count }: { id: string; children: string; count: number }) {
  return (
    <h2 id={id} className="title-display title-outline mb-10 flex items-start gap-3 text-[clamp(4.5rem,17vw,13rem)]">
      {children}
      <span className="font-sans text-base font-normal tracking-normal [-webkit-text-stroke:0] text-gray-400">
        {count}
      </span>
    </h2>
  );
}

export default function MediaPage() {
  const artworks = getArtworks();
  const videos = getVideos();

  return (
    <div>
      <FlowTitle className="mb-16">Media</FlowTitle>

      <section aria-labelledby="art">
        <SectionTitle id="art" count={artworks.length}>
          art
        </SectionTitle>
        {artworks.length === 0 ? (
          <p className="text-sm text-gray-400">No artwork yet.</p>
        ) : (
          <ul className="columns-1 gap-8 sm:columns-2 lg:columns-3">
            {artworks.map((artwork) => (
              <li key={artwork.slug} className="mb-8 break-inside-avoid">
                <Image
                  src={assetUrl(artwork.image.src)}
                  alt={artwork.image.alt}
                  width={artwork.image.width}
                  height={artwork.image.height}
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                  className="h-auto w-full rounded-sm object-contain"
                />
                {artwork.description && (
                  <p className="mt-3 text-sm text-gray-500">{artwork.description}</p>
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
      </section>

      <section aria-labelledby="video" className="mt-32">
        <SectionTitle id="video" count={videos.length}>
          video
        </SectionTitle>
        {videos.length === 0 ? (
          <p className="text-sm text-gray-400">No video yet.</p>
        ) : (
          <ul className="columns-1 gap-8 sm:columns-2 lg:columns-3">
            {videos.map((video) => (
              <li key={video.slug} className="mb-12 break-inside-avoid">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  poster={video.video.poster ? assetUrl(video.video.poster) : undefined}
                  // Without a poster, a tiny start offset makes browsers paint the first frame.
                  src={`${assetUrl(video.video.src)}${video.video.poster ? "" : "#t=0.1"}`}
                  className="h-auto max-h-[85vh] w-full rounded-sm bg-black object-contain"
                />
                <p className="mt-3 font-funnel text-2xl font-bold tracking-tight">{video.name}</p>
                {(video.description || video.year) && (
                  <p className="mt-1 text-sm text-gray-500">
                    {[video.description, video.year].filter(Boolean).join(" · ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
