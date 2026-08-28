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

export default async function MaintenanceBanner() {
  const meta = await getMeta();
  if (!meta) return null;

  // Dated notifications win over the standing construction flag, so a banner
  // can expire on its own instead of needing to be switched off by hand.
  const active = (meta.notifications ?? []).filter((n) => isNotificationActive(n));
  const message = active[0]?.message ?? (meta.underConstruction ? "under active redesign" : null);
  if (!message) return null;

  const symbols = " ◖ ▨ × ◉ ↖ ";

  return (
    <div className="sticky top-0 bg-yellow-400 text-yellow-900 text-sm font-medium py-2 overflow-hidden whitespace-nowrap font-funnel">
      <div className="animate-marquee inline-block">
        {Array.from({ length: 6 }).map((_, i) => (
          <React.Fragment key={i}>
            <span>{symbols}</span>
            <span className="mx-12">{message}</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
