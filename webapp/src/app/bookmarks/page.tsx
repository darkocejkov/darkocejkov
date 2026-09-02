import { strapiGet, type StrapiList, type SiteLink } from "@/lib/strapi";

async function getBookmarks(): Promise<SiteLink[]> {
  try {
    const res = await strapiGet<StrapiList<SiteLink>>("/links", {
      // Social links are my own accounts and render in the footer instead.
      "filters[type][$eq]": "bookmark",
      sort: "order:asc",
      "pagination[pageSize]": "100",
      "populate[tags][fields][0]": "name",
      "populate[tags][fields][1]": "slug",
    });
    return res.data;
  } catch {
    return [];
  }
}

function formatDate(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function Bookmarks() {
  const bookmarks = await getBookmarks();

  return (
    <main className="px-8 py-12">
      <h1 className="font-funnel mb-2 text-4xl font-bold">Bookmarks</h1>
      <p className="mb-10 max-w-prose text-gray-500">Things worth coming back to.</p>

      {bookmarks.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing saved yet.</p>
      ) : (
        <ul className="flex max-w-2xl flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {bookmarks.map((link) => {
            const saved = formatDate(link.savedAt);
            return (
              <li key={link.id} className="py-4 first:pt-0">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <span className="text-sm font-medium group-hover:underline">{link.title}</span>
                  {link.description && (
                    <span className="mt-0.5 block text-sm text-gray-500">{link.description}</span>
                  )}
                  <span className="mt-1.5 flex flex-wrap items-center gap-x-3 text-xs text-gray-400">
                    <span>{hostname(link.url)}</span>
                    {saved && <span>{saved}</span>}
                    {link.tags?.length > 0 && (
                      <span>{link.tags.map((t) => t.name).join(", ")}</span>
                    )}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
