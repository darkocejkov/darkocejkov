import { copyFileSync, mkdirSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import nodePlop from "node-plop";
import { describe, expect, it } from "vitest";
import { load } from "./load";
import { resolve } from "./graph";
import { REQUIRED, makeContentDir } from "./test-helpers";

describe("content generators", () => {
  it("create schema-valid entries for every content collection", async () => {
    const fixtureDir = makeContentDir(REQUIRED);
    const projectDir = mkdtempSync(path.join(tmpdir(), "plop-project-"));
    const contentDir = path.join(projectDir, "content");
    mkdirSync(contentDir);
    for (const singleton of Object.keys(REQUIRED)) {
      copyFileSync(path.join(fixtureDir, singleton), path.join(contentDir, singleton));
    }

    const plop = await nodePlop(path.resolve("plopfile.cjs"), {
      destBasePath: projectDir,
      force: false,
    });
    const examples = [
      ["article", {
        title: 'A "quoted" article',
        summary: "An article summary",
        slug: "quoted-article",
        publishedAt: "2026-09-29",
        category: "notes",
        draft: true,
      }],
      ["project", {
        title: "A project",
        summary: "A project summary",
        slug: "a-project",
        stage: "in-progress",
      }],
      ["artwork", {
        name: "Generated artwork",
        slug: "generated-artwork",
        imageSrc: "/art/generated-artwork.png",
        imageAlt: "Generated artwork",
        imageWidth: 1200,
        imageHeight: 1600,
        description: "Test description",
        medium: "painting",
        materials: "Acrylic",
        year: "2026",
        dimensions: "12 x 16 in",
        series: "Studies",
        order: 10,
      }],
      ["experience", {
        title: "Developer",
        company: "Example Co",
        slug: "developer",
        type: "full-time",
        startDate: "2026-01",
        endDate: "",
      }],
      ["education", {
        title: "A qualification",
        institution: "Example University",
        slug: "a-qualification",
        startDate: "2022-06",
        endDate: "",
      }],
      ["skill", {
        name: "TypeScript",
        slug: "typescript",
        proficiency: "",
        lastUsed: "",
      }],
      ["thing", { name: "A record", slug: "a-record", type: "record", isSelf: false }],
      ["link", {
        title: "Example",
        url: "https://example.com",
        slug: "example",
        type: "bookmark",
        description: "",
      }],
    ] as const;

    for (const [name, answers] of examples) {
      const result = await plop.getGenerator(name).runActions(answers);
      expect(result.failures, name).toEqual([]);
    }

    const graph = resolve(load(contentDir), { includeDrafts: true });
    expect(graph.articles[0].title).toBe('A "quoted" article');
    expect(graph.projects[0].slug).toBe("a-project");
    expect(graph.artworks[0].materials).toBe("Acrylic");
    expect(graph.experience[0].isCurrent).toBe(true);
    expect(graph.education[0].institution).toBe("Example University");
    expect(graph.skills[0].name).toBe("TypeScript");
    expect(graph.things[0].name).toBe("A record");
    expect(graph.links[0].url).toBe("https://example.com");
  });
});