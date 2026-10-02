"use client";

import { useEffect, type RefObject } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "motion/react";
import { gazeVector } from "@/lib/orbit";

/** Full deflection once the pointer is this fraction of the short viewport edge away. */
const SATURATION_FACTOR = 0.5;

/**
 * Where an eye should look, measured from that eye's own position on screen.
 *
 * Distinct from `usePointer`, which normalises against the viewport. That is
 * right for parallax — a layer's drift should follow the pointer's travel
 * across the screen — but wrong for a gaze, because it puts the origin at the
 * middle of the viewport rather than at the eye. The home eye sits near that
 * middle so it mostly got away with it; the docked eye sits in the corner and
 * stared off toward the centre of the page no matter where the cursor was.
 *
 * The element's centre is read on mount, on resize, on scroll, and whenever
 * the element itself changes size — never per pointer event, since a
 * `getBoundingClientRect` in a move handler forces synchronous layout on
 * every frame, which is exactly the thrash `useElementSize` exists to avoid.
 * Between those moments the centre is a cached number.
 *
 * Returns zeroed, non-reactive values under prefers-reduced-motion.
 */
export function useGaze<T extends HTMLElement>(
  ref: RefObject<T | null>,
  /** Transform offsets on the element; the centre is re-read when any changes. */
  offsets?: readonly MotionValue<number>[],
): {
  gx: MotionValue<number>;
  gy: MotionValue<number>;
} {
  const reduced = useReducedMotion() ?? false;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Matched to usePointer's spring so the pupil and the parallax layers share
  // one sense of weight; a gaze that settled faster than the rings drifted
  // would read as two separate objects.
  const gx = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 });
  const gy = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;

    let centreX = 0;
    let centreY = 0;
    let saturation = 0;

    function measure() {
      const rect = el!.getBoundingClientRect();
      centreX = rect.left + rect.width / 2;
      centreY = rect.top + rect.height / 2;
      saturation =
        Math.min(window.innerWidth, window.innerHeight) * SATURATION_FACTOR;
    }

    measure();

    // The eye changes size when it docks, which is also when it moves — so
    // observing its box catches the transition without polling for it.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const unsubscribeOffsets = (offsets ?? []).map((offset) => offset.on("change", measure));

    function onMove(e: PointerEvent) {
      const { x, y } = gazeVector(
        { x: e.clientX, y: e.clientY },
        { x: centreX, y: centreY },
        saturation,
      );
      rawX.set(x);
      rawY.set(y);
    }

    // Look forward again when the cursor leaves, rather than holding a stare
    // at wherever it happened to exit.
    function onLeave() {
      rawX.set(0);
      rawY.set(0);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("scroll", measure, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      observer.disconnect();
      unsubscribeOffsets.forEach((unsubscribe) => unsubscribe());
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [ref, rawX, rawY, reduced, offsets]);

  return { gx, gy };
}
