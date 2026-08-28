import { notFound } from "next/navigation";
import Link from "next/link";
import RichText from "@/components/RichText";
import {
  strapiGet,
  mediaUrl,
  readingTime,
  type StrapiList,
  type ArticleFull,
} from "@/lib/strapi";

async function getArticle(slug: string): Promise<ArticleFull | null> {
  try {
    const res = await strapiGet<StrapiList<ArticleFull>>("/articles", {
      "filters[slug][$eq]": slug,
      "populate[cover]": "true",
      "populate[category][fields][0]": "name",
      "populate[tags][fields][0]": "name",
      "populate[tags][fields][1]": "slug",
      // The knowledge-graph edges: outgoing links, and pages that link here.
      "populate[related][fields][0]": "title",
      "populate[related][fields][1]": "slug",
      "populate[related][fields][2]": "summary",
      "populate[backlinks][fields][0]": "title",
      "populate[backlinks][fields][1]": "slug",
      "populate[backlinks][fields][2]": "summary",
    });
    return res.data[0] ?? null;
  } catch {
    return null;
  }
}

/**
 * Prerender every article at build time. Without this the route is rendered on
 * demand, which would mean each visitor's request reaching the CMS directly.
 */
export async function generateStaticParams() {
  try {
    const res = await strapiGet<StrapiList<{ slug: string }>>("/articles", {
      "fields[0]": "slug",
      "pagination[pageSize]": "100",
    });
    return res.data.map((a) => ({ slug: a.slug }));
  } catch {
    return [];
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ArticleLinkList({
  heading,
  note,
  items,
}: {
  heading: string;
  note: string;
  items: { id: number; title: string; slug: string; summary: string | null }[];
}) {
  if (!items?.length) return null;
  return (
    <section className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-6">
      <h2 className="font-funnel text-sm font-semibold uppercase tracking-wide text-gray-400">
        {heading}
      </h2>
      <p className="mt-1 text-xs text-gray-400">{note}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/blog/${item.slug}`} className="group block">
              <span className="text-sm font-medium group-hover:underline">{item.title}</span>
              {item.summary && (
                <span className="block text-xs text-gray-500 line-clamp-1">{item.summary}</span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  const cover = mediaUrl(article.cover);
  const minutes = readingTime(article.body);

  return (
    <main className="px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/blog"
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        {article.category && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
              {article.category.name}
            </span>
          </div>
        )}

        <h1 className="font-funnel text-4xl font-bold leading-tight mb-3">{article.title}</h1>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
          <span>{formatDate(article.publishedAt)}</span>
          {minutes && <span>{minutes} min read</span>}
          {article.tags?.length > 0 && <span>{article.tags.map((t) => t.name).join(", ")}</span>}
        </div>

        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={article.cover?.alternativeText ?? article.title}
            width={article.cover?.width}
            height={article.cover?.height}
            className="w-full rounded-lg mb-10 object-cover max-h-80"
          />
        )}

        <RichText content={article.body} />

        <ArticleLinkList
          heading="Related"
          note="Pages this one links out to."
          items={article.related ?? []}
        />
        <ArticleLinkList
          heading="Linked from"
          note="Pages that link here — collected automatically."
          items={article.backlinks ?? []}
        />
      </div>
    </main>
  );
}
