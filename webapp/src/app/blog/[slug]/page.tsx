import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Header from "@/components/Header";
import { strapiGet, type StrapiList, type BlogPostFull, type BlogCategory } from "@/lib/strapi";

const categoryLabel: Record<BlogCategory, string> = {
  general:    "General",
  technology: "Technology",
  project:    "Project",
  design:     "Design",
  career:     "Career",
  personal:   "Personal",
};

async function getPost(slug: string): Promise<BlogPostFull | null> {
  try {
    const res = await strapiGet<StrapiList<BlogPostFull>>("/blog-posts", {
      "filters[slug][$eq]": slug,
      "populate[coverImage]": "true",
    });
    return res.data[0] ?? null;
  } catch {
    return null;
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

  return (
    <>
      <Header />
      <main className="px-8 py-12">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/blog"
            className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 inline-block"
          >
            ← Back to Blog
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
              {categoryLabel[post.category]}
            </span>
            {post.featured && (
              <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs text-yellow-600 border border-yellow-200">
                Featured
              </span>
            )}
          </div>

          <h1 className="font-funnel text-4xl font-bold leading-tight mb-3">{post.title}</h1>

          <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
            <span>{formatDate(post.publishedAt)}</span>
            {post.readingTime && <span>{post.readingTime} min read</span>}
            {post.tags && post.tags.length > 0 && (
              <span>{post.tags.join(", ")}</span>
            )}
          </div>

          {post.coverImage && (
            <img
              src={`${CMS_URL}${post.coverImage.url}`}
              alt={post.coverImage.alternativeText ?? post.title}
              width={post.coverImage.width}
              height={post.coverImage.height}
              className="w-full rounded-lg mb-10 object-cover max-h-80"
            />
          )}

          <article className="prose prose-gray max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </article>
        </div>
      </main>
    </>
  );
}
