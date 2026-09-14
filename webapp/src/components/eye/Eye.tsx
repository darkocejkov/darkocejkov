"use client";

import { motion, type MotionValue } from "motion/react";
import { ringGeometry, type RingParams } from "@/lib/circularity";

interface EyeProps {
  params: RingParams;
  /** viewBox edge length. The eye is centred within it. */
  size: number;
  /** Pupil parallax offset. Bound these with maxPupilOffset before passing them in. */
  pupilX?: MotionValue<number>;
  pupilY?: MotionValue<number>;
  className?: string;
}

/**
 * Renders ring descriptors as SVG. Ring 0 is filled (the pupil) and carries the
 * parallax offset; rings 1+ are stroked and stay put.
 *
 * Decorative only — aria-hidden. Navigation lives in Orbit as real links.
 */
export default function Eye({ params, size, pupilX, pupilY, className }: EyeProps) {
  const rings = ringGeometry(params);
  const centre = size / 2;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      overflow="visible"
    >
      <g transform={`translate(${centre} ${centre})`}>
        {rings.map((ring) => {
          if (ring.k === 0) {
            return (
              <motion.g key={ring.k} style={{ x: pupilX, y: pupilY }}>
                {ring.d ? (
                  <path d={ring.d} fill="currentColor" opacity={ring.opacity} />
                ) : (
                  <circle r={ring.r} fill="currentColor" opacity={ring.opacity} />
                )}
              </motion.g>
            );
          }
          return ring.d ? (
            <path
              key={ring.k}
              d={ring.d}
              fill="none"
              stroke="currentColor"
              strokeWidth={ring.strokeWidth}
              opacity={ring.opacity}
            />
          ) : (
            <circle
              key={ring.k}
              r={ring.r}
              fill="none"
              stroke="currentColor"
              strokeWidth={ring.strokeWidth}
              opacity={ring.opacity}
            />
          );
        })}
      </g>
    </svg>
  );
}
