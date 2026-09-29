import { describe, expect, it } from "vitest";
import { formatMonthYear, formatRange } from "./dates";

describe("formatMonthYear", () => {
  it("formats a full date as month and year", () => {
    expect(formatMonthYear("2023-08-14")).toBe("Aug 2023");
  });

  it("formats a year-month date", () => {
    expect(formatMonthYear("2026-09")).toBe("Sep 2026");
  });

  /**
   * Date-only strings parse as UTC midnight. Formatting them in the runtime's
   * local zone shifts anyone west of UTC back a day — and across a month
   * boundary, back a month. Every formatter on this site pins UTC for that
   * reason; this pins the January case, where the slip changes the year too.
   */
  it("does not slip a month when the runtime is behind UTC", () => {
    expect(formatMonthYear("2022-01-01")).toBe("Jan 2022");
  });
});

describe("formatRange", () => {
  it("joins a closed range with an en dash", () => {
    expect(formatRange("2021-03-05", "2023-02-24")).toBe("Mar 2021 – Feb 2023");
  });

  it("reads as present when there is no end", () => {
    expect(formatRange("2023-08-14", undefined)).toBe("Aug 2023 – Present");
  });

  it("collapses a range that starts and ends in the same month", () => {
    expect(formatRange("2021-05-07", "2021-05-30")).toBe("May 2021");
  });
});
