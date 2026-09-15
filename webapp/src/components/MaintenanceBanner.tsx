import React from "react";
import {
  strapiGet,
  isNotificationActive,
  type StrapiSingle,
  type SiteMeta,
} from "@/lib/strapi";

async function getMeta(): Promise<SiteMeta | null> {
  try {
    const res = await strapiGet<StrapiSingle<SiteMeta>>("/meta", {
      populate: "notifications",
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

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

export default async function MaintenanceBanner() {
  const meta = await getMeta();
  if (!meta) return null;

  // Dated notifications win over the standing construction flag, so a banner
  // can expire on its own instead of needing to be switched off by hand.
  const active = (meta.notifications ?? []).filter((n) => isNotificationActive(n));
  const message = active[0]?.message ?? (meta.underConstruction ? "under active redesign" : null);
  if (!message) return null;

  // Centred rather than a marquee: a scrolling strip makes the reader wait
  // for the text to come round, and the message is short enough to read at a
  // glance. The symbols carry the motion instead.
  return (
    <div className="sticky top-0 z-30 bg-brand-orange py-2 font-funnel text-sm font-medium text-brand-dark">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 text-center">
        <Symbols />
        <span>{message}</span>
        <Symbols reverse />
      </div>
    </div>
  );
}
