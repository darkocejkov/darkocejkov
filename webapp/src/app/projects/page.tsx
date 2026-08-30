import Link from "next/link";
import { strapiGet, mediaUrl, type StrapiList, type Project } from "@/lib/strapi";

async function getProjects(): Promise<Project[]> {
  try {
    const res = await strapiGet<StrapiList<Project>>("/projects", {
      // Curated order first, newest work next — `featured` pins the highlights.
      sort: "featured:desc,order:asc,startDate:desc",
      "pagination[pageSize]": "100",
      "populate[cover][fields][0]": "url",
      "populate[cover][fields][1]": "alternativeText",
      "populate[tags][fields][0]": "name",
      "populate[skills][fields][0]": "name",
    });
    return res.data;
  } catch {
    return [];
  }
}

const stageLabel: Record<string, string> = {
  concept: "Concept",
  "in-progress": "In progress",
  shipped: "Shipped",
  archived: "Archived",
};

export default async function Projects() {
  const projects = await getProjects();

  return (
    <main className="px-8 py-12">
      <h1 className="font-funnel mb-2 text-4xl font-bold">Work</h1>
      <p className="mb-10 max-w-prose text-gray-500">
        Software, objects, and things that fall between.
      </p>

      {projects.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing here yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const cover = mediaUrl(project.cover);
            return (
              <li key={project.id} className="group">
                <Link href={`/projects/${project.slug}`} className="flex flex-col gap-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-brand-dark/5 dark:bg-brand-white/5">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={project.cover?.alternativeText ?? project.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        no image
                      </div>
                    )}
                    {project.featured && (
                      <span className="absolute left-2 top-2 rounded-full bg-brand-orange px-2 py-0.5 text-xs text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h2 className="font-funnel text-lg font-semibold group-hover:underline">
                        {project.title}
                      </h2>
                      {project.year && <span className="text-xs text-gray-400">{project.year}</span>}
                    </div>
                    {project.summary && (
                      <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.summary}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      {project.stage && <span>{stageLabel[project.stage] ?? project.stage}</span>}
                      {project.materials && <span>· {project.materials}</span>}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
