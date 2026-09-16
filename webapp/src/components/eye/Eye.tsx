"use client";

import { useId } from "react";
import { motion, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { ringGeometry, type RingParams } from "@/lib/circularity";

/**
 * Lid radius as a multiple of the iris. Just over 1 so that at full travel it
 * covers the iris outright instead of leaving a sliver at the edges.
 */
const LID_SCALE = 1.06;

/**
 * Width of the fade front, in ring indices. Narrow enough that a ring is
 * essentially cut rather than faded — the front reads as an edge sweeping
 * outwards instead of a soft gradient trailing behind it.
 *
 * The iris is a single element the front crosses in one step, so at this
 * width it snaps out rather than dissolving. That is the intent; widening
 * this is what softens it again.
 */
const FADE_EDGE = 0.22;

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
   * Eyelid position, 0 open to 1 shut. The lid is a circle subtracted from the
   * iris, descending from above, so what remains is a bowl at the bottom that
   * thins as it closes. Omit it and the iris simply stays open.
   */
  blink?: MotionValue<number>;
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
  blink,
  className,
}: EyeProps) {
  const rings = ringGeometry(params);
  const centre = size / 2;
  const pupil = rings.find((r) => r.k === 0);
  const outer = rings.filter((r) => r.k > 0);

  // Masks are referenced by id, and this component renders more than once on a
  // content route — the centre eye and the rail's. Sharing an id would point
  // both at whichever mounted last.
  const maskId = `blink-${useId()}`;

  // The lid is just another circle, subtracted from the iris. Slightly larger
  // so that at full travel it clears the iris completely rather than leaving a
  // rim. It starts tangent above, so at rest nothing is covered.
  const lidR = (pupil?.r ?? 0) * LID_SCALE;
  const lidTravel = (pupil?.r ?? 0) + lidR;

  // Hooks cannot be conditional, so the fallback is always created and only
  // its use is chosen — the same shape Orbit uses for its optional rotation.
  const stillLid = useMotionValue(0);
  const lidY = useTransform(blink ?? stillLid, (t) => t * lidTravel);

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
      {pupil && (
        <defs>
          {/* White shows, black hides. The lid rides in on a translated group
              rather than an animated cy, because a transform is the one thing
              every renderer animates the same way. */}
          <mask id={maskId} maskUnits="userSpaceOnUse">
            <rect
              x={-pupil.r * 2}
              y={-pupil.r * 2}
              width={pupil.r * 4}
              height={pupil.r * 4}
              fill="white"
            />
            <motion.g style={{ y: lidY }}>
              <circle cx={0} cy={-lidTravel} r={lidR} fill="black" />
            </motion.g>
          </mask>
        </defs>
      )}
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
          <motion.g style={{ x: pupilX, y: pupilY }} mask={`url(#${maskId})`}>
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
