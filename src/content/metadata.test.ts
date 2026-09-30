import { describe, expect, it } from "vitest";
import { isNotificationActive } from "./metadata";

describe("isNotificationActive", () => {
  const now = new Date("2026-09-29T12:00:00.000Z");

  it("keeps undated notifications active", () => {
    expect(isNotificationActive({ message: "Hello", level: "info" }, now)).toBe(true);
  });

  it("respects start and end times", () => {
    expect(isNotificationActive({ message: "Soon", level: "info", startsAt: "2026-10-01T00:00:00Z" }, now)).toBe(false);
    expect(isNotificationActive({ message: "Expired", level: "info", endsAt: "2026-09-28T00:00:00Z" }, now)).toBe(false);
    expect(isNotificationActive({ message: "Current", level: "info", startsAt: "2026-09-28T00:00:00Z", endsAt: "2026-10-01T00:00:00Z" }, now)).toBe(true);
  });
});