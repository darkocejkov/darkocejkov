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
 * Corner radius of the crescent's tips, as a fraction of the iris radius.
 * Proportional so the rail's small eye rounds by the same amount relatively.
 */
const CORNER_ROUND = 0.085;

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
  /**
   * The transition wave, drawn outside the resting eye and on its own spacing
   * and stroke. Separate because one uniform spacing cannot serve both: the
   * resting eye wants a heavy ring held well clear of the iris (which is also
   * what gives the pupil room to travel), while the wave wants many fine rings
   * packed close. Tying them together means tightening the wave drags the
   * resting ring inwards onto the iris.
   *
   * Its `pupil` is the radius of its innermost ring — nothing is filled here,
   * every ring is stroked. Indices continue on from the resting eye's, so the
   * fade front sweeps through both as one sequence.
   */
  wave?: RingParams;
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
   * Hold the resting eye's rings at full opacity, letting the front pass over
   * only the wave. Set when the transition ends on the homepage, where the eye
   * has to still be there afterwards; without it, clearing the wave at the end
   * would pop the resting ring back in.
   *
   * Cleared when leaving for a content route, so the eye empties from its
   * centre outwards rather than fading out as a whole at the end.
   *
   * Never applies to the pupil, which is exempt from the front either way —
   * it leaves by closing. See `blink`.
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
  wave,
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
  const core = ringGeometry(params);
  const centre = size / 2;
  const pupil = core.find((r) => r.k === 0);

  // The wave's own ring 0 is not a pupil — it is simply its innermost ring, so
  // it is stroked along with the rest. Reindexing it to sit after the resting
  // eye keeps k a single ascending sequence, which is what lets one fade front
  // travel through both sets and keeps React keys unique.
  const waveRings = wave
    ? ringGeometry(wave).map((ring) => ({ ...ring, k: ring.k + core.length }))
    : [];
  const outer = [...core.filter((r) => r.k > 0), ...waveRings];

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

  const roundId = `round-${useId()}`;
  const cornerRadius = (pupil?.r ?? 0) * CORNER_ROUND;

  const opacityOf = (ring: (typeof core)[number]) => {
    // The pupil is exempt whichever way the transition is going: it leaves by
    // closing, not by fading. The front reaches index 0 within a few ms of
    // starting, so letting it cut the iris too would erase it before the lid
    // had moved at all — the exit would be over before it was visible.
    if (ring.k === 0) return ring.opacity;
    // The rest of the resting eye survives only when the eye has to still be
    // there afterwards. The wave beyond it is always consumable.
    if (protectCore && ring.k < core.length) return ring.opacity;
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
              every renderer animates the same way.

              x/y/width/height are set explicitly. Without them SVG falls back
              to -10%/-10%/120%/120% resolved against the VIEWPORT, not the
              masked object — which inside this group's translate cropped the
              iris square on its left and top while leaving the other two sides
              round. The region is given in the referencing element's own user
              space, where the iris is centred on the origin. */}
          <mask
            id={maskId}
            maskUnits="userSpaceOnUse"
            x={-pupil.r * 3}
            y={-pupil.r * 3}
            width={pupil.r * 6}
            height={pupil.r * 6}
          >
            <rect
              x={-pupil.r * 3}
              y={-pupil.r * 3}
              width={pupil.r * 6}
              height={pupil.r * 6}
              fill="white"
            />
            <motion.g style={{ y: lidY }}>
              <circle cx={0} cy={-lidTravel} r={lidR} fill="black" />
            </motion.g>
          </mask>

          {/* Rounds the crescent's tips. Where the lid crosses the iris the
              two circles meet at a cusp; blurring and then hard-thresholding
              the alpha turns each cusp into an arc of roughly the blur's
              radius, leaving the rest of the outline where it was.

              It has to sit on a PARENT of the masked group: on the same
              element SVG applies the filter before the mask, so it would
              round nothing the mask went on to cut. */}
          <filter
            id={roundId}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur stdDeviation={cornerRadius} result="softened" />
            <feColorMatrix
              in="softened"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 18 -9"
            />
          </filter>
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
          <g filter={`url(#${roundId})`}>
            <motion.g style={{ x: pupilX, y: pupilY }} mask={`url(#${maskId})`}>
              {pupil.d ? (
                <path d={pupil.d} fill="currentColor" opacity={opacityOf(pupil)} />
              ) : (
                <circle r={pupil.r} fill="currentColor" opacity={opacityOf(pupil)} />
              )}
            </motion.g>
          </g>
        )}
      </g>
    </svg>
  );
}
