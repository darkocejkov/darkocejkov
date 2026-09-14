/** Geometry for the satellite orbit and the pupil's travel limit. Pure. */

const TAU = Math.PI * 2;

/** The rotary selector sits at 9 o'clock, matching the mockup's left-hand highlight. */
export const SELECTOR_ANGLE = Math.PI;

/** Position of satellite `index` on an orbit of `radius`, relative to the eye's centre. */
export function orbitPosition(
  index: number,
  total: number,
  radius: number,
  rotation = 0,
): { x: number; y: number; angle: number } {
  // -PI/2 starts the ring at 12 o'clock; indices advance clockwise.
  const angle = -Math.PI / 2 + (index / total) * TAU + rotation;
  return { x: radius * Math.cos(angle), y: radius * Math.sin(angle), angle };
}

/** Shortest signed distance between two angles, in -PI..PI. */
function angleDelta(a: number, b: number): number {
  return (((a - b + Math.PI) % TAU) + TAU) % TAU - Math.PI;
}

/** Which satellite currently sits closest to the selector. */
export function nearestNodeIndex(rotation: number, total: number, selectorAngle = SELECTOR_ANGLE): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < total; i++) {
    const { angle } = orbitPosition(i, total, 1, rotation);
    const dist = Math.abs(angleDelta(angle, selectorAngle));
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return best;
}

/** The orbit rotation that parks satellite `index` on the selector. */
export function rotationForNode(index: number, total: number, selectorAngle = SELECTOR_ANGLE): number {
  return selectorAngle + Math.PI / 2 - (index / total) * TAU;
}

/**
 * How far the pupil may travel before colliding with ring 1.
 *
 * Ring 1's inner edge is at `pupil + spacing - stroke / 2`, and the pupil's own
 * radius is `pupil`, so the clearance is `spacing - stroke / 2` regardless of
 * pupil size. Recompute whenever spacing or stroke animate.
 */
export function maxPupilOffset(spacing: number, stroke: number): number {
  return Math.max(0, spacing - stroke / 2);
}
