import { describe, expect, it } from "vitest";
import { faceFront, fibonacciSphere, nearestAngle, perspective, rotate } from "./sphere";

describe("fibonacciSphere", () => {
  it("puts every point on the unit sphere", () => {
    for (const p of fibonacciSphere(50)) {
      expect(Math.hypot(p.x, p.y, p.z)).toBeCloseTo(1);
    }
  });

  it("spans pole to pole", () => {
    const ys = fibonacciSphere(40).map((p) => p.y);
    expect(Math.max(...ys)).toBeGreaterThan(0.9);
    expect(Math.min(...ys)).toBeLessThan(-0.9);
  });
});

describe("faceFront", () => {
  it("rotates any point to face the viewer", () => {
    for (const p of fibonacciSphere(12)) {
      const { yaw, pitch } = faceFront(p);
      const front = rotate(p, yaw, pitch);
      expect(front.x).toBeCloseTo(0);
      expect(front.y).toBeCloseTo(0);
      expect(front.z).toBeCloseTo(1);
    }
  });
});

describe("perspective", () => {
  it("enlarges near points and shrinks far ones", () => {
    expect(perspective(1, 3)).toBeGreaterThan(1);
    expect(perspective(0, 3)).toBe(1);
    expect(perspective(-1, 3)).toBeLessThan(1);
  });
});

describe("nearestAngle", () => {
  it("takes the short way round", () => {
    expect(nearestAngle(0, 2 * Math.PI - 0.1)).toBeCloseTo(-0.1);
    expect(nearestAngle(10 * Math.PI, 0.2)).toBeCloseTo(10 * Math.PI + 0.2);
  });
});
