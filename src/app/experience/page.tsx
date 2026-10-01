import { getExperience } from "@/content";
import { FlowTitle } from "@/components/flow/Flow";
import { Mdx } from "@/content/mdx";
import { formatRange } from "@/lib/dates";

export const metadata = { title: "Experience" };

const typeLabel: Record<string, string> = {
  internship: "Internship",
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
};

export default function ExperiencePage() {
  const roles = getExperience();

  return (
    <div className="max-w-3xl">
      <FlowTitle className="mb-4">Experience</FlowTitle>
      <p className="mb-10 max-w-prose text-gray-500">Where I&apos;ve worked, and what I did there.</p>

      {roles.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing here yet.</p>
      ) : (
        <ol className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {roles.map((role) => (
            <li key={role.slug} className="py-8 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 className="font-funnel text-xl font-semibold">{role.title}</h2>
                {role.isCurrent && (
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                    Current
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-gray-500">
                {role.companyUrl ? (
                  <a
                    href={role.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-2"
                  >
                    {role.company}
                  </a>
                ) : (
                  <span>{role.company}</span>
                )}
                <span className="text-gray-400">
                  {formatRange(role.startDate, role.endDate)}
                </span>
                {role.type && (
                  <span className="text-gray-400">{typeLabel[role.type] ?? role.type}</span>
                )}
              </div>

              {role.skills.length > 0 && (
                <p className="mt-2 text-xs text-gray-400">
                  {role.skills.map((s) => s.name).join(", ")}
                </p>
              )}

              {role.body.trim() && (
                <div className="mt-4">
                  <Mdx source={role.body} className="prose-sm" />
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
