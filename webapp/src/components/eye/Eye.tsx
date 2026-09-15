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
  /**
   * Ring parallax offset. Pass a smaller factor than the pupil's so the pupil
   * leads and the rings trail — that lag between the two layers is what reads
   * as depth. Unbounded on purpose: the rings have nothing to collide with.
   */
  ringX?: MotionValue<number>;
  ringY?: MotionValue<number>;
  /**
   * Index of the fade front during a transition. Rings at k below this have
   * faded out, with a one-ring soft edge, so the set empties from the inside
   * outwards. Rings 0 and 1 — the pupil and the resting ring — are never
   * faded, which is what lets the transition end without the resting eye
   * popping back into view.
   */
  innerFade?: number;
  className?: string;
}

/**
 * Renders ring descriptors as SVG. Ring 0 is filled (the pupil); rings 1+ are
 * stroked. The two groups take independent parallax offsets so they sit on
 * separate depth planes.
 *
 * Decorative only — aria-hidden. Navigation lives in Orbit as real links.
 */
export default function Eye({
  params,
  size,
  pupilX,
  pupilY,
  ringX,
  ringY,
  innerFade = 0,
  className,
}: EyeProps) {
  const rings = ringGeometry(params);
  const centre = size / 2;
  const pupil = rings.find((r) => r.k === 0);
  const outer = rings.filter((r) => r.k > 0);

  const opacityOf = (ring: (typeof rings)[number]) =>
    ring.k < 2 ? ring.opacity : ring.opacity * Math.min(1, Math.max(0, ring.k - innerFade));

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      aria-hidden="true"
      focusable="false"
      overflow="visible"
    >
      <g transform={`translate(${centre} ${centre})`}>
        {/* Outer rings first so the pupil paints over them. */}
        <motion.g style={{ x: ringX, y: ringY }}>
          {outer.map((ring) =>
            ring.d ? (
              <path
                key={ring.k}
                d={ring.d}
                fill="none"
                stroke="currentColor"
                strokeWidth={ring.strokeWidth}
                opacity={opacityOf(ring)}
              />
            ) : (
              <circle
                key={ring.k}
                r={ring.r}
                fill="none"
                stroke="currentColor"
                strokeWidth={ring.strokeWidth}
                opacity={opacityOf(ring)}
              />
            ),
          )}
        </motion.g>

        {pupil && (
          <motion.g style={{ x: pupilX, y: pupilY }}>
            {pupil.d ? (
              <path d={pupil.d} fill="currentColor" opacity={pupil.opacity} />
            ) : (
              <circle r={pupil.r} fill="currentColor" opacity={pupil.opacity} />
            )}
          </motion.g>
        )}
      </g>
    </svg>
  );
}
