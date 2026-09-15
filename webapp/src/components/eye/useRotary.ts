"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { nearestNodeIndex } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

/** Radians of orbit rotation per pixel of scroll or drag. */
const SENSITIVITY = 0.004;

/**
 * Pixels a touch must travel before it counts as a drag rather than a tap.
 * Below this the gesture is left alone entirely, so tapping a satellite still
 * follows its link.
 */
const DRAG_THRESHOLD = 8;

/**
 * Turns scroll and drag into free orbit rotation.
 *
 * The dial does not snap. Raw input accumulates into `target`; `rotation` is a
 * spring following it, which is what smooths the discrete, uneven deltas a
 * wheel emits into continuous motion. Snapping to the nearest node made the
 * orbit lurch every time input paused.
 *
 * Selection follows whatever is nearest the 9 o'clock selector, updated only
 * when the index actually changes rather than every frame. Nothing is selected
 * until the first gesture: at rest the orbit sits at 12 o'clock, and
 * highlighting whichever node happened to fall nearest the selector would be
 * arbitrary.
 *
 * Mouse input is wheel-only, deliberately. A pointerdown handler that captures
 * the pointer swallows the click that follows, which breaks every satellite
 * link; dragging is a touch affordance, so mice never take that path.
 */
export function useRotary(total: number) {
  const target = useMotionValue(0);
  const reduced = useReducedMotion() ?? false;
  const rotation = useSpring(
    target,
    reduced
      ? { stiffness: 1000, damping: 100, mass: 0.1 }
      : { stiffness: 90, damping: 22, mass: 0.7 },
  );

  const [engaged, setEngaged] = useState(false);
  const setActiveNode = useSceneStore((s) => s.setActiveNode);

  // Read inside a motion-value subscription, which is not re-created on every
  // render — a captured `engaged` would go stale there.
  const engagedRef = useRef(false);
  const lastIndex = useRef(-1);

  const engage = useCallback(() => {
    if (engagedRef.current) return;
    engagedRef.current = true;
    setEngaged(true);
  }, []);

  useMotionValueEvent(rotation, "change", (r) => {
    if (!engagedRef.current) return;
    const index = nearestNodeIndex(r, total);
    if (index === lastIndex.current) return;
    lastIndex.current = index;
    setActiveNode(index);
  });

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      engage();
      target.set(target.get() + e.deltaY * SENSITIVITY);
    },
    [target, engage],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      // Mice rotate with the wheel. Touching this path at all would mean
      // intercepting clicks meant for the satellite links underneath.
      if (e.pointerType === "mouse") return;

      const startY = e.clientY;
      const startTarget = target.get();
      let dragging = false;

      function onMove(ev: PointerEvent) {
        const dy = ev.clientY - startY;
        // Leave short movements alone so a tap still reaches its link.
        if (!dragging && Math.abs(dy) < DRAG_THRESHOLD) return;
        if (!dragging) {
          dragging = true;
          engage();
        }
        target.set(startTarget + dy * SENSITIVITY);
      }

      // pointercancel is routine on touch (an OS gesture conflict, an
      // interrupting alert) and never fires pointerup. Without tearing down on
      // cancel too, the next pointerdown would stack another live listener on
      // this stale one.
      function onUp() {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [target, engage],
  );

  useEffect(() => {
    engagedRef.current = engaged;
  }, [engaged]);

  return { rotation, engaged, bind: { onWheel, onPointerDown } };
}
