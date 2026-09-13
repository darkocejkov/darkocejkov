import { describe, expect, it } from "vitest";
import { ringGeometry } from "./circularity";

const base = { pupil: 46, spacing: 40, count: 2, stroke: 26 };

describe("ringGeometry", () => {
  it("emits the pupil at k=0 and one ring at k=1 for count 2", () => {
    const rings = ringGeometry(base);
    expect(rings.map((r) => r.k)).toEqual([0, 1]);
    expect(rings[0].r).toBe(46);
    expect(rings[1].r).toBe(86);
  });

  it("spaces rings linearly when spacingGrowth is 1", () => {
    const rings = ringGeometry({ ...base, count: 4, spacing: 10, pupil: 5 });
    expect(rings.map((r) => r.r)).toEqual([5, 15, 25, 35]);
  });

  it("compounds spacing geometrically when spacingGrowth is not 1", () => {
    const rings = ringGeometry({ ...base, count: 3, spacing: 10, pupil: 0, spacingGrowth: 2 });
    // r0 + spacing * (g^k - 1) / (g - 1)  ->  0, 10, 30
    expect(rings.map((r) => r.r)).toEqual([0, 10, 30]);
  });

  it("applies taper to stroke width per ring index", () => {
    const rings = ringGeometry({ ...base, count: 3, stroke: 8, taper: 0.5 });
    expect(rings.map((r) => r.strokeWidth)).toEqual([8, 4, 2]);
  });

  it("fades the outermost ring in when count is fractional", () => {
    const rings = ringGeometry({ ...base, count: 2.5 });
    expect(rings).toHaveLength(3);
    expect(rings[0].opacity).toBe(1);
    expect(rings[1].opacity).toBe(1);
    expect(rings[2].opacity).toBeCloseTo(0.5);
    // Stroke width scales with opacity so the ring thins in as it fades in.
    expect(rings[2].strokeWidth).toBeCloseTo(base.stroke * 0.5);
  });

  it("emits no path data under neutral parameters — circles, never paths", () => {
    const rings = ringGeometry({ ...base, count: 9 });
    expect(rings.every((r) => r.d === undefined)).toBe(true);
  });

  it("emits path data once a wave amplitude is set", () => {
    const rings = ringGeometry({ ...base, count: 4, amplitude: 5 });
    // k=0 has u=0 so its amplitude is still 0 and it stays a circle.
    expect(rings[0].d).toBeUndefined();
    expect(rings[3].d).toBeDefined();
    expect(rings[3].d!.startsWith("M")).toBe(true);
  });

  it("emits path data once the outer shape is a polygon", () => {
    const rings = ringGeometry({ ...base, count: 4, outerSides: 6 });
    expect(rings[3].d).toBeDefined();
  });

  it("returns only the pupil for count 1", () => {
    expect(ringGeometry({ ...base, count: 1 })).toHaveLength(1);
  });

  it("returns nothing for count 0", () => {
    expect(ringGeometry({ ...base, count: 0 })).toHaveLength(0);
  });
});
