"use client";

import Link from "next/link";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { NODES } from "@/config/nodes";
import { orbitPosition } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

interface OrbitProps {
  /** Orbit radius in pixels. */
  radius: number;
  /** Size of the satellite icon box in pixels. */
  iconSize: number;
  /** Live orbit rotation in radians. Omit for a static orbit. */
  rotation?: MotionValue<number>;
}

function Satellite({
  index,
  radius,
  iconSize,
  rotation,
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
        aria-label={node.label}
        aria-current={isActive ? "page" : undefined}
        className="group relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
      >
        <span
          aria-hidden="true"
          className={[
            "flex shrink-0 items-center justify-center rounded-full font-sans leading-none transition-transform duration-200",
            isActive ? "scale-125 ring-4 ring-brand-orange ring-offset-2" : "group-hover:scale-110",
          ].join(" ")}
          style={{ width: iconSize, height: iconSize, fontSize: iconSize }}
        >
          {node.icon}
        </span>
        <span
          aria-hidden="true"
          className="invisible absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 whitespace-nowrap rounded-sm bg-brand-dark px-2 py-1 text-xs text-brand-white opacity-0 shadow-sm transition-[opacity,visibility] duration-150 group-hover:visible group-hover:opacity-100 group-focus-visible:visible group-focus-visible:opacity-100 dark:bg-brand-white dark:text-brand-dark"
        >
          {node.label}
        </span>
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
