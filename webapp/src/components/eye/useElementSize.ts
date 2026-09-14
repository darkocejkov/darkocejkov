"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Measures an element's rendered width via ResizeObserver, so layout that
 * depends on actual pixel size (e.g. proportional orbit radius) can react to
 * viewport-relative CSS sizing like `vmin` instead of assuming fixed pixels.
 *
 * SSR-safe: width is null until the element is mounted and measured.
 * Disconnects the observer on unmount.
 */
export function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    setWidth(el.getBoundingClientRect().width);

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
