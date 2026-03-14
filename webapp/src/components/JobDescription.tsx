"use client";

import { useState } from "react";
import Markdown from "@/components/Markdown";

export default function JobDescription({ description }: { description: string }) {
  const [open, setOpen] = useState(false);

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
        {open ? "Hide description" : "Show description"}
      </button>
      {open && (
        <div className="mt-2 bg-slate-100 p-5 rounded-xl">
          <Markdown>{description}</Markdown>
        </div>
      )}
    </div>
  );
}
