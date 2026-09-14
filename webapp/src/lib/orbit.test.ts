import { describe, expect, it } from "vitest";
import {
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
