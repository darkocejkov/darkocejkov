import { describe, expect, it } from "vitest";
import {
  ArticleFrontmatter,
  Asset,
  ExperienceFrontmatter,
  LinkFrontmatter,
  MetadataFrontmatter,
  ProjectFrontmatter,
  ResumeDownload,
} from "./schema";

describe("Asset", () => {
  it("accepts high-quality art and general asset paths", () => {
    expect(Asset.parse({ src: "/art/portrait.png", alt: "Me" }).src).toBe("/art/portrait.png");
    expect(Asset.parse({ src: "/assets/object.png", alt: "Object" }).src).toBe("/assets/object.png");
  });

  it("rejects absolute URLs and unsupported bucket folders", () => {
    const result = Asset.safeParse({
      src: "https://assets.darkocejkov.ca/art/portrait.png",
      alt: "Me",
    });
    expect(result.success).toBe(false);
    expect(Asset.safeParse({ src: "/resume/cv.pdf", alt: "CV" }).success).toBe(false);
  });

  it("requires alt text so images cannot ship without it", () => {
    expect(Asset.safeParse({ src: "/art/a.png" }).success).toBe(false);
  });
});

describe("metadata frontmatter", () => {
  it("defaults availability, notifications, and downloads", () => {
    expect(MetadataFrontmatter.parse({})).toEqual({
      lookingForWork: false,
      currently: null,
      underConstruction: false,
      notifications: [],
      downloads: [],
    });
  });

  it("normalizes YAML notification dates and validates resume file paths", () => {
    const result = MetadataFrontmatter.parse({
      notifications: [{ message: "Notice", startsAt: new Date("2026-10-01T00:00:00Z") }],
    });
    expect(result.notifications[0].startsAt).toBe("2026-10-01T00:00:00.000Z");
  });

  it("accepts resume downloads only from the resume folder", () => {
    expect(ResumeDownload.safeParse({ title: "CV", file: "/resume/cv.pdf" }).success).toBe(true);
    expect(ResumeDownload.safeParse({ title: "CV", file: "/assets/cv.pdf" }).success).toBe(false);
  });
});

describe("date coercion", () => {
  // gray-matter parses YAML with js-yaml, which turns an unquoted 2024-06-01
  // into a JS Date. Every date field has to survive that.
  it("accepts a Date instance and normalises it to YYYY-MM-DD", () => {
    const result = ExperienceFrontmatter.parse({
      title: "Software Engineer",
      company: "Moz",
      startDate: new Date("2024-06-01T00:00:00Z"),
    });
    expect(result.startDate).toBe("2024-06-01");
  });

  it("accepts a quoted string date", () => {
    const result = ExperienceFrontmatter.parse({
      title: "Software Engineer",
      company: "Moz",
      startDate: "2024-06-01",
    });
    expect(result.startDate).toBe("2024-06-01");
  });

  it("accepts a year-month date", () => {
    const result = ExperienceFrontmatter.parse({
      title: "Software Engineer",
      company: "Moz",
      startDate: "2024-06",
    });
    expect(result.startDate).toBe("2024-06");
  });

  it("rejects a malformed date", () => {
    const result = ExperienceFrontmatter.safeParse({
      title: "Software Engineer",
      company: "Moz",
      startDate: "June 2024",
    });
    expect(result.success).toBe(false);
  });
});

describe("ExperienceFrontmatter", () => {
  it("defaults skills to an empty array", () => {
    const result = ExperienceFrontmatter.parse({
      title: "Software Engineer",
      company: "Moz",
      startDate: "2024-06-01",
    });
    expect(result.skills).toEqual([]);
  });

  it("rejects an employment type outside the enum", () => {
    const result = ExperienceFrontmatter.safeParse({
      title: "Software Engineer",
      company: "Moz",
      startDate: "2024-06-01",
      type: "freelance",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a skill reference that is not a kebab-case slug", () => {
    const result = ExperienceFrontmatter.safeParse({
      title: "Software Engineer",
      company: "Moz",
      startDate: "2024-06-01",
      skills: ["TypeScript"],
    });
    expect(result.success).toBe(false);
  });

  it("dedupes a repeated skill slug", () => {
    const result = ExperienceFrontmatter.parse({
      title: "Software Engineer",
      company: "Moz",
      startDate: "2024-06-01",
      skills: ["typescript", "react", "typescript"],
    });
    expect(result.skills).toEqual(["typescript", "react"]);
  });
});

describe("ArticleFrontmatter", () => {
  it("defaults draft to false", () => {
    const result = ArticleFrontmatter.parse({
      title: "On circles",
      summary: "A post",
      publishedAt: "2026-09-28",
    });
    expect(result.draft).toBe(false);
  });

  it("defaults related and tags to empty arrays", () => {
    const result = ArticleFrontmatter.parse({
      title: "On circles",
      summary: "A post",
      publishedAt: "2026-09-28",
    });
    expect(result.related).toEqual([]);
    expect(result.tags).toEqual([]);
  });

  // A copy-pasted slug in a YAML list is an ordinary authoring mistake; left
  // alone it shows the same article twice under "Linked from".
  it("dedupes a repeated related slug, keeping first-seen order", () => {
    const result = ArticleFrontmatter.parse({
      title: "On circles",
      summary: "A post",
      publishedAt: "2026-09-28",
      related: ["on-rings", "on-circles-again", "on-rings"],
    });
    expect(result.related).toEqual(["on-rings", "on-circles-again"]);
  });

  it("dedupes a repeated tag", () => {
    const result = ArticleFrontmatter.parse({
      title: "On circles",
      summary: "A post",
      publishedAt: "2026-09-28",
      tags: ["design", "svg", "design"],
    });
    expect(result.tags).toEqual(["design", "svg"]);
  });
});

describe("ProjectFrontmatter", () => {
  it("defaults featured to false and order to zero", () => {
    const result = ProjectFrontmatter.parse({ title: "Orbit Rail", summary: "A thing" });
    expect(result.featured).toBe(false);
    expect(result.order).toBe(0);
  });

  it("accepts a gallery of assets with captions", () => {
    const result = ProjectFrontmatter.parse({
      title: "Orbit Rail",
      summary: "A thing",
      gallery: [{ src: "/art/a.png", alt: "A", caption: "First" }],
    });
    expect(result.gallery[0].caption).toBe("First");
  });

  it("dedupes repeated tags and skills", () => {
    const result = ProjectFrontmatter.parse({
      title: "Orbit Rail",
      summary: "A thing",
      tags: ["svg", "svg", "animation"],
      skills: ["typescript", "typescript"],
    });
    expect(result.tags).toEqual(["svg", "animation"]);
    expect(result.skills).toEqual(["typescript"]);
  });

  // Two prints of the same image in a gallery is an editorial choice, not a
  // slip — asset lists are deliberately left alone.
  it("keeps a repeated gallery image", () => {
    const result = ProjectFrontmatter.parse({
      title: "Orbit Rail",
      summary: "A thing",
      gallery: [
        { src: "/art/a.png", alt: "A" },
        { src: "/art/a.png", alt: "A" },
      ],
    });
    expect(result.gallery).toHaveLength(2);
  });
});

describe("LinkFrontmatter", () => {
  it("requires a valid url", () => {
    expect(
      LinkFrontmatter.safeParse({ title: "GitHub", url: "not-a-url", type: "social" }).success
    ).toBe(false);
  });
});
