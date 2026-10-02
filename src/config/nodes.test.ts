import { describe, expect, it } from "vitest";
import { HOME_NODE, NODES, nodeIndexForPath } from "./nodes";

describe("scene nodes", () => {
  it("includes all nine navigation sections with icons from the chosen ranges", () => {
    expect(NODES.map((node) => node.href)).toEqual([
      "/projects",
      "/brain",
      "/bookmarks",
      "/about",
      "/things",
      "/experience",
      "/education",
      "/connect",
      "/media",
    ]);

    for (const node of [...NODES, HOME_NODE]) {
      const codePoint = node.icon.codePointAt(0)!;
      expect(codePoint >= 0x25c9 && codePoint <= 0x25d7 || codePoint >= 0x25ef && codePoint <= 0x25f7).toBe(true);
    }
  });

  it("selects experience and education routes including nested paths", () => {
    expect(NODES[nodeIndexForPath("/experience")].slug).toBe("experience");
    expect(NODES[nodeIndexForPath("/education/coursework")].slug).toBe("education");
    expect(NODES[nodeIndexForPath("/connect")].slug).toBe("connect");
    expect(NODES[nodeIndexForPath("/media")].slug).toBe("media");
  });
});