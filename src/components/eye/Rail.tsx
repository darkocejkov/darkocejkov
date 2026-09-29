"use client";

import Link from "next/link";
import { useRef } from "react";
import { useTransform, type MotionValue } from "motion/react";
import Eye from "./Eye";
import { useGaze } from "./useGaze";
import { NODES } from "@/config/nodes";
import { maxPupilOffset } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

/** Docked eye: same parameters, smaller stroke so it stays legible at 56px. */
const RAIL_EYE = { pupil: 17, spacing: 15, count: 2, stroke: 9 };

/**
 * The docked state. On desktop the orbit straightens into a vertical spine
 * beneath the eye; on mobile it becomes an arc pinned to the left edge.
 */
export default function Rail({
  blink,
  onBlinkTrigger,
}: {
  blink?: MotionValue<number>;
  onBlinkTrigger?: () => void;
}) {
  const activeNode = useSceneStore((s) => s.activeNode);

  // The docked eye measures its own gaze rather than taking the scene's
  // viewport-normalised pointer. It sits in the corner, so the two are not
  // the same question: the scene's values say where the cursor is relative
  // to the middle of the page, and this eye needs to know where the cursor
  // is relative to itself.
  const eyeRef = useRef<HTMLAnchorElement>(null);
  const { gx, gy } = useGaze(eyeRef);

  // Own bound: RAIL_EYE's geometry, not the home eye's. The pupil must never
  // travel further than this eye's own ring clearance allows.
  const railTravel = maxPupilOffset(RAIL_EYE.spacing, RAIL_EYE.stroke);
  const pupilX = useTransform(gx, (v) => v * railTravel);
  const pupilY = useTransform(gy, (v) => v * railTravel);

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <Link
        ref={eyeRef}
        href="/"
        aria-label="Home"
        onPointerEnter={onBlinkTrigger}
        className="block w-14 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
      >
        <Eye
          params={RAIL_EYE}
          size={100}
          pupilX={pupilX}
          pupilY={pupilY}
          blink={blink}
          className="h-full w-full"
        />
      </Link>

      <nav
        aria-label="Sections"
        className="flex flex-col items-center gap-4"
      >
        {NODES.map((node, i) => {
          const isActive = activeNode === i;
          return (
            <Link
              key={node.slug}
              href={node.href}
              aria-current={isActive ? "page" : undefined}
              className="group relative flex items-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className={[
                  "block rounded-full bg-current transition-all duration-200",
                  isActive
                    ? "h-4 w-4 ring-4 ring-brand-orange ring-offset-2"
                    : "h-2.5 w-2.5 opacity-40 group-hover:opacity-100",
                ].join(" ")}
              />
              {/* Visual-only: revealed on hover/focus. The sr-only twin below
                  carries the accessible name so screen readers hear it once. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-7 whitespace-nowrap text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                {node.label}
              </span>
              <span className="sr-only">{node.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
