"use client";

import { useState } from "react";
import type { Highlight } from "@/lib/strapi";

/**
 * Experience detail is a list of highlight components now, rather than one
 * Markdown blob, so it renders as a real list instead of prose.
 */
export default function JobDescription({ highlights }: { highlights: Highlight[] }) {
  const [open, setOpen] = useState(false);
  if (!highlights?.length) return null;

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg
          className={`h-3 w-3 transition-transform ${open ? "rotate-90" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {open ? "Hide details" : `Show details (${highlights.length})`}
      </button>
      {open && (
        <ul className="mt-2 dark:bg-brand-white/10 bg-brand-dark/10 p-5 rounded-xl flex flex-col gap-2">
          {highlights.map((h) => (
            <li key={h.id} className="text-sm flex gap-2">
              <span className="text-gray-400 shrink-0">—</span>
              <span>{h.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
