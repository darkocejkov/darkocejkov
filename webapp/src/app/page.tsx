import Header from "@/components/Header";
import Markdown from "@/components/Markdown";
import { strapiGet, type StrapySingle, type About } from "@/lib/strapi";

async function getAbout(): Promise<About | null> {
  try {
    const res = await strapiGet<StrapySingle<About>>("/about", {
      "populate": "avatar",
    });
    return res.data;
  } catch {
    return null;
  }
}

export default async function Home() {
  const about = await getAbout();

  return (
    <>
      <Header />
      <main className="px-8 py-12 flex-1">
        {about ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              {about.avatar && (
                <img
                  src={`${process.env.NEXT_PUBLIC_CMS_URL}${about.avatar.url}`}
                  alt={about.avatar.alternativeText ?? about.displayName}
                  width={72}
                  height={72}
                  className="rounded-full object-cover"
                />
              )}
              <div>
                <h1 className="font-funnel text-5xl font-bold">{about.displayName}</h1>
                {about.headline && (
                  <p className="text-gray-500">{about.headline}</p>
                )}
              </div>
              {about.openToWork && (
                <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Open to work
                </span>
              )}
            </div>
            {about.shortBio && (
              <Markdown className="max-w-prose text-gray-600">{about.shortBio}</Markdown>
            )}

            {about.content && (
              <Markdown className="max-w-prose text-gray-600">{about.content}</Markdown>
            )}
          </div>
        ) : null}
      </main>
    </>
  );
}
