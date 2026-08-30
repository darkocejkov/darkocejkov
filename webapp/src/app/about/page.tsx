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
    title: about ? `About — ${about.displayName}` : "About",
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

export default async function AboutPage() {
  const about = await getAbout();
  if (!about) {
    return (
      <main className="px-8 py-12">
        <p className="text-sm text-gray-400">Nothing here yet.</p>
      </main>
    );
  }

  const portrait = mediaUrl(about.portrait);

  return (
    <main className="px-8 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="flex flex-wrap items-start gap-6">
          {portrait && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portrait}
              alt={about.portrait?.alternativeText ?? about.displayName}
              width={120}
              height={120}
              className="rounded-lg object-cover"
            />
          )}
          <div className="min-w-0">
            <h1 className="font-funnel text-4xl font-bold leading-tight">{about.displayName}</h1>
            {about.pronouns && <p className="text-sm text-gray-400">{about.pronouns}</p>}
            {about.headline && <p className="mt-1 text-gray-500">{about.headline}</p>}
          </div>
        </div>

        <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-gray-100 dark:border-gray-800 py-4">
          <Fact label="Location" value={about.location} />
          <Fact label="Currently" value={about.currently} />
          <Fact label="Status" value={about.lookingForWork ? "Open to work" : null} />
        </dl>

        <div className="mt-8">
          <RichText content={about.bio} />
        </div>

        {Array.isArray(about.statement) && about.statement.length > 0 && (
          <section className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-6">
            <h2 className="font-funnel mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Statement
            </h2>
            <RichText content={about.statement} />
          </section>
        )}

        {about.email && (
          <p className="mt-12 text-sm">
            <a href={`mailto:${about.email}`} className="underline underline-offset-2">
              {about.email}
            </a>
          </p>
        )}
      </div>
    </main>
  );
}
