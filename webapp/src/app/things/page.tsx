import { mediaUrl, strapiGet, type StrapiList, type Thing } from "@/lib/strapi";

export const metadata = { title: "Things" };

async function getThings(): Promise<Thing[]> {
  try {
    const res = await strapiGet<StrapiList<Thing>>("/things", {
      sort: "name:asc",
      "pagination[pageSize]": "100",
      "populate[media][fields][0]": "url",
      "populate[media][fields][1]": "alternativeText",
      "populate[tags][fields][0]": "name",
      "populate[tags][fields][1]": "slug",
    });
    return res.data;
  } catch {
    // The collection may not exist yet — degrade to an empty state.
    return [];
  }
}

export default async function ThingsPage() {
  const things = await getThings();

  return (
    <div className="max-w-4xl">
      <h1 className="font-funnel text-4xl font-bold">Things</h1>
      <p className="mt-2 text-gray-500">Objects I own, collected, or made.</p>

      {things.length === 0 ? (
        <p className="mt-10 text-sm text-gray-400">Nothing catalogued yet.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
          {things.map((thing) => {
            const cover = mediaUrl(thing.media?.[0]);
            return (
              <li key={thing.id}>
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt={thing.media?.[0]?.alternativeText ?? thing.name}
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
                {thing.notes && <p className="mt-1 text-xs text-gray-500">{thing.notes}</p>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
