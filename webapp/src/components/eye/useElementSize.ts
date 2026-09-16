"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measures an element's rendered size via ResizeObserver, so layout that
 * depends on actual pixel size (e.g. proportional orbit radius) can react to
 * viewport-relative CSS sizing like `vmin` instead of assuming fixed pixels.
 *
 * Attached to a `fixed inset-0` element it also serves as a viewport measure,
 * which is how the wave works out how far it has to reach to clear the corners.
 *
 * SSR-safe: both are null until the element is mounted and measured.
 * Disconnects the observer on unmount.
 */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    setSize({ width: rect.width, height: rect.height });

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        // Only commit a genuine change. ResizeObserver fires on every layout
        // pass that touches the element, and an unconditional setState here
        // re-renders the whole scene for a size that did not move.
        setSize((prev) =>
          prev && prev.width === entry.contentRect.width && prev.height === entry.contentRect.height
            ? prev
            : { width: entry.contentRect.width, height: entry.contentRect.height },
        );
      }
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return { ref, width: size?.width ?? null, height: size?.height ?? null };
}
