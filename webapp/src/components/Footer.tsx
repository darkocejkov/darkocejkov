import { strapiGet, type StrapiList, type SocialLink, type Resume } from "@/lib/strapi";
import ThemeToggle from "@/components/ThemeToggle";
import SocialIcon from "@/components/SocialIcon";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

async function getSocialLinks(): Promise<SocialLink[]> {
  try {
    const res = await strapiGet<StrapiList<SocialLink>>("/social-links");
    return res.data;
  } catch {
    return [];
  }
}

async function getResumes(): Promise<Resume[]> {
  try {
    const res = await strapiGet<StrapiList<Resume>>("/resumes", {
      "populate": "file",
      "sort": "order:asc",
    });
    return res.data;
  } catch {
    return [];
  }
}

export default async function Footer() {
  const [links, resumes] = await Promise.all([getSocialLinks(), getResumes()]);

  const personal = links.filter((l) => l.category === "personal");
  const professional = links.filter((l) => l.category === "professional");

  return (
    <footer className="sticky backdrop-blur-2xl bottom-0 mt-auto border-t border-brand-dark/10 dark:border-brand-white/10 px-8 py-6 text-sm text-brand-dark/50 dark:text-brand-white/50">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-8">
          {professional.length > 0 && (
            <div className="flex gap-4 items-center">
              {professional.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.title}
                  className="hover:text-brand-dark dark:hover:text-brand-white transition-colors"
                >
                  <SocialIcon url={link.url} title={link.title} />
                </a>
              ))}
            </div>
          )}
          {personal.length > 0 && (
            <div className="flex gap-4 items-center">
              {personal.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={link.title}
                  className="hover:text-brand-dark dark:hover:text-brand-white transition-colors"
                >
                  <SocialIcon url={link.url} title={link.title} />
                </a>
              ))}
            </div>
          )}
        </div>
        {resumes.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Resume</span>
            {resumes.map((resume) => (
              <a
                key={resume.id}
                href={`${CMS_URL}${resume.file?.url}`}
                download
                className="hover:text-brand-dark dark:hover:text-brand-white hover:underline"
              >
                {resume.label}
              </a>
            ))}
          </div>
        )}
        <ThemeToggle />
      </div>
    </footer>
  );
}
