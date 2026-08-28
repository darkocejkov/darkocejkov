import { Suspense } from "react";
import BlogList from "@/components/BlogList";
import {
  strapiGet,
  mediaUrl,
  type StrapiList,
  type Article,
  type Category,
} from "@/lib/strapi";

async function getCategories(): Promise<Category[]> {
  try {
    const res = await strapiGet<StrapiList<Category>>("/categories", { sort: "name:asc" });
    return res.data;
  } catch {
    return [];
  }
}

async function getArticles(): Promise<Article[]> {
  try {
    const res = await strapiGet<StrapiList<Article>>("/articles", {
      sort: "publishedAt:desc",
      "pagination[pageSize]": "100",
      "fields[0]": "title",
      "fields[1]": "slug",
      "fields[2]": "summary",
      "fields[3]": "publishedAt",
      "populate[cover][fields][0]": "url",
      "populate[cover][fields][1]": "alternativeText",
      "populate[category][fields][0]": "name",
      "populate[category][fields][1]": "slug",
      "populate[tags][fields][0]": "name",
      "populate[tags][fields][1]": "slug",
    });
    return res.data;
  } catch {
    return [];
  }
}

export default async function Blog() {
  const [articles, categories] = await Promise.all([getArticles(), getCategories()]);

  // Resolve media URLs server-side so the client component stays free of env config.
  const withCovers = articles.map((a) => ({ ...a, coverUrl: mediaUrl(a.cover) }));

  return (
    <main className="px-8 py-12">
      <h1 className="font-funnel mb-6 text-4xl font-bold">Blog</h1>
      <Suspense fallback={<p className="text-sm text-gray-400">Loading…</p>}>
        <BlogList articles={withCovers} categories={categories} />
      </Suspense>
    </main>
  );
}
