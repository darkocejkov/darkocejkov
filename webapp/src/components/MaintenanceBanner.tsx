import { strapiGet, type StrapySingle, type About } from "@/lib/strapi";
import React from "react";

async function getUnderMaintenance(): Promise<boolean> {
  try {
    const res = await strapiGet<StrapySingle<About>>("/about");
    return res.data?.underMaintenance ?? false;
  } catch {
    return false;
  }
}

export default async function MaintenanceBanner() {
  const underMaintenance = await getUnderMaintenance();

  if (!underMaintenance) return null;

  const symbols = " ◖ ▨ × ◉ ↖ "

  const message =
    "under active redesign";

  return (
    <div className="sticky top-0 bg-yellow-400 text-yellow-900 text-sm font-medium py-2 overflow-hidden whitespace-nowrap font-funnel">
      <div className="animate-marquee inline-block">
        {Array.from({ length: 6 }).map((_, i) => (
          <React.Fragment key={i}>
            <span>
              {symbols}
            </span>
            <span className="mx-12">
              {message}
            </span>
          </React.Fragment >
        ))}
      </div>
    </div>
  );
}
