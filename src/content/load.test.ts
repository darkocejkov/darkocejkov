import path from "node:path";
import { describe, expect, it } from "vitest";
import { ContentError, load } from "./load";
import { REQUIRED, makeContentDir } from "./test-helpers";

const article = (title: string, extra = "") =>
  `---\ntitle: ${title}\nsummary: A summary\npublishedAt: 2026-09-28\n${extra}---\n\nBody text.\n`;

describe("load", () => {
  it("reads an article, using the filename as the slug", () => {
    const dir = makeContentDir({ ...REQUIRED, "articles/on-circles.mdx": article("On circles") });
    const loaded = load(dir);
    expect(loaded.articles).toHaveLength(1);
    expect(loaded.articles[0].slug).toBe("on-circles");
    expect(loaded.articles[0].data.title).toBe("On circles");
    expect(loaded.articles[0].body.trim()).toBe("Body text.");
  });

  it("records the file path on each entry for error reporting", () => {
    const dir = makeContentDir({ ...REQUIRED, "articles/on-circles.mdx": article("On circles") });
    expect(load(dir).articles[0].file).toBe(path.join("articles", "on-circles.mdx"));
  });

  it("loads the about and statement singletons", () => {
    const dir = makeContentDir(REQUIRED);
    const loaded = load(dir);
    expect(loaded.about.data.displayName).toBe("Test Person");
    expect(loaded.statement.body.trim()).toBe("Statement body.");
  });

  it("loads the articles landing page singleton", () => {
    const loaded = load(makeContentDir(REQUIRED));
    expect(loaded.articlesPage.data).toEqual({ title: "Articles", subtitle: "A subtitle" });
    expect(loaded.articlesPage.body.trim()).toBe("Articles description.");
  });

  it("loads site metadata and its defaulted collections", () => {
    const loaded = load(makeContentDir(REQUIRED));
    expect(loaded.metadata.data).toEqual({
      lookingForWork: false,
      currently: null,
      underConstruction: false,
      notifications: [],
      downloads: [],
    });
  });

  it("returns an empty array for a collection with no directory", () => {
    const loaded = load(makeContentDir(REQUIRED));
    expect(loaded.things).toEqual([]);
    expect(loaded.projects).toEqual([]);
  });

  it("returns an empty array for a collection directory holding no mdx files", () => {
    const dir = makeContentDir({ ...REQUIRED, "things/notes.txt": "ignore me" });
    expect(load(dir).things).toEqual([]);
  });

  it("ignores non-mdx files inside a collection", () => {
    const dir = makeContentDir({
      ...REQUIRED,
      "articles/on-circles.mdx": article("On circles"),
      "articles/.DS_Store": "junk",
    });
    expect(load(dir).articles).toHaveLength(1);
  });

  it("throws when the content directory does not exist", () => {
    expect(() => load(path.join(makeContentDir({}), "nope"))).toThrow(ContentError);
  });

  it("throws when the content directory is empty", () => {
    expect(() => load(makeContentDir({}))).toThrow(/about\.mdx/);
  });

  it("rejects a filename that is not a kebab-case slug", () => {
    const dir = makeContentDir({ ...REQUIRED, "articles/On Circles.mdx": article("On circles") });
    expect(() => load(dir)).toThrow(/On Circles\.mdx/);
  });

  it("rejects an underscored filename", () => {
    const dir = makeContentDir({ ...REQUIRED, "articles/on_circles.mdx": article("On circles") });
    expect(() => load(dir)).toThrow(/on_circles\.mdx/);
  });

  it("reports a file with no frontmatter as missing its required fields", () => {
    const dir = makeContentDir({ ...REQUIRED, "articles/bare.mdx": "Just a body, no frontmatter.\n" });
    let issues: string[] = [];
    try {
      load(dir);
    } catch (e) {
      issues = (e as ContentError).issues;
    }
    expect(issues.join("\n")).toMatch(/bare\.mdx/);
    expect(issues.join("\n")).toMatch(/title/);
  });

  it("collects every failure rather than stopping at the first", () => {
    const dir = makeContentDir({
      ...REQUIRED,
      "articles/one.mdx": "---\nsummary: No title\npublishedAt: 2026-09-28\n---\n",
      "articles/two.mdx": "---\ntitle: No summary\npublishedAt: 2026-09-28\n---\n",
      "articles/three.mdx": "---\ntitle: T\nsummary: S\n---\n",
    });
    let issues: string[] = [];
    try {
      load(dir);
    } catch (e) {
      issues = (e as ContentError).issues;
    }
    expect(issues.join("\n")).toMatch(/one\.mdx/);
    expect(issues.join("\n")).toMatch(/two\.mdx/);
    expect(issues.join("\n")).toMatch(/three\.mdx/);
  });

  it("reports malformed YAML as an issue alongside schema failures in other files", () => {
    const dir = makeContentDir({
      ...REQUIRED,
      "articles/broken.mdx": '---\ntitle: "unterminated\n---\n',
      "articles/no-title.mdx": "---\nsummary: No title\npublishedAt: 2026-09-28\n---\n",
    });
    let issues: string[] = [];
    try {
      load(dir);
    } catch (e) {
      expect(e).toBeInstanceOf(ContentError);
      issues = (e as ContentError).issues;
    }
    expect(issues.join("\n")).toMatch(/broken\.mdx: invalid frontmatter/);
    expect(issues.join("\n")).toMatch(/no-title\.mdx/);
  });

  it("parses an unquoted YAML date without failing validation", () => {
    const dir = makeContentDir({
      ...REQUIRED,
      "experience/moz.mdx":
        "---\ntitle: Software Engineer\ncompany: Moz\nstartDate: 2024-06-01\n---\n\nWork.\n",
    });
    expect(load(dir).experience[0].data.startDate).toBe("2024-06-01");
  });

  it("returns entries in filename order for determinism", () => {
    const dir = makeContentDir({
      ...REQUIRED,
      "articles/beta.mdx": article("Beta"),
      "articles/alpha.mdx": article("Alpha"),
    });
    expect(load(dir).articles.map((a) => a.slug)).toEqual(["alpha", "beta"]);
  });

  it("keeps drafts, leaving the decision to exclude them to the graph", () => {
    const dir = makeContentDir({
      ...REQUIRED,
      "articles/wip.mdx": article("WIP", "draft: true\n"),
    });
    expect(load(dir).articles).toHaveLength(1);
    expect(load(dir).articles[0].data.draft).toBe(true);
  });
});
