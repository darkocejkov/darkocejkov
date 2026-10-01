import type { IrisObstacle } from "@/components/eye/irisObstacle";

export const MIN_SLOT_WIDTH = 64;
export const H_PAD = 18;
export const V_PAD = 4;

export interface Slot {
  left: number;
  right: number;
}

/**
 * Horizontal slots left in a line band once a circular obstacle is cut out,
 * in coordinates relative to the block's left edge. Slots narrower than
 * MIN_SLOT_WIDTH are dropped, so a band the obstacle covers yields none.
 */
export function slotsFor(
  width: number,
  bandTop: number,
  bandBottom: number,
  left: number,
  obstacle: IrisObstacle | null,
): Slot[] {
  const full = { left: 0, right: width };
  if (!obstacle) return [full];
  const top = bandTop - V_PAD;
  const bottom = bandBottom + V_PAD;
  if (top >= obstacle.y + obstacle.r || bottom <= obstacle.y - obstacle.r) return [full];

  const dy =
    obstacle.y >= top && obstacle.y <= bottom
      ? 0
      : Math.min(Math.abs(obstacle.y - top), Math.abs(obstacle.y - bottom));
  const half = Math.sqrt(Math.max(0, obstacle.r * obstacle.r - dy * dy));
  const blockLeft = obstacle.x - half - H_PAD - left;
  const blockRight = obstacle.x + half + H_PAD - left;

  return [
    { left: 0, right: Math.min(width, blockLeft) },
    { left: Math.max(0, blockRight), right: width },
  ].filter((slot) => slot.right - slot.left >= MIN_SLOT_WIDTH);
}
