import {
  strapiGet,
  isSocial,
  type StrapiList,
  type SiteLink,
  type LinkCategory,
} from "@/lib/strapi";

async function getLinks(): Promise<SiteLink[]> {
  try {
    const res = await strapiGet<StrapiList<SiteLink>>("/links", {
      sort: "order:asc",
      "pagination[pageSize]": "100",
      "populate[category][fields][0]": "name",
      "populate[category][fields][1]": "slug",
      "populate[tags][fields][0]": "name",
    });
    return res.data;
  } catch {
    return [];
  }
}

async function getCategories(): Promise<LinkCategory[]> {
  try {
    const res = await strapiGet<StrapiList<LinkCategory>>("/link-categories", {
      sort: "order:asc",
      "pagination[pageSize]": "100",
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

function Entry({ link }: { link: SiteLink }) {
  const saved = formatDate(link.savedAt);
  return (
    <li className="py-3 first:pt-0">
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="group block">
        <span className="text-sm font-medium group-hover:underline">{link.title}</span>
        {link.description && (
          <span className="mt-0.5 block text-xs text-gray-500">{link.description}</span>
        )}
        <span className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-gray-400">
          <span className="truncate">{new URL(link.url).hostname.replace(/^www\./, "")}</span>
          {saved && <span>{saved}</span>}
          {link.tags?.length > 0 && <span>{link.tags.map((t) => t.name).join(", ")}</span>}
        </span>
      </a>
    </li>
  );
}

export default async function Bookmarks() {
  const [links, categories] = await Promise.all([getLinks(), getCategories()]);

  // Social links are my own accounts and belong in the footer, not here.
  const bookmarks = links.filter((l) => !isSocial(l));
  const grouped = categories
    .map((c) => ({ category: c, items: bookmarks.filter((b) => b.category?.slug === c.slug) }))
    .filter(({ items }) => items.length > 0);

  // Anything without a category would otherwise vanish silently.
  const uncategorised = bookmarks.filter((b) => !b.category);

  return (
    <main className="px-8 py-12">
      <h1 className="font-funnel mb-2 text-4xl font-bold">Bookmarks</h1>
      <p className="mb-10 max-w-prose text-gray-500">
        Things worth coming back to.
      </p>

      {bookmarks.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing saved yet.</p>
      ) : (
        <div className="flex flex-col gap-12">
          {grouped.map(({ category, items }) => (
            <section key={category.id}>
              <h2 className="font-funnel mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">
                {category.name}
              </h2>
              {category.description && (
                <p className="mb-3 text-xs text-gray-400">{category.description}</p>
              )}
              <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                {items.map((link) => (
                  <Entry key={link.id} link={link} />
                ))}
              </ul>
            </section>
          ))}

          {uncategorised.length > 0 && (
            <section>
              <h2 className="font-funnel mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Other
              </h2>
              <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                {uncategorised.map((link) => (
                  <Entry key={link.id} link={link} />
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
