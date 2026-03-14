import Header from "@/components/Header";
import Markdown from "@/components/Markdown";
import JobDescription from "@/components/JobDescription";
import { strapiGet, type StrapiList, type Job } from "@/lib/strapi";

async function getJobs(): Promise<Job[]> {
  try {
    const res = await strapiGet<StrapiList<Job>>("/jobs", {
      "sort": "current:desc,startDate:desc",
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

const typeLabel: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  internship: "Internship",
};

export default async function Career() {
  const jobs = await getJobs();

  return (
    <>
      <Header />
      <main className="px-8 py-12">
        <h1 className="font-funnel mb-10 text-4xl font-bold">Career</h1>
        <ol className="relative flex flex-col gap-10 border-l border-gray-200 pl-8">
          {jobs.map((job) => (
            <li key={job.id} className="relative">
              {job.current ? (
                <span className="absolute F top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-slate-900" />
              )
              : (
                <span className="absolute -left-[2.5rem] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 bg-white" />
              )}
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h2 className="font-funnel text-xl font-semibold">{job.title}</h2>
                {job.url ? (
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:underline"
                  >
                    {job.company}
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">{job.company}</span>
                )}
                {job.type && (
                  <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                    {typeLabel[job.type]}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm text-gray-400">
                {formatDate(job.startDate)} —{" "}
                {job.current ? "Present" : job.endDate ? formatDate(job.endDate) : ""}
                {job.location && ` · ${job.location}`}
              </p>
              {job.summary && (
                <div className="mt-3">
                  <Markdown>{job.summary}</Markdown>
                </div>
              )}
              {job.description && <JobDescription description={job.description} />}
            </li>
          ))}
        </ol>
      </main>
    </>
  );
}
