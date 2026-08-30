import Link from "next/link";
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

export default async function Home() {
  const about = await getAbout();
  if (!about) return <main className="px-8 py-12 flex-1" />;

  const portrait = mediaUrl(about.portrait);

  return (
    <main className="px-8 py-12 flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {portrait && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={portrait}
              alt={about.portrait?.alternativeText ?? about.displayName}
              width={72}
              height={72}
              className="rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="font-funnel text-5xl font-bold">{about.displayName}</h1>
            {about.headline && <p className="text-gray-500">{about.headline}</p>}
          </div>
          {about.lookingForWork && (
            <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Open to work
            </span>
          )}
        </div>

        {about.shortBio && (
          <p className="max-w-prose text-gray-600 dark:text-gray-400">{about.shortBio}</p>
        )}

        <RichText content={about.bio} className="max-w-prose text-gray-600" />

        {about.currently && (
          <p className="max-w-prose text-sm text-gray-500">
            <span className="text-gray-400">Currently — </span>
            {about.currently}
          </p>
        )}

        <Link href="/about" className="text-sm underline underline-offset-2 w-fit">
          More about me
        </Link>
      </div>
    </main>
  );
}
