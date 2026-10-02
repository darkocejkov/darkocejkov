import Highlights from "@/components/Highlights";
import { FlowTitle } from "@/components/flow/Flow";
import { getExperience } from "@/content";
import { Mdx } from "@/content/mdx";
import { formatRange } from "@/lib/dates";

export const metadata = { title: "Experience" };

/** "Moz (STAT Search Analytics)" → ["Moz", "STAT Search Analytics"], so the aside can sit small. */
function splitName(name: string): [string, string | null] {
  const match = name.match(/^(.*?)\s*\((.+)\)$/);
  return match ? [match[1], match[2]] : [name, null];
}

export default function ExperiencePage() {
  const roles = getExperience();

  return (
    <div className="max-w-3xl">
      <FlowTitle className="mb-4">Experience</FlowTitle>
      <p className="mb-24 max-w-prose text-gray-500">Where I&apos;ve worked, and what I did there.</p>

      {roles.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing here yet.</p>
      ) : (
        <ol className="flex flex-col gap-40">
          {roles.map((role) => {
            const [company, aside] = splitName(role.company);
            return (
              <li key={role.slug}>
                <article>
                  <p className="font-mono text-xs lowercase text-gray-500">
                    {[formatRange(role.startDate, role.endDate), role.type, role.isCurrent && "current"]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <h2 className="mt-3 font-funnel text-[clamp(2.75rem,8vw,6rem)] font-extrabold leading-[0.9] tracking-tighter">
                    {role.companyUrl ? (
                      <a href={role.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:text-brand-orange">
                        {company}
                      </a>
                    ) : (
                      company
                    )}
                  </h2>
                  {aside && <p className="mt-2 font-mono text-sm lowercase text-gray-500">{aside}</p>}

                  <p className="mt-6 font-funnel text-[clamp(1.5rem,3.5vw,2.25rem)] font-light leading-tight tracking-tight">
                    {role.title}
                  </p>

                  <Highlights items={role.highlights} />

                  {role.body.trim() && <Mdx source={role.body} className="writeup mt-12 max-w-none" />}

                  {role.skills.length > 0 && (
                    <p className="mt-10 font-mono text-xs lowercase leading-relaxed text-gray-500">
                      {role.skills.map((s) => s.name).join(" / ")}
                    </p>
                  )}
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
