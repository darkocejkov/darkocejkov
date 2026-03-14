import CourseList from "@/components/CourseList";
import { strapiGet, type StrapiList, type Education } from "@/lib/strapi";

async function getEducation(): Promise<Education[]> {
  try {
    const res = await strapiGet<StrapiList<Education>>("/educations", {
      "sort": "current:desc,startDate:desc",
      "populate[courses][sort]": "name:asc",
    });
    return res.data;
  } catch {
    return [];
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

export default async function Education() {
  const entries = await getEducation();

  return (
    <>
      <main className="px-8 py-12">
        <h1 className="font-funnel mb-10 text-4xl font-bold">Education</h1>
        <ol className="relative flex flex-col gap-10 border-l border-gray-200 pl-8">
          {entries.map((entry) => (
            <li key={entry.id} className="relative">
              <span className="absolute -left-[2.5rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-white" />
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-funnel text-xl font-semibold">{entry.degree}</h2>
                {entry.url ? (
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    {entry.school}
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">{entry.school}</span>
                )}
                {entry.grade != null && entry.gradeScale != null && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    {entry.grade} / {entry.gradeScale}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-gray-400">
                {formatDate(entry.startDate)} —{" "}
                {entry.current ? "Present" : entry.endDate ? formatDate(entry.endDate) : ""}
                {entry.location && ` · ${entry.location}`}
              </p>
              {entry.courses?.length > 0 && <CourseList courses={entry.courses} />}
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
