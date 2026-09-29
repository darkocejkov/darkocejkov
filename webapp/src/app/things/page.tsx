import { assetUrl, getThings } from "@/content";
import { Mdx } from "@/content/mdx";

export const metadata = { title: "Things" };

export default function ThingsPage() {
  const things = getThings();

  return (
    <div className="max-w-4xl">
      <h1 className="font-funnel text-4xl font-bold">Things</h1>
      <p className="mt-2 text-gray-500">Objects I own, collected, or made.</p>

      {things.length === 0 ? (
        <p className="mt-10 text-sm text-gray-400">Nothing catalogued yet.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
          {things.map((thing) => {
            const cover = thing.media[0];
            return (
              <li key={thing.slug}>
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={assetUrl(cover.src)}
                    alt={cover.alt}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-lg bg-gray-100 dark:bg-gray-800" />
                )}
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <h2 className="text-sm font-medium">{thing.name}</h2>
                  {thing.isSelf && (
                    <span className="text-xs text-brand-orange" title="I made this">
                      made
                    </span>
                  )}
                </div>
                {thing.type && <p className="text-xs text-gray-400">{thing.type}</p>}
                {thing.body.trim() && (
                  <div className="mt-1">
                    <Mdx source={thing.body} className="text-xs text-gray-500" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
