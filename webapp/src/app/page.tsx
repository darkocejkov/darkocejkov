import RichText from "@/components/RichText";
import { strapiGet, mediaUrl, type StrapiSingle, type SiteMeta } from "@/lib/strapi";

async function getMeta(): Promise<SiteMeta | null> {
  try {
    const res = await strapiGet<StrapiSingle<SiteMeta>>("/meta", {
      populate: "avatar",
    });
    return res.data;
  } catch {
    return null;
  }
}

export default async function Home() {
  const meta = await getMeta();
  if (!meta) return <main className="px-8 py-12 flex-1" />;

  const avatar = mediaUrl(meta.avatar);

  return (
    <main className="px-8 py-12 flex-1">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          {avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={meta.avatar?.alternativeText ?? meta.displayName}
              width={72}
              height={72}
              className="rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="font-funnel text-5xl font-bold">{meta.displayName}</h1>
            {meta.headline && <p className="text-gray-500">{meta.headline}</p>}
          </div>
          {meta.lookingForWork && (
            <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
              Open to work
            </span>
          )}
        </div>

        {meta.shortBio && (
          <p className="max-w-prose text-gray-600 dark:text-gray-400">{meta.shortBio}</p>
        )}

        <RichText content={meta.bio} className="max-w-prose text-gray-600" />
      </div>
    </main>
  );
}
