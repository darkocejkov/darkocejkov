import { describe, expect, it } from "vitest";
import { readingTime } from "./text";

describe("readingTime", () => {
  it("returns null for empty text", () => {
    expect(readingTime("")).toBeNull();
    expect(readingTime("   \n  ")).toBeNull();
  });

  it("rounds up to a minimum of one minute", () => {
    expect(readingTime("Three whole words")).toBe(1);
  });

  it("estimates at roughly 200 words per minute", () => {
    expect(readingTime(Array(600).fill("word").join(" "))).toBe(3);
  });

  it("ignores fenced code blocks, which are not read at prose speed", () => {
    const prose = Array(200).fill("word").join(" ");
    const code = ["```ts", Array(400).fill("const x = 1;").join("\n"), "```"].join("\n");
    expect(readingTime(`${prose}\n\n${code}`)).toBe(1);
  });

  it("counts a JSX component line as negligible rather than as prose", () => {
    expect(readingTime('<Gallery images={["a", "b"]} />')).toBeNull();
  });
});
