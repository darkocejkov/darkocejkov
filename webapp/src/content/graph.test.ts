import { describe, expect, it } from "vitest";
import { ContentError, load } from "./load";
import { resolve } from "./graph";
import { REQUIRED, makeContentDir } from "./test-helpers";

const article = (title: string, extra = "") =>
  `---\ntitle: ${title}\nsummary: ${title} summary\npublishedAt: 2026-09-28\n${extra}---\n\nBody.\n`;

const skill = (name: string) => `---\nname: ${name}\n---\n\nA skill.\n`;

const project = (title: string, extra = "") =>
  `---\ntitle: ${title}\nsummary: ${title} summary\n${extra}---\n\nProject body.\n`;

function build(files: Record<string, string>, includeDrafts = false) {
  return resolve(load(makeContentDir({ ...REQUIRED, ...files })), { includeDrafts });
}

describe("skill resolution", () => {
  it("resolves a skill slug into the full skill object", () => {
    const graph = build({
      "skills/typescript.mdx": skill("TypeScript"),
      "projects/orbit.mdx": project("Orbit", "skills: [typescript]\n"),
    });
    expect(graph.projects[0].skills[0].name).toBe("TypeScript");
  });

  it("errors on an unknown skill slug, naming the file and the slug", () => {
    expect(() =>
      build({ "projects/orbit.mdx": project("Orbit", "skills: [rst]\n") })
    ).toThrow(/orbit\.mdx[\s\S]*rst/);
  });

  it("uses the skill body as its description", () => {
    const graph = build({ "skills/typescript.mdx": skill("TypeScript") });
    expect(graph.skills[0].description.trim()).toBe("A skill.");
  });
});

describe("related and backlinks", () => {
  it("resolves related into article references", () => {
    const graph = build({
      "articles/one.mdx": article("One", "related: [two]\n"),
      "articles/two.mdx": article("Two"),
    });
    const one = graph.articles.find((a) => a.slug === "one")!;
    expect(one.related.map((r) => r.slug)).toEqual(["two"]);
  });

  it("derives backlinks by inverting related", () => {
    const graph = build({
      "articles/one.mdx": article("One", "related: [two]\n"),
      "articles/two.mdx": article("Two"),
    });
    const two = graph.articles.find((a) => a.slug === "two")!;
    expect(two.backlinks.map((b) => b.slug)).toEqual(["one"]);
    expect(two.related).toEqual([]);
  });

  it("errors on a related slug that matches no article", () => {
    expect(() => build({ "articles/one.mdx": article("One", "related: [ghost]\n") })).toThrow(
      /one\.mdx[\s\S]*ghost/
    );
  });

  it("errors when an article lists itself as related", () => {
    expect(() => build({ "articles/one.mdx": article("One", "related: [one]\n") })).toThrow(
      /one\.mdx[\s\S]*itself/
    );
  });

  it("drops a related reference to a draft rather than failing the build", () => {
    const graph = build({
      "articles/one.mdx": article("One", "related: [wip]\n"),
      "articles/wip.mdx": article("WIP", "draft: true\n"),
    });
    expect(graph.articles.map((a) => a.slug)).toEqual(["one"]);
    expect(graph.articles[0].related).toEqual([]);
  });

  it("keeps the draft reference when drafts are included", () => {
    const graph = build(
      {
        "articles/one.mdx": article("One", "related: [wip]\n"),
        "articles/wip.mdx": article("WIP", "draft: true\n"),
      },
      true
    );
    const one = graph.articles.find((a) => a.slug === "one")!;
    expect(one.related.map((r) => r.slug)).toEqual(["wip"]);
  });
});

describe("article and project cross-references", () => {
  it("inverts article.project into project.articles", () => {
    const graph = build({
      "projects/orbit.mdx": project("Orbit"),
      "articles/one.mdx": article("One", "project: orbit\n"),
    });
    expect(graph.projects[0].articles.map((a) => a.slug)).toEqual(["one"]);
    expect(graph.articles[0].project?.slug).toBe("orbit");
  });

  it("errors on an article pointing at an unknown project", () => {
    expect(() => build({ "articles/one.mdx": article("One", "project: ghost\n") })).toThrow(
      /one\.mdx[\s\S]*ghost/
    );
  });

  it("excludes a draft article from project.articles", () => {
    const graph = build({
      "projects/orbit.mdx": project("Orbit"),
      "articles/wip.mdx": article("WIP", "draft: true\nproject: orbit\n"),
    });
    expect(graph.projects[0].articles).toEqual([]);
  });
});

describe("drafts", () => {
  it("excludes drafts by default", () => {
    const graph = build({
      "articles/one.mdx": article("One"),
      "articles/wip.mdx": article("WIP", "draft: true\n"),
    });
    expect(graph.articles.map((a) => a.slug)).toEqual(["one"]);
  });

  it("includes drafts when asked", () => {
    const graph = build(
      { "articles/one.mdx": article("One"), "articles/wip.mdx": article("WIP", "draft: true\n") },
      true
    );
    expect(graph.articles).toHaveLength(2);
  });
});

describe("tags", () => {
  it("collects the union of tags across every content type with counts", () => {
    const graph = build({
      "articles/one.mdx": article("One", "tags: [design, svg]\n"),
      "projects/orbit.mdx": project("Orbit", "tags: [svg]\n"),
      "things/juno.mdx": "---\nname: Juno\ntags: [svg]\n---\n\nNotes.\n",
    });
    expect(graph.tags).toEqual([
      { tag: "svg", count: 3 },
      { tag: "design", count: 1 },
    ]);
  });

  it("excludes tags that appear only on drafts", () => {
    const graph = build({ "articles/wip.mdx": article("WIP", "draft: true\ntags: [secret]\n") });
    expect(graph.tags).toEqual([]);
  });
});

describe("sorting and derived fields", () => {
  it("sorts experience by start date, newest first, and derives isCurrent", () => {
    const graph = build({
      "experience/old.mdx":
        "---\ntitle: Junior\ncompany: A\nstartDate: 2020-01-01\nendDate: 2022-01-01\n---\n\nX\n",
      "experience/now.mdx": "---\ntitle: Senior\ncompany: B\nstartDate: 2024-06-01\n---\n\nY\n",
    });
    expect(graph.experience.map((e) => e.slug)).toEqual(["now", "old"]);
    expect(graph.experience[0].isCurrent).toBe(true);
    expect(graph.experience[1].isCurrent).toBe(false);
  });

  it("sorts projects by featured, then order, then start date", () => {
    const graph = build({
      "projects/a.mdx": project("A", "order: 2\n"),
      "projects/b.mdx": project("B", "order: 1\n"),
      "projects/c.mdx": project("C", "featured: true\norder: 9\n"),
    });
    expect(graph.projects.map((p) => p.slug)).toEqual(["c", "b", "a"]);
  });

  it("sorts articles by published date, newest first", () => {
    const graph = build({
      "articles/old.mdx":
        "---\ntitle: Old\nsummary: S\npublishedAt: 2025-01-01\n---\n\nBody.\n",
      "articles/new.mdx":
        "---\ntitle: New\nsummary: S\npublishedAt: 2026-01-01\n---\n\nBody.\n",
    });
    expect(graph.articles.map((a) => a.slug)).toEqual(["new", "old"]);
  });

  it("sorts links by order and keeps social and bookmark together", () => {
    const graph = build({
      "links/b.mdx": "---\ntitle: B\nurl: https://b.example\ntype: social\norder: 2\n---\n",
      "links/a.mdx": "---\ntitle: A\nurl: https://a.example\ntype: bookmark\norder: 1\n---\n",
    });
    expect(graph.links.map((l) => l.slug)).toEqual(["a", "b"]);
  });

  it("attaches a reading-time estimate to each article", () => {
    const graph = build({ "articles/one.mdx": article("One") });
    expect(graph.articles[0].minutes).toBe(1);
  });

  it("carries the about body and statement through", () => {
    const graph = build({});
    expect(graph.about.displayName).toBe("Test Person");
    expect(graph.about.body.trim()).toBe("Bio body.");
    expect(graph.statement.body.trim()).toBe("Statement body.");
  });
});

describe("error accumulation", () => {
  it("reports every unresolved reference in one throw", () => {
    let issues: string[] = [];
    try {
      build({
        "articles/one.mdx": article("One", "related: [ghost]\n"),
        "articles/two.mdx": article("Two", "skills: [nope]\n"),
      });
    } catch (e) {
      issues = (e as ContentError).issues;
    }
    expect(issues.join("\n")).toMatch(/ghost/);
    expect(issues.join("\n")).toMatch(/nope/);
  });
});
