import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import { strapiGet, type StrapiList, type BlogPost, type BlogCategory } from "@/lib/strapi";

const categoryLabel: Record<BlogCategory, string> = {
  general:    "General",
  technology: "Technology",
  project:    "Project",
  design:     "Design",
  career:     "Career",
  personal:   "Personal",
};

const ALL_CATEGORIES = Object.keys(categoryLabel) as BlogCategory[];

async function getPosts(category?: BlogCategory): Promise<BlogPost[]> {
  try {
    const params: Record<string, string> = {
      "sort": "featured:desc,publishedAt:desc",
      "pagination[pageSize]": "100",
      "fields[0]": "title",
      "fields[1]": "slug",
      "fields[2]": "excerpt",
      "fields[3]": "category",
      "fields[4]": "tags",
      "fields[5]": "featured",
      "fields[6]": "readingTime",
      "fields[7]": "publishedAt",
      "populate[coverImage]": "true",
    };
    if (category) params["filters[category][$eq]"] = category;
    const res = await strapiGet<StrapiList<BlogPost>>("/blog-posts", params);
    return res.data;
  } catch {
    return [];
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: rawCategory } = await searchParams;
  const activeCategory = ALL_CATEGORIES.includes(rawCategory as BlogCategory)
    ? (rawCategory as BlogCategory)
    : undefined;

  const posts = await getPosts(activeCategory);

  return (
    <>
      <Header />
      <main className="px-8 py-12">
        <h1 className="font-funnel mb-6 text-4xl font-bold">Blog</h1>

        {/* Category filter */}
        <div className="mb-10 flex flex-wrap gap-2">
          <Link
            href="/blog"
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              !activeCategory
                ? "bg-gray-900 text-white"
                : "border border-gray-200 text-gray-600 hover:border-gray-400"
            }`}
          >
            All
          </Link>
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/blog?category=${cat}`}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                activeCategory === cat
                  ? "bg-gray-900 text-white"
                  : "border border-gray-200 text-gray-600 hover:border-gray-400"
              }`}
            >
              {categoryLabel[cat]}
            </Link>
          ))}
        </div>

        {posts.length === 0 ? (
          <p className="text-sm text-gray-400">No posts yet.</p>
        ) : (
          <ol className="flex flex-col divide-y divide-gray-100">
            {posts.map((post) => (
              <li key={post.id} className="py-6 first:pt-0 last:pb-0">
                <Link href={`/blog/${post.slug}`} className="group flex gap-4 items-start">
                  {post.coverImage && (
                    <div className="shrink-0 w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={`${process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337"}${post.coverImage.url}`}
                        alt={post.coverImage.alternativeText ?? post.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                        {categoryLabel[post.category]}
                      </span>
                      {post.featured && (
                        <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-xs text-yellow-600 border border-yellow-200">
                          Featured
                        </span>
                      )}
                    </div>
                    <h2 className="font-funnel text-xl font-semibold group-hover:underline">
                      {post.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span>{formatDate(post.publishedAt)}</span>
                      {post.readingTime && <span>{post.readingTime} min read</span>}
                      {post.tags && post.tags.length > 0 && (
                        <span>{post.tags.join(", ")}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </main>
    </>
  );
}
