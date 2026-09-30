"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/**
 * The slice of an article the list renders. The server page projects this
 * from the full Article so the body, skills and graph edges never cross the
 * client boundary. `cover` is resolved to a URL, and its alt is required, so
 * the image never needs a fallback.
 */
export interface BlogListItem {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  draft: boolean;
  category?: string;
  tags: string[];
  cover: { url: string; alt: string } | null;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BlogList({
  articles,
  categories,
}: {
  articles: BlogListItem[];
  categories: string[];
}) {
  const searchParams = useSearchParams();
  const raw = searchParams.get("category") ?? undefined;
  const active = raw && categories.includes(raw) ? raw : undefined;
  const draftsFirst = searchParams.get("sort") === "drafts";

  const filtered = active ? articles.filter((a) => a.category === active) : articles;
  const visible = draftsFirst
    ? [...filtered].sort((a, b) => Number(b.draft) - Number(a.draft))
    : filtered;

  const listHref = (category?: string, sortDrafts = false) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (sortDrafts) params.set("sort", "drafts");
    const query = params.toString();
    return query ? `/brain?${query}` : "/brain";
  };

  const chip = (isActive: boolean) =>
    `rounded-full px-3 py-1 text-sm transition-colors ${
      isActive
        ? "bg-brand-orange text-white"
        : "border border-gray-200 dark:border-gray-700 text-gray-600 hover:border-gray-400"
    }`;

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <Link href={listHref(undefined, draftsFirst)} className={chip(!active)}>
            All
          </Link>
          {categories.map((cat) => (
            <Link key={cat} href={listHref(cat, draftsFirst)} className={chip(active === cat)}>
              {cat}
            </Link>
          ))}
        </div>
        {articles.some((article) => article.draft) && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Sort:</span>
            <Link href={listHref(active)} className={chip(!draftsFirst)} aria-current={!draftsFirst ? "page" : undefined}>
              Newest
            </Link>
            <Link href={listHref(active, true)} className={chip(draftsFirst)} aria-current={draftsFirst ? "page" : undefined}>
              Drafts first
            </Link>
          </div>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-gray-400">No posts yet.</p>
      ) : (
        <ol className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {visible.map((article) => (
            <li key={article.slug} className="py-6 first:pt-0 last:pb-0">
              <Link href={`/brain/${article.slug}`} className="group flex gap-4 items-start">
                {article.cover && (
                  <div className="shrink-0 w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.cover.url}
                      alt={article.cover.alt}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  {(article.category || article.draft) && (
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      {article.category && (
                      <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
                        {article.category}
                      </span>
                      )}
                      {article.draft && (
                        <span className="rounded-full border border-brand-orange/50 px-2 py-0.5 text-xs font-medium text-brand-orange">
                          Draft
                        </span>
                      )}
                    </div>
                  )}
                  <h2 className="font-funnel text-xl font-semibold group-hover:underline">
                    {article.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{article.summary}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span>{formatDate(article.publishedAt)}</span>
                    {article.tags.length > 0 && <span>{article.tags.join(", ")}</span>}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
