import JobDescription from "@/components/JobDescription";
import { strapiGet, type StrapiList, type Experience } from "@/lib/strapi";

async function getExperiences(): Promise<Experience[]> {
  try {
    const res = await strapiGet<StrapiList<Experience>>("/experiences", {
      sort: "startDate:desc",
      "populate[highlights]": "true",
      "populate[skills][fields][0]": "name",
    });
    return res.data;
  } catch {
    return [];
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default async function Career() {
  const experiences = await getExperiences();

  return (
    <main className="px-8 py-12">
      <h1 className="font-funnel mb-10 text-4xl font-bold">Career</h1>
      <ol className="relative flex flex-col gap-10 border-l border-gray-200 dark:border-gray-800 pl-8">
        {experiences.map((exp) => (
          <li key={exp.id} className="relative">
            <span
              className={`absolute -left-[2.5rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 ${
                exp.current
                  ? "bg-slate-900 dark:bg-brand-white"
                  : "bg-white dark:bg-brand-dark"
              }`}
            />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-funnel text-xl font-semibold">{exp.role}</h2>
              <span className="text-sm text-gray-500">{exp.organization}</span>
            </div>
            <p className="mt-0.5 text-sm text-gray-400">
              {formatDate(exp.startDate)} —{" "}
              {exp.current ? "Present" : exp.endDate ? formatDate(exp.endDate) : ""}
              {exp.location && ` · ${exp.location}`}
            </p>
            {exp.summary && <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{exp.summary}</p>}
            {exp.skills?.length > 0 && (
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {exp.skills.map((skill) => (
                  <li
                    key={skill.id}
                    className="rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs text-gray-500"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            )}
            <JobDescription highlights={exp.highlights ?? []} />
          </li>
        ))}
      </ol>
    </main>
  );
}
