import { Suspense } from "react";
import BlogList, { type BlogListItem } from "@/components/BlogList";
import { assetUrl, getArticles, getArticlesPage } from "@/content";
import { Mdx } from "@/content/mdx";

export default function Blog() {
  const page = getArticlesPage();
  const articles = getArticles();

  // Categories are implicit — the set actually in use, alphabetised.
  const categories = [...new Set(articles.flatMap((a) => (a.category ? [a.category] : [])))].sort();

  // Project only what the list renders. BlogList is a client component, so
  // anything passed here is serialised into the page; spreading the whole
  // Article would ship every body, skill description and graph edge for a
  // view that shows none of them. Media URLs are resolved here so the client
  // component stays free of env config.
  //
  // The annotation sits on the callback's return type, not on `items`. An
  // object literal inside a `.map` is inferred and then assignability-checked,
  // which lets a stray extra property through; annotating the return position
  // makes it a fresh literal check, so adding `body: a.body` is a TS2353.
  const items = articles.map((a): BlogListItem => ({
    slug: a.slug,
    title: a.title,
    summary: a.summary,
    publishedAt: a.publishedAt,
    draft: a.draft,
    category: a.category,
    tags: a.tags,
    cover: a.cover ? { url: assetUrl(a.cover.src), alt: a.cover.alt } : null,
  }));

  return (
    <div>
      <header className="mb-8">
        <h1 className="font-funnel text-4xl font-bold">{page.title}</h1>
        <p className="mt-2 text-gray-500">{page.subtitle}</p>
        <Mdx source={page.description} className="mt-3 prose-sm text-gray-500" />
      </header>
      <Suspense fallback={<p className="text-sm text-gray-400">Loading…</p>}>
        <BlogList articles={items} categories={categories} />
      </Suspense>
    </div>
  );
}
