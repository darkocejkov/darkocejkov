import { notFound } from "next/navigation";
import Link from "next/link";
import { FlowTitle } from "@/components/flow/Flow";
import { assetUrl, getProject, getProjects } from "@/content";
import { Embed, Gallery, Mdx } from "@/content/mdx";

/**
 * Prerender every project at build time. Not the end of it, though: the
 * maintenance banner puts every route on ISR, so a page re-renders on the
 * server after its revalidation window and reads content/ off disk again.
 * That is why next.config.ts needs outputFileTracingIncludes — see the
 * comment there.
 */
export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
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
  const project = getProject(slug);
  if (!project) notFound();

  const cover = project.cover;

  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <Link
          href="/projects"
          className="mb-8 inline-block text-sm text-gray-400 transition-colors hover:text-gray-700"
        >
          ← Back to Projects
        </Link>

        <FlowTitle>{project.title}</FlowTitle>
        <p className="mt-2 text-gray-500">{project.summary}</p>

        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-gray-100 dark:border-gray-800 py-4">
          <Meta label="Year" value={project.year} />
          <Meta label="Type" value={project.type} />
          <Meta label="Stage" value={project.stage ? stageLabel[project.stage] : null} />
          <Meta label="Made with" value={project.materials} />
          <Meta label="Tools" value={project.skills.map((s) => s.name).join(", ") || null} />
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
            src={assetUrl(cover.src)}
            alt={cover.alt}
            className="mt-10 w-full rounded-lg object-cover"
          />
        )}

        <div className="mt-10">
          <Mdx source={project.body} />
        </div>

        {project.embedUrl && <Embed url={project.embedUrl} title={`${project.title} embed`} />}

        {project.gallery.length > 0 && (
          <div className="mt-10">
            <Gallery images={project.gallery} />
          </div>
        )}

        {project.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs text-gray-500"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {project.articles.length > 0 && (
          <section className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-6">
            <h2 className="font-funnel text-sm font-semibold uppercase tracking-wide text-gray-400">
              Written about
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {project.articles.map((article) => (
                <li key={article.slug}>
                  <Link href={`/brain/${article.slug}`} className="group block">
                    <span className="text-sm font-medium group-hover:underline">{article.title}</span>
                    <span className="block text-xs text-gray-500 line-clamp-1">{article.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
