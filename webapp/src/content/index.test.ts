import { afterEach, describe, expect, it } from "vitest";
import { REQUIRED, makeContentDir } from "./test-helpers";

const original = process.env.CONTENT_DIR;
afterEach(() => {
  if (original === undefined) delete process.env.CONTENT_DIR;
  else process.env.CONTENT_DIR = original;
});

/**
 * index.ts memoizes, so each test needs a fresh module instance, hence the
 * cache-busting query. Two Vite quirks shape how it is written: the bust
 * value must not contain a dot (Vite reads the transform language from
 * /\.\w+$/ on the raw id, so `0.123` would parse as a numeric extension),
 * and the specifier is built outside the import() call so Vite's
 * dynamic-import-vars plugin does not try to expand it as a glob.
 */
async function freshApi(files: Record<string, string>) {
  process.env.CONTENT_DIR = makeContentDir({ ...REQUIRED, ...files });
  const specifier = `./index?cachebust=${Math.random().toString(36).slice(2)}`;
  return import(specifier) as Promise<typeof import("./index")>;
}

const article = (title: string, extra = "") =>
  `---\ntitle: ${title}\nsummary: ${title} summary\npublishedAt: 2026-09-28\n${extra}---\n\nBody.\n`;

describe("content API", () => {
  it("reads from CONTENT_DIR when it is set", async () => {
    const api = await freshApi({ "articles/one.mdx": article("One") });
    expect(api.getArticles().map((a) => a.slug)).toEqual(["one"]);
  });

  it("returns an article by slug", async () => {
    const api = await freshApi({ "articles/one.mdx": article("One") });
    expect(api.getArticle("one")?.title).toBe("One");
  });

  it("returns null for an unknown article slug", async () => {
    const api = await freshApi({ "articles/one.mdx": article("One") });
    expect(api.getArticle("ghost")).toBeNull();
  });

  it("returns null for an unknown project slug", async () => {
    const api = await freshApi({});
    expect(api.getProject("ghost")).toBeNull();
  });

  it("filters links by type", async () => {
    const api = await freshApi({
      "links/gh.mdx": "---\ntitle: GH\nurl: https://gh.example\ntype: social\n---\n",
      "links/bm.mdx": "---\ntitle: BM\nurl: https://bm.example\ntype: bookmark\n---\n",
    });
    expect(api.getLinks("social").map((l) => l.slug)).toEqual(["gh"]);
    expect(api.getLinks("bookmark").map((l) => l.slug)).toEqual(["bm"]);
    expect(api.getLinks()).toHaveLength(2);
  });

  it("exposes the about singleton and its body", async () => {
    const api = await freshApi({});
    expect(api.getAbout().displayName).toBe("Test Person");
    expect(api.getStatement().body.trim()).toBe("Statement body.");
  });

  it("includes drafts outside production", async () => {
    const api = await freshApi({
      "articles/one.mdx": article("One"),
      "articles/wip.mdx": article("WIP", "draft: true\n"),
    });
    // Vitest runs with NODE_ENV=test, so drafts are visible.
    expect(api.getArticles()).toHaveLength(2);
  });
});
