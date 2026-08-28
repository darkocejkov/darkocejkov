import CourseList from "@/components/CourseList";
import { strapiGet, type StrapiList, type Education } from "@/lib/strapi";

async function getEducation(): Promise<Education[]> {
  try {
    const res = await strapiGet<StrapiList<Education>>("/educations", {
      sort: "startDate:desc",
      "populate[courses][sort]": "name:asc",
      "populate[skills][fields][0]": "name",
    });
    return res.data;
  } catch {
    return [];
  }
}

function formatDate(date: string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default async function EducationPage() {
  const entries = await getEducation();

  return (
    <main className="px-8 py-12">
      <h1 className="font-funnel mb-10 text-4xl font-bold">Education</h1>
      <ol className="relative flex flex-col gap-10 border-l border-gray-200 dark:border-gray-800 pl-8">
        {entries.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute -left-[2.5rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-white dark:bg-brand-dark" />
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="font-funnel text-xl font-semibold">{entry.title}</h2>
              <span className="text-sm text-gray-500">{entry.institution}</span>
            </div>
            <p className="mt-0.5 text-sm text-gray-400">
              {formatDate(entry.startDate)} —{" "}
              {/* No `current` field on Education, so an absent end date reads as ongoing. */}
              {entry.endDate ? formatDate(entry.endDate) : "Present"}
            </p>
            {entry.summary && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{entry.summary}</p>
            )}
            {entry.courses?.length > 0 && <CourseList courses={entry.courses} />}
          </li>
        ))}
      </ol>
    </main>
  );
}
