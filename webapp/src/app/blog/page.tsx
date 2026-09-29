import { Suspense } from "react";
import BlogList, { type BlogListItem } from "@/components/BlogList";
import { assetUrl, getArticles } from "@/content";

export default function Blog() {
  const articles = getArticles();

  // Categories are implicit — the set actually in use, alphabetised.
  const categories = [...new Set(articles.flatMap((a) => (a.category ? [a.category] : [])))].sort();

  // Project only what the list renders. BlogList is a client component, so
  // anything passed here is serialised into the page; spreading the whole
  // Article would ship every body, skill description and graph edge for a
  // view that shows none of them. Media URLs are resolved here so the client
  // component stays free of env config.
  const items: BlogListItem[] = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    publishedAt: a.publishedAt,
    category: a.category,
    tags: a.tags,
    cover: a.cover ? { url: assetUrl(a.cover.src), alt: a.cover.alt } : null,
  }));

  return (
    <div>
      <h1 className="font-funnel mb-6 text-4xl font-bold">Blog</h1>
      <Suspense fallback={<p className="text-sm text-gray-400">Loading…</p>}>
        <BlogList articles={items} categories={categories} />
      </Suspense>
    </div>
  );
}
