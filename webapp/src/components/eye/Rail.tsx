"use client";

import Link from "next/link";
import { type MotionValue } from "motion/react";
import Eye from "./Eye";
import ThemeToggle from "@/components/ThemeToggle";
import { NODES } from "@/config/nodes";
import { useSceneStore } from "@/stores/scene";

/** Docked eye: same parameters, smaller stroke so it stays legible at 56px. */
const RAIL_EYE = { pupil: 17, spacing: 15, count: 2, stroke: 9 };

/**
 * The docked state. On desktop the orbit straightens into a vertical spine
 * beneath the eye; on mobile it becomes an arc pinned to the left edge.
 */
export default function Rail({
  pupilX,
  pupilY,
}: {
  pupilX?: MotionValue<number>;
  pupilY?: MotionValue<number>;
}) {
  const activeNode = useSceneStore((s) => s.activeNode);

  return (
    <div className="flex flex-col items-center gap-5 py-6">
      <Link href="/" aria-label="Home" className="block w-14 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2">
        <Eye params={RAIL_EYE} size={100} pupilX={pupilX} pupilY={pupilY} className="h-full w-full" />
      </Link>

      <nav aria-label="Sections" className="flex flex-col items-center gap-4">
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
                    ? "h-4 w-4 ring-2 ring-brand-orange ring-offset-2"
                    : "h-2.5 w-2.5 opacity-40 group-hover:opacity-100",
                ].join(" ")}
              />
              {/* Label appears on hover and focus; always present for assistive tech. */}
              <span className="pointer-events-none absolute left-7 whitespace-nowrap text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {node.label}
              </span>
              <span className="sr-only">{node.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Re-homed from the deleted footer. */}
      <div className="mt-auto pt-4">
        <ThemeToggle />
      </div>
    </div>
  );
}
