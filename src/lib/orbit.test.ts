import { describe, expect, it } from "vitest";
import {
  gazeVector,
  SELECTOR_ANGLE,
  maxPupilOffset,
  nearestNodeIndex,
  orbitPosition,
  rotationForNode,
} from "./orbit";

describe("orbitPosition", () => {
  it("places the first node at 12 o'clock", () => {
    const { x, y } = orbitPosition(0, 4, 100);
    expect(x).toBeCloseTo(0);
    expect(y).toBeCloseTo(-100);
  });

  it("distributes nodes evenly clockwise", () => {
    const { x, y } = orbitPosition(1, 4, 100);
    expect(x).toBeCloseTo(100);
    expect(y).toBeCloseTo(0);
  });

  it("offsets every node by the orbit rotation", () => {
    const { x, y } = orbitPosition(0, 4, 100, Math.PI / 2);
    expect(x).toBeCloseTo(100);
    expect(y).toBeCloseTo(0);
  });
});

describe("rotationForNode / nearestNodeIndex", () => {
  it("round-trips: the rotation that selects node i selects node i", () => {
    for (let i = 0; i < 5; i++) {
      expect(nearestNodeIndex(rotationForNode(i, 5), 5)).toBe(i);
    }
  });

  it("puts the chosen node at the 9 o'clock selector", () => {
    const { x, y } = orbitPosition(2, 5, 100, rotationForNode(2, 5));
    expect(x).toBeCloseTo(-100);
    expect(y).toBeCloseTo(0);
  });

  it("survives rotations wound past a full turn", () => {
    expect(nearestNodeIndex(rotationForNode(3, 5) + Math.PI * 4, 5)).toBe(3);
    expect(nearestNodeIndex(rotationForNode(3, 5) - Math.PI * 6, 5)).toBe(3);
  });

  it("defaults the selector to 9 o'clock", () => {
    expect(SELECTOR_ANGLE).toBeCloseTo(Math.PI);
  });
});

describe("maxPupilOffset", () => {
  it("keeps the pupil clear of the inner edge of its ring", () => {
    // Ring 1 sits at pupil + 40; a 26-wide stroke reaches 13 inward.
    expect(maxPupilOffset(40, 26)).toBe(27);
  });

  it("never returns a negative travel", () => {
    expect(maxPupilOffset(5, 40)).toBe(0);
  });
});

describe("gazeVector", () => {
  const centre = { x: 100, y: 100 };

  it("looks nowhere when the pointer is on the eye", () => {
    expect(gazeVector(centre, centre, 200)).toEqual({ x: 0, y: 0 });
  });

  it("looks right when the pointer is right of the eye", () => {
    const { x, y } = gazeVector({ x: 300, y: 100 }, centre, 200);
    expect(x).toBeCloseTo(1);
    expect(y).toBeCloseTo(0);
  });

  it("looks left when the pointer is left of the eye", () => {
    const { x } = gazeVector({ x: -100, y: 100 }, centre, 200);
    expect(x).toBeCloseTo(-1);
  });

  it("deflects proportionally within the saturation distance", () => {
    const { x, y } = gazeVector({ x: 200, y: 100 }, centre, 200);
    expect(x).toBeCloseTo(0.5);
    expect(y).toBeCloseTo(0);
  });

  it("saturates rather than growing past full travel", () => {
    const near = gazeVector({ x: 300, y: 100 }, centre, 200);
    const far = gazeVector({ x: 9000, y: 100 }, centre, 200);
    expect(far).toEqual(near);
  });

  /**
   * The bug this replaces: viewport-normalised x and y were each clamped to
   * 1 independently, so a corner pointer produced a diagonal of magnitude
   * sqrt(2) and pushed the pupil through its own ring. A direction vector
   * cannot exceed 1 in any direction.
   */
  it("never exceeds unit length on the diagonal", () => {
    const { x, y } = gazeVector({ x: 9000, y: 9000 }, centre, 200);
    expect(Math.hypot(x, y)).toBeCloseTo(1);
    expect(x).toBeCloseTo(Math.SQRT1_2);
    expect(y).toBeCloseTo(Math.SQRT1_2);
  });

  it("points at the pointer regardless of where the eye sits", () => {
    // The docked eye lives at the top-left of the viewport. A pointer below
    // and right of it must read as down-right, even though that pointer is
    // still left of the viewport's centre — which is what the old
    // viewport-relative maths got wrong.
    const railEye = { x: 40, y: 60 };
    const { x, y } = gazeVector({ x: 140, y: 160 }, railEye, 200);
    expect(x).toBeGreaterThan(0);
    expect(y).toBeGreaterThan(0);
  });

  it("stays still rather than dividing by zero at zero saturation", () => {
    expect(gazeVector({ x: 300, y: 300 }, centre, 0)).toEqual({ x: 0, y: 0 });
  });
});
