import { notFound } from "next/navigation";
import Link from "next/link";
import { assetUrl, getArticle, getArticles, type ArticleRef } from "@/content";
import { Mdx } from "@/content/mdx";

/**
 * Prerender every article at build time. Not the end of it, though: the
 * maintenance banner puts every route on ISR, so a page re-renders on the
 * server after its revalidation window and reads content/ off disk again.
 * That is why next.config.ts needs outputFileTracingIncludes as well as
 * outputFileTracingRoot — see the comment there.
 */
export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function ArticleLinkList({
  heading,
  note,
  items,
}: {
  heading: string;
  note: string;
  items: ArticleRef[];
}) {
  if (!items.length) return null;
  return (
    <section className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-6">
      <h2 className="font-funnel text-sm font-semibold uppercase tracking-wide text-gray-400">
        {heading}
      </h2>
      <p className="mt-1 text-xs text-gray-400">{note}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/blog/${item.slug}`} className="group block">
              <span className="text-sm font-medium group-hover:underline">{item.title}</span>
              <span className="block text-xs text-gray-500 line-clamp-1">{item.summary}</span>
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
  const article = getArticle(slug);
  if (!article) notFound();

  const cover = article.cover;

  return (
    <div>
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
              {article.category}
            </span>
          </div>
        )}

        <h1 className="font-funnel text-4xl font-bold leading-tight mb-3">{article.title}</h1>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
          <span>{formatDate(article.publishedAt)}</span>
          {article.minutes && <span>{article.minutes} min read</span>}
          {article.tags.length > 0 && <span>{article.tags.join(", ")}</span>}
        </div>

        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assetUrl(cover.src)}
            alt={cover.alt}
            className="w-full rounded-lg mb-10 object-cover max-h-80"
          />
        )}

        <Mdx source={article.body} />

        <ArticleLinkList
          heading="Related"
          note="Pages this one links out to."
          items={article.related}
        />
        <ArticleLinkList
          heading="Linked from"
          note="Pages that link here — collected automatically."
          items={article.backlinks}
        />
      </div>
    </div>
  );
}
