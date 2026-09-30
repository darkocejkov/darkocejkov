import { describe, expect, it } from "vitest";
import { assetUrl, isExternalHref } from "./asset";

describe("assetUrl", () => {
  it("resolves art paths against the R2 public domain", () => {
    expect(assetUrl("/art/portrait.png")).toBe("https://assets.darkocejkov.ca/art/portrait.png");
  });

  it("resolves assets and resume paths against the same bucket", () => {
    expect(assetUrl("/assets/object.png")).toBe("https://assets.darkocejkov.ca/assets/object.png");
    expect(assetUrl("/resume/cv.pdf")).toBe("https://assets.darkocejkov.ca/resume/cv.pdf");
  });

  it("leaves an absolute URL untouched", () => {
    expect(assetUrl("https://example.com/a.png")).toBe("https://example.com/a.png");
  });

});

describe("isExternalHref", () => {
  it("treats a site-relative link as internal", () => {
    expect(isExternalHref("/blog/on-circles")).toBe(false);
  });

  it("treats an anchor as internal", () => {
    expect(isExternalHref("#footnote-1")).toBe(false);
  });

  it("treats an http URL as external", () => {
    expect(isExternalHref("https://example.com")).toBe(true);
  });

  it("treats a mailto link as external", () => {
    expect(isExternalHref("mailto:me@example.com")).toBe(true);
  });
});
