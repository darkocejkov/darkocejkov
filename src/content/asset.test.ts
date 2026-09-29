import { afterEach, describe, expect, it } from "vitest";
import { assetUrl, isExternalHref } from "./asset";

const original = process.env.NEXT_PUBLIC_CMS_URL;
afterEach(() => {
  if (original === undefined) delete process.env.NEXT_PUBLIC_CMS_URL;
  else process.env.NEXT_PUBLIC_CMS_URL = original;
});

describe("assetUrl", () => {
  it("prefixes an upload path with the configured CMS origin", () => {
    process.env.NEXT_PUBLIC_CMS_URL = "https://cms.darkocejkov.ca";
    expect(assetUrl("/uploads/a.png")).toBe("https://cms.darkocejkov.ca/uploads/a.png");
  });

  it("falls back to localhost when no CMS origin is configured", () => {
    delete process.env.NEXT_PUBLIC_CMS_URL;
    expect(assetUrl("/uploads/a.png")).toBe("http://localhost:1337/uploads/a.png");
  });

  it("leaves an absolute URL untouched", () => {
    expect(assetUrl("https://example.com/a.png")).toBe("https://example.com/a.png");
  });

  it("reads the origin per call, so a changed env var takes effect", () => {
    process.env.NEXT_PUBLIC_CMS_URL = "https://one.example";
    expect(assetUrl("/uploads/a.png")).toBe("https://one.example/uploads/a.png");
    process.env.NEXT_PUBLIC_CMS_URL = "https://two.example";
    expect(assetUrl("/uploads/a.png")).toBe("https://two.example/uploads/a.png");
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
