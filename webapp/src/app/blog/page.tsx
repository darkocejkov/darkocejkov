import { Suspense } from "react";
import BlogList from "@/components/BlogList";
import { assetUrl, getArticles } from "@/content";

export default function Blog() {
  const articles = getArticles();

  // Categories are implicit — the set actually in use, alphabetised.
  const categories = [...new Set(articles.flatMap((a) => (a.category ? [a.category] : [])))].sort();

  // Resolve media URLs server-side so the client component stays free of env config.
  const withCovers = articles.map((a) => ({
    ...a,
    coverUrl: a.cover ? assetUrl(a.cover.src) : null,
  }));

  return (
    <div>
      <h1 className="font-funnel mb-6 text-4xl font-bold">Blog</h1>
      <Suspense fallback={<p className="text-sm text-gray-400">Loading…</p>}>
        <BlogList articles={withCovers} categories={categories} />
      </Suspense>
    </div>
  );
}
