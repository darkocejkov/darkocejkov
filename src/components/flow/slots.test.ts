import { describe, expect, it } from "vitest";
import { H_PAD, slotsFor } from "./slots";

const iris = { x: 500, y: 300, r: 60 };

describe("slotsFor", () => {
  it("returns the whole width when there is no obstacle", () => {
    expect(slotsFor(800, 0, 20, 100, null)).toEqual([{ left: 0, right: 800 }]);
  });

  it("returns the whole width for a band clear of the obstacle", () => {
    expect(slotsFor(800, 0, 20, 100, iris)).toEqual([{ left: 0, right: 800 }]);
  });

  it("splits a band through the centre into slots on both sides", () => {
    const slots = slotsFor(800, 290, 310, 100, iris);
    expect(slots).toEqual([
      { left: 0, right: 500 - 60 - H_PAD - 100 },
      { left: 500 + 60 + H_PAD - 100, right: 800 },
    ]);
  });

  it("narrows the cut-out near the top of the circle", () => {
    const [left] = slotsFor(800, 230, 245, 100, iris);
    expect(left.right).toBeGreaterThan(500 - 60 - H_PAD - 100);
  });

  it("drops slots too narrow to hold text", () => {
    const slots = slotsFor(500, 290, 310, 380, iris);
    expect(slots).toEqual([{ left: 500 + 60 + H_PAD - 380, right: 500 }]);
  });
});
