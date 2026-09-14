import RichText from "@/components/RichText";
import SocialIcon from "@/components/SocialIcon";
import {
  mediaUrl,
  strapiGet,
  type About,
  type Download,
  type SiteLink,
  type StrapiList,
  type StrapiSingle,
} from "@/lib/strapi";

async function getAbout(): Promise<About | null> {
  try {
    const res = await strapiGet<StrapiSingle<About>>("/about", { populate: "portrait" });
    return res.data;
  } catch {
    return null;
  }
}

/** My own accounts. Bookmarks live on /bookmarks. */
async function getSocialLinks(): Promise<SiteLink[]> {
  try {
    const res = await strapiGet<StrapiList<SiteLink>>("/links", {
      sort: "order:asc",
      "pagination[pageSize]": "100",
      "filters[type][$eq]": "social",
    });
    return res.data;
  } catch {
    return [];
  }
}

async function getDownloads(): Promise<Download[]> {
  try {
    const res = await strapiGet<StrapiList<Download>>("/downloads", {
      populate: "file",
      sort: "title:asc",
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function generateMetadata() {
  const about = await getAbout();
  return {
    title: about?.displayName ? `About — ${about.displayName}` : "About",
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
  const [about, links, downloads] = await Promise.all([getAbout(), getSocialLinks(), getDownloads()]);
  if (!about) return <div className="max-w-2xl">Nothing here yet.</div>;

  const portrait = mediaUrl(about.portrait);
  const hasStatement = Array.isArray(about.statement) && about.statement.length > 0;

  return (
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
            <h1 className="font-funnel text-5xl font-bold leading-tight">{about.displayName}</h1>
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

      {about.shortBio && <p className="mt-8 text-gray-600 dark:text-gray-400">{about.shortBio}</p>}

      <div className="mt-6">
        <RichText content={about.bio} />
      </div>

      <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-gray-100 py-4 dark:border-gray-800">
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

      {links.length > 0 && (
        <section className="mt-10">
          <h2 className="font-funnel mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Elsewhere
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                className="text-gray-500 transition-colors hover:text-brand-dark dark:hover:text-brand-white"
              >
                <SocialIcon url={link.url} title={link.title} iconKey={link.iconKey} />
                <span className="sr-only">{link.title}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {downloads.length > 0 && (
        <section className="mt-10">
          <h2 className="font-funnel mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Files
          </h2>
          <ul className="space-y-1 text-sm">
            {downloads.map((download) => {
              const href = mediaUrl(download.file);
              if (!href) return null;
              return (
                <li key={download.id}>
                  <a href={href} download className="underline underline-offset-2">
                    {download.title}
                  </a>
                  {download.description && (
                    <span className="ml-2 text-gray-400">{download.description}</span>
                  )}
                </li>
              );
            })}
          </ul>
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
  );
}
