"use client";

import Link from "next/link";
import { motion, useTransform, type MotionValue } from "motion/react";
import ScrambleGlyph from "./ScrambleGlyph";
import type { SceneNode } from "@/config/nodes";
import { orbitPosition } from "@/lib/orbit";
import { useSceneStore } from "@/stores/scene";

interface OrbitProps {
  id: string;
  items: ReadonlyArray<SceneNode>;
  /** Orbit radius in pixels; 0 tucks every satellite into the centre. */
  radius: MotionValue<number>;
  /** Size of the satellite icon box in pixels. */
  iconSize: MotionValue<number>;
  /** Live orbit rotation in radians. */
  rotation: MotionValue<number>;
  /** Closed satellites are hidden from pointer, keyboard, and screen readers. */
  open: boolean;
  onNavigate: () => void;
}

function Satellite({
  index,
  items,
  radius,
  iconSize,
  rotation,
  onNavigate,
}: Omit<OrbitProps, "id" | "open"> & { index: number }) {
  const node = items[index];
  const total = items.length;
  const isActive = useSceneStore((s) => s.activeNode === index);

  const x = useTransform([rotation, radius], ([r, rad]: number[]) => orbitPosition(index, total, rad, r).x);
  const y = useTransform([rotation, radius], ([r, rad]: number[]) => orbitPosition(index, total, rad, r).y);

  return (
    <motion.div className="absolute left-1/2 top-1/2" style={{ x, y }}>
      <Link
        href={node.href}
        onClick={onNavigate}
        aria-label={node.label}
        aria-current={isActive ? "page" : undefined}
        className="group relative flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand-orange focus-visible:ring-offset-2"
      >
        <motion.span
          aria-hidden="true"
          className={[
            "flex shrink-0 items-center justify-center rounded-full font-sans leading-none transition-transform duration-200",
            isActive ? "scale-125 ring-4 ring-brand-orange ring-offset-2" : "group-hover:scale-110",
          ].join(" ")}
          style={{ width: iconSize, height: iconSize, fontSize: iconSize }}
        >
          <ScrambleGlyph glyph={node.icon} />
        </motion.span>
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

export default function Orbit({ id, open, ...props }: OrbitProps) {
  return (
    <nav
      id={id}
      aria-label="Sections"
      inert={!open}
      className={open ? "pointer-events-auto absolute inset-0" : "pointer-events-none absolute inset-0"}
    >
      {props.items.map((node, i) => (
        <Satellite key={node.slug} {...props} index={i} />
      ))}
    </nav>
  );
}
