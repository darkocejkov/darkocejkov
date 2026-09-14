"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate, useMotionValue, useReducedMotion } from "motion/react";
import { nearestNodeIndex, rotationForNode } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

/** Radians of orbit rotation per pixel of scroll or drag. */
const SENSITIVITY = 0.006;
/** Idle time after input before the orbit springs to the nearest node. */
const SNAP_DELAY_MS = 140;

/**
 * Turns scroll and drag into orbit rotation, snapping to the nearest node like a
 * rotary dial. The node parked at the 9 o'clock selector becomes activeNode.
 *
 * `enabled` gates whether this hook owns `activeNode` on mount. The rotary is
 * mobile-only (see Scene.tsx's `isNarrow` gate); on desktop it never receives
 * gesture input, so it must not claim node 0 as active there.
 */
export function useRotary(total: number, enabled: boolean) {
  const rotation = useMotionValue(rotationForNode(0, total));
  const setActiveNode = useSceneStore((s) => s.setActiveNode);
  const reduced = useReducedMotion() ?? false;
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleSnap = useCallback(() => {
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(() => {
      const index = nearestNodeIndex(rotation.get(), total);
      const target = rotationForNode(index, total);

      // Snap to the nearest equivalent angle so the orbit never unwinds a full turn.
      const current = rotation.get();
      const turns = Math.round((current - target) / (Math.PI * 2));
      const nearest = target + turns * Math.PI * 2;

      animate(rotation, nearest, reduced ? { duration: 0 } : { type: "spring", stiffness: 180, damping: 24 });
      setActiveNode(index);
    }, SNAP_DELAY_MS);
  }, [rotation, total, setActiveNode, reduced]);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      rotation.set(rotation.get() + e.deltaY * SENSITIVITY);
      scheduleSnap();
    },
    [rotation, scheduleSnap],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      const startY = e.clientY;
      const startRotation = rotation.get();
      const target = e.currentTarget;
      target.setPointerCapture(e.pointerId);

      function onMove(ev: PointerEvent) {
        rotation.set(startRotation + (ev.clientY - startY) * SENSITIVITY);
      }
      // pointercancel is routine on touch (an OS gesture conflict, an
      // interrupting alert, lost capture) and never fires pointerup. Without
      // also tearing down on cancel, a fresh onPointerDown next time would
      // add another live pointermove listener on top of this stale one.
      function onUp() {
        target.releasePointerCapture(e.pointerId);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        scheduleSnap();
      }

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [rotation, scheduleSnap],
  );

  useEffect(() => {
    if (enabled) setActiveNode(nearestNodeIndex(rotation.get(), total));
    return () => {
      if (snapTimer.current) clearTimeout(snapTimer.current);
    };
  }, [rotation, total, setActiveNode, enabled]);

  return { rotation, bind: { onWheel, onPointerDown } };
}
