import { afterEach, describe, expect, it, vi } from "vitest";
import { REQUIRED, makeContentDir } from "./test-helpers";

const original = process.env.CONTENT_DIR;
afterEach(() => {
  if (original === undefined) delete process.env.CONTENT_DIR;
  else process.env.CONTENT_DIR = original;
  // NODE_ENV is typed readonly by Next, so it is stubbed via vi.stubEnv
  // rather than assigned; this puts back whatever value it had before.
  vi.unstubAllEnvs();
});

/**
 * index.ts memoizes, so each test needs a fresh module instance, hence the
 * cache-busting query. The bust value is a module-level counter: unique per
 * test, deterministic, and free of the `.` character. That last point is a
 * Vite quirk — it reads the transform language from /\.\w+$/ on the raw id,
 * so a value such as `0.123` would parse as a numeric extension and index.ts
 * would be transpiled as plain JS. The specifier is also built outside the
 * import() call so Vite's dynamic-import-vars plugin does not try to expand
 * it as a glob.
 */
let n = 0;
async function freshApi(files: Record<string, string>) {
  process.env.CONTENT_DIR = makeContentDir({ ...REQUIRED, ...files });
  const specifier = `./index?cachebust=${n++}`;
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

  it("excludes drafts in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const api = await freshApi({
      "articles/one.mdx": article("One"),
      "articles/wip.mdx": article("WIP", "draft: true\n"),
    });
    expect(api.getArticles().map((a) => a.slug)).toEqual(["one"]);
  });

  it("memoizes the graph in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const api = await freshApi({ "articles/one.mdx": article("One") });
    expect(api.getGraph()).toBe(api.getGraph());
  });

  it("rebuilds the graph on every call outside production", async () => {
    const api = await freshApi({ "articles/one.mdx": article("One") });
    expect(api.getGraph()).not.toBe(api.getGraph());
  });
});
