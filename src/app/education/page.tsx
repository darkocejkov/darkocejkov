import { getEducation } from "@/content";
import { FlowTitle } from "@/components/flow/Flow";
import { Mdx } from "@/content/mdx";
import { formatRange } from "@/lib/dates";

export const metadata = { title: "Education" };

export default function EducationPage() {
  const qualifications = getEducation();

  return (
    <div className="max-w-3xl">
      <FlowTitle className="mb-4">Education</FlowTitle>
      <p className="mb-10 max-w-prose text-gray-500">What I studied, and where.</p>

      {qualifications.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing here yet.</p>
      ) : (
        <ol className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {qualifications.map((item) => (
            <li key={item.slug} className="py-8 first:pt-0 last:pb-0">
              <h2 className="font-funnel text-xl font-semibold">{item.title}</h2>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-gray-500">
                <span>{item.institution}</span>
                <span className="text-gray-400">
                  {formatRange(item.startDate, item.endDate)}
                </span>
              </div>

              {item.body.trim() && (
                <div className="mt-4">
                  <Mdx source={item.body} className="prose-sm" />
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
