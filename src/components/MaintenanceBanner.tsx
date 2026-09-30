import { getMetadata } from "@/content";
import { isNotificationActive } from "@/content/metadata";

const SYMBOLS = ["◖", "▨", "×", "◉", "↖"];

/**
 * The strip of pulsing glyphs flanking the message. Decorative, so it stays
 * out of the accessibility tree; the message itself carries the meaning.
 */
function Symbols({ reverse = false }: { reverse?: boolean }) {
  const glyphs = reverse ? [...SYMBOLS].reverse() : SYMBOLS;
  return (
    <span className="flex gap-1.5" aria-hidden="true">
      {glyphs.map((glyph, i) => (
        <span
          key={i}
          className="animate-symbol-pulse inline-block"
          style={{ animationDelay: `${i * 0.16}s` }}
        >
          {glyph}
        </span>
      ))}
    </span>
  );
}

export default function MaintenanceBanner() {
  const meta = getMetadata();
  // Dated notifications win over the standing construction flag, so a banner
  // can expire on its own instead of needing to be switched off by hand.
  const active = meta.notifications.filter((n) => isNotificationActive(n));
  const notification = active[0];
  const message = notification?.message ?? (meta.underConstruction ? "under active redesign" : null);
  if (!message) return null;

  // Centred rather than a marquee: a scrolling strip makes the reader wait
  // for the text to come round, and the message is short enough to read at a
  // glance. The symbols carry the motion instead.
  return (
    <div className="sticky top-0 z-30 bg-brand-orange py-2 font-funnel text-sm font-medium text-brand-dark">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 text-center">
        <Symbols />
        {notification?.url ? (
          <a href={notification.url} className="underline underline-offset-2">
            {message}
          </a>
        ) : (
          <span>{message}</span>
        )}
        <Symbols reverse />
      </div>
    </div>
  );
}
