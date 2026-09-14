"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { NODES } from "@/config/nodes";
import { orbitPosition } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

interface OrbitProps {
  /** Orbit radius in pixels. */
  radius: number;
  /** Diameter of an unselected satellite dot. */
  dotSize: number;
  /** Live orbit rotation in radians. Omit for a static orbit. */
  rotation?: MotionValue<number>;
  /** Render text labels beside the dots. */
  showLabels?: boolean;
}

function Satellite({
  index,
  radius,
  dotSize,
  rotation,
  showLabels,
}: OrbitProps & { index: number }) {
  const node = NODES[index];
  const activeNode = useSceneStore((s) => s.activeNode);
  const isActive = activeNode === index;

  // A stable zero value for the static (desktop) case, so the transforms below
  // are always given a real MotionValue — hooks cannot be called conditionally.
  const staticRotation = useMotionValue(0);
  const turn = rotation ?? staticRotation;

  // Recompute position as the orbit turns, without re-rendering React.
  const x = useTransform(turn, (r) => orbitPosition(index, NODES.length, radius, r).x);
  const y = useTransform(turn, (r) => orbitPosition(index, NODES.length, radius, r).y);

  return (
    <motion.div className="absolute left-1/2 top-1/2" style={{ x, y }}>
      <Link
        href={node.href}
        aria-current={isActive ? "page" : undefined}
        className="group flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
      >
        <span
          aria-hidden="true"
          className={[
            "block rounded-full bg-current transition-transform duration-200",
            isActive ? "scale-125 ring-2 ring-brand-orange ring-offset-2" : "group-hover:scale-110",
          ].join(" ")}
          style={{ width: dotSize, height: dotSize }}
        />
        <span className={showLabels ? "text-sm" : "sr-only"}>{node.label}</span>
      </Link>
    </motion.div>
  );
}

export default function Orbit(props: OrbitProps) {
  return (
    <nav aria-label="Sections" className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto contents">
        {NODES.map((node, i) => (
          <Satellite key={node.slug} {...props} index={i} />
        ))}
      </div>
    </nav>
  );
}
