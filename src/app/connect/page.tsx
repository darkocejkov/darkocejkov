import SocialIcon from "@/components/SocialIcon";
import { getLinks } from "@/content";

export const metadata = { title: "Connect" };

export default function ConnectPage() {
  const socials = getLinks("social");

  return (
    <div className="max-w-2xl">
      <h1 className="font-funnel mb-2 text-4xl font-bold">Connect</h1>
      <p className="mb-10 max-w-prose text-gray-500">Find me elsewhere.</p>

      {socials.length === 0 ? (
        <p className="text-sm text-gray-400">No social links yet.</p>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {socials.map((social) => (
            <li key={social.slug} className="py-4 first:pt-0">
              <a
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3"
              >
                <span className="text-gray-500 transition-colors group-hover:text-brand-dark dark:group-hover:text-brand-white">
                  <SocialIcon
                    url={social.url}
                    title={social.title}
                    iconKey={social.iconKey ?? null}
                  />
                </span>
                <span className="text-sm font-medium group-hover:underline">{social.title}</span>
                <span className="text-xs text-gray-400">{new URL(social.url).hostname}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}