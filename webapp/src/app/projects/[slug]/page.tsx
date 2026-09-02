import { notFound } from "next/navigation";
import Link from "next/link";
import RichText from "@/components/RichText";
import {
  strapiGet,
  mediaUrl,
  type StrapiList,
  type ProjectFull,
} from "@/lib/strapi";

export async function generateStaticParams() {
  try {
    const res = await strapiGet<StrapiList<{ slug: string }>>("/projects", {
      "fields[0]": "slug",
      "pagination[pageSize]": "100",
    });
    return res.data.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

async function getProject(slug: string): Promise<ProjectFull | null> {
  try {
    const res = await strapiGet<StrapiList<ProjectFull>>("/projects", {
      "filters[slug][$eq]": slug,
      "populate[cover]": "true",
      "populate[gallery][populate]": "image",
      "populate[tags][fields][0]": "name",
      "populate[skills][fields][0]": "name",
      "populate[type][fields][0]": "name",
      "populate[articles][fields][0]": "title",
      "populate[articles][fields][1]": "slug",
      "populate[articles][fields][2]": "summary",
    });
    return res.data[0] ?? null;
  } catch {
    return null;
  }
}

const stageLabel: Record<string, string> = {
  concept: "Concept",
  "in-progress": "In progress",
  shipped: "Shipped",
  archived: "Archived",
};

function Meta({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const cover = mediaUrl(project.cover);

  return (
    <main className="px-8 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/projects"
          className="mb-8 inline-block text-sm text-gray-400 transition-colors hover:text-gray-700"
        >
          ← Back to Work
        </Link>

        <h1 className="font-funnel text-4xl font-bold leading-tight">{project.title}</h1>
        {project.summary && <p className="mt-2 text-gray-500">{project.summary}</p>}

        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-gray-100 dark:border-gray-800 py-4">
          <Meta label="Year" value={project.year} />
          <Meta label="Type" value={project.type?.name} />
          <Meta label="Stage" value={project.stage ? stageLabel[project.stage] : null} />
          <Meta label="Made with" value={project.materials} />
          <Meta
            label="Tools"
            value={project.skills?.map((s) => s.name).join(", ") || null}
          />
        </dl>

        {(project.repoUrl || project.liveUrl) && (
          <div className="mt-4 flex gap-4 text-sm">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="underline">
                View live
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="underline">
                Source
              </a>
            )}
          </div>
        )}

        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={project.cover?.alternativeText ?? project.title}
            className="mt-10 w-full rounded-lg object-cover"
          />
        )}

        <div className="mt-10">
          <RichText content={project.body} />
        </div>

        {project.embedUrl && (
          <div className="mt-10 aspect-video w-full overflow-hidden rounded-lg bg-brand-dark/5 dark:bg-brand-white/5">
            <iframe
              src={project.embedUrl}
              title={`${project.title} embed`}
              className="h-full w-full"
              loading="lazy"
              // The CMS stores a URL, never markup, so nothing here can inject
              // script into the page. Sandboxed as a further precaution.
              sandbox="allow-scripts allow-same-origin allow-presentation"
              allowFullScreen
            />
          </div>
        )}

        {project.gallery?.length > 0 && (
          <ul className="mt-10 flex flex-col gap-8">
            {project.gallery.map((item) => {
              const src = mediaUrl(item.image);
              if (!src) return null;
              return (
                <li key={item.id}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={src}
                    alt={item.caption ?? item.image?.alternativeText ?? ""}
                    className="w-full rounded-lg"
                  />
                  {item.caption && (
                    <p className="mt-2 text-xs text-gray-400">{item.caption}</p>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {project.tags?.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag.id}
                className="rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs text-gray-500"
              >
                {tag.name}
              </li>
            ))}
          </ul>
        )}

        {project.articles?.length > 0 && (
          <section className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-6">
            <h2 className="font-funnel text-sm font-semibold uppercase tracking-wide text-gray-400">
              Written about
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {project.articles.map((article) => (
                <li key={article.id}>
                  <Link href={`/blog/${article.slug}`} className="group block">
                    <span className="text-sm font-medium group-hover:underline">{article.title}</span>
                    {article.summary && (
                      <span className="block text-xs text-gray-500 line-clamp-1">{article.summary}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </main>
  );
}
