"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Article, ArticleCategory } from "@/lib/strapi";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogList({
  articles,
  categories,
}: {
  articles: (Article & { coverUrl: string | null })[];
  categories: ArticleCategory[];
}) {
  const searchParams = useSearchParams();
  const raw = searchParams.get("category") ?? undefined;
  const active = categories.some((c) => c.slug === raw) ? raw : undefined;

  const visible = active
    ? articles.filter((a) => a.category?.slug === active)
    : articles;

  const chip = (isActive: boolean) =>
    `rounded-full px-3 py-1 text-sm transition-colors ${
      isActive
        ? "bg-brand-orange text-white"
        : "border border-gray-200 dark:border-gray-700 text-gray-600 hover:border-gray-400"
    }`;

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2">
        <Link href="/blog" className={chip(!active)}>
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/blog?category=${cat.slug}`}
            className={chip(active === cat.slug)}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-gray-400">No posts yet.</p>
      ) : (
        <ol className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {visible.map((article) => (
            <li key={article.id} className="py-6 first:pt-0 last:pb-0">
              <Link href={`/blog/${article.slug}`} className="group flex gap-4 items-start">
                {article.coverUrl && (
                  <div className="shrink-0 w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.coverUrl}
                      alt={article.cover?.alternativeText ?? article.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  {article.category && (
                    <div className="mb-1">
                      <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
                        {article.category.name}
                      </span>
                    </div>
                  )}
                  <h2 className="font-funnel text-xl font-semibold group-hover:underline">
                    {article.title}
                  </h2>
                  {article.summary && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{article.summary}</p>
                  )}
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span>{formatDate(article.publishedAt)}</span>
                    {article.tags?.length > 0 && (
                      <span>{article.tags.map((t) => t.name).join(", ")}</span>
                    )}
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
