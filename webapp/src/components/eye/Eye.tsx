"use client";

import { motion, type MotionValue } from "motion/react";
import { ringGeometry, type RingParams } from "@/lib/circularity";

/** Width of the fade front, in ring indices. */
const FADE_EDGE = 2.5;

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
   * Position of the fade front during a transition, in ring indices. Rings
   * behind it have faded out, so the set empties from the inside outwards.
   * Starts at 0, where everything is still fully drawn.
   */
  innerFade?: number;
  /**
   * Hold the pupil and the resting ring at full opacity, letting the front
   * pass over only the transition rings. Set when the transition ends on the
   * homepage, where the eye has to still be there afterwards; without it the
   * count reset at the end of a wave would pop the resting eye back in.
   *
   * Cleared when leaving for a content route, so the front consumes the iris
   * first and the eye empties from its centre outwards rather than fading out
   * as a whole at the end.
   */
  protectCore?: boolean;
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
  protectCore = true,
  className,
}: EyeProps) {
  const rings = ringGeometry(params);
  const centre = size / 2;
  const pupil = rings.find((r) => r.k === 0);
  const outer = rings.filter((r) => r.k > 0);

  const opacityOf = (ring: (typeof rings)[number]) => {
    if (protectCore && ring.k < 2) return ring.opacity;
    // A front wider than one ring: a hard edge makes the iris blink rather
    // than dissolve, since it is a single element the front crosses in one step.
    const edge = (ring.k - innerFade + FADE_EDGE) / FADE_EDGE;
    return ring.opacity * Math.min(1, Math.max(0, edge));
  };

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
              <path d={pupil.d} fill="currentColor" opacity={opacityOf(pupil)} />
            ) : (
              <circle r={pupil.r} fill="currentColor" opacity={opacityOf(pupil)} />
            )}
          </motion.g>
        )}
      </g>
    </svg>
  );
}
