import Highlights from "@/components/Highlights";
import { FlowTitle } from "@/components/flow/Flow";
import { getEducation } from "@/content";
import { Mdx } from "@/content/mdx";
import { formatRange } from "@/lib/dates";

export const metadata = { title: "Education" };

/** "Honours BSc …: … Stream" → degree and stream, so the stream can sit smaller. */
function splitTitle(title: string): [string, string | null] {
  const at = title.indexOf(":");
  return at === -1 ? [title, null] : [title.slice(0, at).trim(), title.slice(at + 1).trim()];
}

export default function EducationPage() {
  const qualifications = getEducation();

  return (
    <div className="max-w-3xl">
      <FlowTitle className="mb-4">Education</FlowTitle>
      <p className="mb-24 max-w-prose text-gray-500">What I studied, and where.</p>

      {qualifications.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing here yet.</p>
      ) : (
        <ol className="flex flex-col gap-40">
          {qualifications.map((item) => {
            const [degree, stream] = splitTitle(item.title);
            return (
              <li key={item.slug}>
                <article>
                  <p className="font-mono text-xs lowercase text-gray-500">
                    {formatRange(item.startDate, item.endDate)}
                  </p>

                  <h2 className="mt-3 font-funnel text-[clamp(2.75rem,8vw,6rem)] font-extrabold leading-[0.9] tracking-tighter">
                    {item.institution}
                  </h2>

                  <p className="mt-6 font-funnel text-[clamp(1.5rem,3.5vw,2.25rem)] font-light leading-tight tracking-tight">
                    {degree}
                  </p>
                  {stream && <p className="mt-2 font-mono text-sm lowercase text-gray-500">{stream}</p>}

                  <Highlights items={item.highlights} />

                  {item.body.trim() && <Mdx source={item.body} className="writeup mt-12 max-w-none" />}
                </article>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
