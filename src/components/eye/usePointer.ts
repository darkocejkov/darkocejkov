"use client";

import { useEffect } from "react";
import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";

/**
 * Viewport-normalised pointer position, spring-smoothed.
 *
 * Deliberately NOT in the zustand store: these update at frame rate, and routing
 * them through React state would re-render the whole scene sixty times a second.
 * Motion values mutate the DOM directly instead.
 *
 * Returns zeroed, non-reactive values under prefers-reduced-motion.
 */
export function usePointer() {
  const reduced = useReducedMotion() ?? false;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Softer spring than the default so the eye lags the cursor slightly — the lag
  // is what reads as depth.
  const px = useSpring(rawX, { stiffness: 120, damping: 20, mass: 0.6 });
  const py = useSpring(rawY, { stiffness: 120, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduced) return;

    function onMove(e: PointerEvent) {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    }

    // Recentre when the cursor leaves the window, so the eye doesn't stay
    // staring at the last known edge position.
    function onLeave() {
      rawX.set(0);
      rawY.set(0);
    }

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [rawX, rawY, reduced]);

  return { px, py, reduced };
}

/**
 * Scales normalised pointer values into pixel translation for one depth layer.
 * Larger `depth` = nearer the viewer = moves further.
 */
export function useParallax(
  px: MotionValue<number>,
  py: MotionValue<number>,
  depth: number,
): { x: MotionValue<number>; y: MotionValue<number> } {
  const x = useTransform(px, (v) => v * depth);
  const y = useTransform(py, (v) => v * depth);
  return { x, y };
}
