import SocialIcon from "@/components/SocialIcon";
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
      "pagination[pageSize]": "200",
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
    });
    return res.data;
  } catch {
    return [];
  }
}

export default async function Links() {
  const [links, categories] = await Promise.all([getLinks(), getCategories()]);

  return (
    <main className="px-8 py-12">
      <h1 className="font-funnel mb-2 text-4xl font-bold">Links</h1>
      <p className="mb-10 max-w-prose text-gray-500">
        Where to find me, and what I have been reading.
      </p>

      <div className="flex flex-col gap-12">
        {categories.map((category) => {
          const inCategory = links.filter((l) => l.category?.slug === category.slug);
          if (inCategory.length === 0) return null;

          return (
            <section key={category.id}>
              <h2 className="font-funnel mb-1 text-sm font-semibold uppercase tracking-wide text-gray-400">
                {category.name}
              </h2>
              {category.description && (
                <p className="mb-4 text-xs text-gray-400">{category.description}</p>
              )}
              <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                {inCategory.map((link) => (
                  <li key={link.id} className="py-3 first:pt-0">
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3"
                    >
                      {isSocial(link) && (
                        <span className="mt-0.5 shrink-0 opacity-60">
                          <SocialIcon url={link.url} title={link.title} iconKey={link.iconKey} />
                        </span>
                      )}
                      <span className="min-w-0">
                        <span className="text-sm font-medium group-hover:underline">
                          {link.title}
                        </span>
                        {link.description && (
                          <span className="block text-xs text-gray-500">{link.description}</span>
                        )}
                        {link.tags?.length > 0 && (
                          <span className="mt-1 block text-xs text-gray-400">
                            {link.tags.map((t) => t.name).join(", ")}
                          </span>
                        )}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </main>
  );
}
