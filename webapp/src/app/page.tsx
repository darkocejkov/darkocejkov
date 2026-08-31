import RichText from "@/components/RichText";
import { strapiGet, mediaUrl, type StrapiSingle, type About } from "@/lib/strapi";

async function getAbout(): Promise<About | null> {
  try {
    const res = await strapiGet<StrapiSingle<About>>("/about", { populate: "portrait" });
    return res.data;
  } catch {
    return null;
  }
}

export async function generateMetadata() {
  const about = await getAbout();
  return {
    title: about?.displayName ?? "Darko Cejkov",
    description: about?.metaDescription ?? undefined,
  };
}

function Fact({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export default async function Home() {
  const about = await getAbout();
  if (!about) return <main className="flex-1 px-8 py-12" />;

  const portrait = mediaUrl(about.portrait);
  const hasStatement = Array.isArray(about.statement) && about.statement.length > 0;

  return (
    <main className="flex-1 px-8 py-12">
      <div className="max-w-2xl">
        <div className="flex flex-wrap items-start gap-6">
          {portrait && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portrait}
              alt={about.portrait?.alternativeText ?? about.displayName}
              width={96}
              height={96}
              className="rounded-lg object-cover"
            />
          )}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-funnel text-5xl font-bold leading-tight">
                {about.displayName}
              </h1>
              {about.lookingForWork && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Open to work
                </span>
              )}
            </div>
            {about.pronouns && <p className="mt-1 text-sm text-gray-400">{about.pronouns}</p>}
            {about.headline && <p className="mt-1 text-gray-500">{about.headline}</p>}
          </div>
        </div>

        {about.shortBio && (
          <p className="mt-8 text-gray-600 dark:text-gray-400">{about.shortBio}</p>
        )}

        <div className="mt-6">
          <RichText content={about.bio} />
        </div>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-gray-100 dark:border-gray-800 py-4">
          <Fact label="Location" value={about.location} />
          <Fact label="Currently" value={about.currently} />
        </dl>

        {hasStatement && (
          <section className="mt-10">
            <h2 className="font-funnel mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Statement
            </h2>
            <RichText content={about.statement} />
          </section>
        )}

        {about.email && (
          <p className="mt-10 text-sm">
            <a href={`mailto:${about.email}`} className="underline underline-offset-2">
              {about.email}
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
