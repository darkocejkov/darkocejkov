"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

const range = (from: number, to: number) =>
  Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i));

/** The same geometric ranges the satellites' own icons are drawn from. */
const POOL = [...range(0x25c9, 0x25d7), ...range(0x25ef, 0x25f7)];

const FRAME_MS = 70;
const FRAMES = 9;
const MIN_IDLE_MS = 3500;
const MAX_IDLE_MS = 9000;

/**
 * Renders `glyph`, periodically scrambling through random symbols before
 * settling back on it. Each instance idles for a random interval so the
 * satellites flicker independently rather than in unison.
 */
export default function ScrambleGlyph({ glyph }: { glyph: string }) {
  const reduced = useReducedMotion() ?? false;
  const [shown, setShown] = useState(glyph);

  useEffect(() => {
    if (reduced) return;
    let timer = 0;
    let frame = 0;

    function idle() {
      frame = 0;
      timer = window.setTimeout(tick, MIN_IDLE_MS + Math.random() * (MAX_IDLE_MS - MIN_IDLE_MS));
    }

    function tick() {
      if (frame < FRAMES) {
        frame += 1;
        setShown(POOL[Math.floor(Math.random() * POOL.length)]);
        timer = window.setTimeout(tick, FRAME_MS);
      } else {
        setShown(glyph);
        idle();
      }
    }

    idle();
    return () => window.clearTimeout(timer);
  }, [glyph, reduced]);

  return <>{reduced ? glyph : shown}</>;
}
