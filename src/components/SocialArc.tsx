import SocialIcon from "@/components/SocialIcon";
import type { SiteLink } from "@/content";

/** Half the angle the icons fan across, in radians. */
const SPREAD = 0.62;
const RADIUS = 340;

function placements(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const a = count === 1 ? 0 : -SPREAD + (2 * SPREAD * i) / (count - 1);
    // How far each icon bows away from the arc's ends.
    return { along: RADIUS * Math.sin(a), bow: RADIUS * (Math.cos(a) - Math.cos(SPREAD)) };
  });
}

/**
 * Social links on a circular arc: down the right edge on wide screens,
 * bowing like the iris's rings; across the page in flow on narrow ones.
 */
export default function SocialArc({ links }: { links: SiteLink[] }) {
  if (links.length === 0) return null;
  const spots = placements(links.length);

  const icon = (link: SiteLink) => (
    <>
      <span className="block h-full w-full [&_svg]:h-full [&_svg]:w-full">
        <SocialIcon url={link.url} title={link.title} iconKey={link.iconKey ?? null} />
      </span>
      <span className="sr-only">{link.title}</span>
    </>
  );

  const linkClass =
    "group absolute block rounded-full text-brand-dark outline-none transition-[color,transform] duration-200 hover:scale-110 hover:text-brand-orange focus-visible:text-brand-orange focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-4 dark:text-brand-white";

  return (
    <nav aria-label="elsewhere">
      {/* Wide: fixed down the right edge. */}
      <ul className="pointer-events-none fixed right-0 top-1/2 z-20 hidden lg:block">
        {links.map((link, i) => (
          <li key={link.slug}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} pointer-events-auto h-14 w-14`}
              style={{ right: 40 + spots[i].bow, top: spots[i].along - 28 }}
            >
              {icon(link)}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-full top-1/2 mr-4 -translate-y-1/2 whitespace-nowrap font-mono text-xs lowercase opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {link.title}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Narrow: an arc across the page. */}
      <ul className="relative mx-auto mt-20 h-40 w-full max-w-sm lg:hidden">
        {links.map((link, i) => (
          <li key={link.slug}>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} h-12 w-12`}
              style={{
                left: `calc(50% + ${(spots[i].along * 0.5).toFixed(1)}px - 24px)`,
                top: 72 - spots[i].bow * 0.5,
              }}
            >
              {icon(link)}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
