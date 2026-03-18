"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[page error]", error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center justify-center px-8 py-12">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-brand-red/20 bg-brand-red/10">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-brand-red">
            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-brand-dark dark:text-brand-white">Something went wrong</p>
          <p className="text-sm text-brand-dark/50 dark:text-brand-white/50">
            {error.message ?? "An unexpected error occurred."}
          </p>
        </div>
        <button
          onClick={reset}
          className="rounded-md border border-brand-dark/10 px-4 py-2 text-sm text-brand-dark/70 transition-colors hover:border-brand-cyan hover:text-brand-cyan dark:border-brand-white/10 dark:text-brand-white/70"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
