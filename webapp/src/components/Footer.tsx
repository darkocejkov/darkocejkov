import {
  strapiGet,
  mediaUrl,
  type StrapiList,
  type SiteLink,
  type Download,
} from "@/lib/strapi";
import ThemeToggle from "@/components/ThemeToggle";
import SocialIcon from "@/components/SocialIcon";

/** Only my own accounts belong in the footer; bookmarks live on /links. */
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

export default async function Footer() {
  const [links, downloads] = await Promise.all([getSocialLinks(), getDownloads()]);

  return (
    <footer className="sticky backdrop-blur-2xl bottom-0 mt-auto border-t border-brand-dark/10 dark:border-brand-white/10 px-8 py-6 text-sm text-brand-dark/50 dark:text-brand-white/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        {links.length > 0 && (
          <div className="flex gap-4 items-center">
            {links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                className="hover:text-brand-dark dark:hover:text-brand-white transition-colors"
              >
                <SocialIcon url={link.url} title={link.title} iconKey={link.iconKey} />
              </a>
            ))}
          </div>
        )}

        {downloads.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Files</span>
            {downloads.map((download) => {
              const href = mediaUrl(download.file);
              if (!href) return null;
              return (
                <a
                  key={download.id}
                  href={href}
                  download
                  className="hover:text-brand-dark dark:hover:text-brand-white hover:underline"
                >
                  {download.title}
                </a>
              );
            })}
          </div>
        )}

        <ThemeToggle />
      </div>
    </footer>
  );
}
