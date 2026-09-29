# Markdown Content Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace Strapi as the source of authored content with MDX files in a repo-root `content/` directory, leaving the CMS responsible only for uploads, downloads, and deploy-independent status.

**Architecture:** A `webapp/src/content/` module loads every MDX file once, validates frontmatter with zod, then resolves cross-references in a second pass to produce an in-memory content graph. Pages import a small public API shaped like the existing Strapi client, so page components change by a line or two rather than being rewritten. Content pages become statically generated; only the maintenance banner, availability flags, and downloads still call the CMS at runtime.

**Tech Stack:** Next.js 16 (App Router, RSC), TypeScript strict, zod, gray-matter, next-mdx-remote, remark-gfm, Vitest.

**Spec:** [docs/superpowers/specs/2026-09-28-markdown-content-layer-design.md](../specs/2026-09-28-markdown-content-layer-design.md)

## Global Constraints

- Content lives at `content/` in the **repository root**, a sibling of `webapp/` — never inside the Next app directory.
- Asset references in frontmatter and MDX are **relative CMS paths** beginning `/uploads/`. Absolute CMS origins are a validation error.
- Filename is the slug. No `id`, `documentId`, or `slug` field appears in any frontmatter.
- Inverse relations (`backlinks`, `project.articles`) are **derived**, never authored.
- `load.ts` and `graph.ts` are pure functions of their arguments and must never read `process.env`. Only `index.ts` consults the environment.
- Unknown reference slugs are errors that fail the build. Both passes **accumulate** every failure before throwing — never fail-fast.
- Strict TypeScript. No `any`. Types are inferred from zod schemas with `z.infer`, never hand-written alongside them.
- Vitest only discovers `src/**/*.test.ts`. Tests are `.ts`, never `.tsx`.
- `turbopack.root` in `next.config.ts` must stay pinned to the app directory. Do not change it.

**Refinement against the spec:** the spec put `includeDrafts` on `load.ts`. It belongs on `graph.ts` instead — `load` always reads every file so that `graph` can tell "this slug is a draft" apart from "this slug does not exist", which is what lets a published article reference a draft without failing the build. Everything else follows the spec as written.

## Review Focus

1. **A published article's `related` points at a draft.** In a production build the draft is excluded, so a naive resolver either errors or emits a dead link. Expected: the reference is silently dropped, and only genuinely unknown slugs error. *(Task 4)*
2. **A filename that is not a valid slug** — `My Project.mdx`, `Orbit_Rail.mdx`, `README.mdx`. Expected: a validation error naming the file, not a route at `/projects/My%20Project`. *(Task 2)*
3. **An empty or absent collection subdirectory** — no `things/` yet. Expected: an empty array. Only a missing or empty *root* `content/` directory throws. *(Task 2)*
4. **A file with no frontmatter at all.** gray-matter returns `{}`. Expected: a zod error naming the file and the missing fields, not a `TypeError` on `undefined`. *(Task 2)*
5. **An article listing its own slug in `related`.** Expected: an error, not an article appearing in its own backlinks. *(Task 4)*

---

### Task 1: Schemas and asset URLs

The foundation: every content shape defined once as a zod schema, plus URL resolution for CMS assets.

**Files:**
- Create: `webapp/src/content/schema.ts`
- Create: `webapp/src/content/asset.ts`
- Create: `webapp/src/content/schema.test.ts`
- Create: `webapp/src/content/asset.test.ts`
- Modify: `webapp/package.json` (dependencies)

**Interfaces:**
- Consumes: nothing.
- Produces: `Asset`, `ExperienceFrontmatter`, `EducationFrontmatter`, `SkillFrontmatter`, `ProjectFrontmatter`, `ArticleFrontmatter`, `ThingFrontmatter`, `LinkFrontmatter`, `AboutFrontmatter`, `StatementFrontmatter` (each a zod schema, each with a same-named inferred type); `assetUrl(src: string): string`; `isExternalHref(href: string): boolean`.

- [ ] **Step 1: Install dependencies**

```bash
cd webapp && npm install zod gray-matter next-mdx-remote
```

- [ ] **Step 2: Write the failing schema tests**

Create `webapp/src/content/schema.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  ArticleFrontmatter,
  Asset,
  ExperienceFrontmatter,
  LinkFrontmatter,
  ProjectFrontmatter,
} from "./schema";

describe("Asset", () => {
  it("accepts a CMS upload path", () => {
    const result = Asset.parse({ src: "/uploads/portrait.png", alt: "Me" });
    expect(result.src).toBe("/uploads/portrait.png");
  });

  it("rejects an absolute CMS URL, which would break when the CMS moves", () => {
    const result = Asset.safeParse({
      src: "http://localhost:1337/uploads/portrait.png",
      alt: "Me",
    });
    expect(result.success).toBe(false);
  });

  it("requires alt text so images cannot ship without it", () => {
    expect(Asset.safeParse({ src: "/uploads/a.png" }).success).toBe(false);
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
      gallery: [{ src: "/uploads/a.png", alt: "A", caption: "First" }],
    });
    expect(result.gallery[0].caption).toBe("First");
  });
});

describe("LinkFrontmatter", () => {
  it("requires a valid url", () => {
    expect(
      LinkFrontmatter.safeParse({ title: "GitHub", url: "not-a-url", type: "social" }).success
    ).toBe(false);
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd webapp && npx vitest run src/content/schema.test.ts`
Expected: FAIL — "Failed to resolve import ./schema"

- [ ] **Step 4: Write the schemas**

Create `webapp/src/content/schema.ts`:

```ts
import { z } from "zod";

/**
 * gray-matter parses frontmatter with js-yaml, which converts an unquoted
 * ISO date into a JS Date. Normalise both spellings to a plain string so
 * the rest of the system never has to care which the author used.
 */
const dateString = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, "must be YYYY-MM-DD or YYYY-MM")
);

/** A reference to another content file, by its filename. */
const slugRef = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase kebab-case slug");

/**
 * zod moved its string-format helpers between v3 (`z.string().url()`) and v4
 * (`z.url()`). Validating by hand keeps this file working on either major.
 */
const urlString = z.string().refine((v) => {
  try {
    new URL(v);
    return true;
  } catch {
    return false;
  }
}, "must be an absolute URL");

const emailString = z
  .string()
  .refine((v) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v), "must be an email address");

/**
 * Assets live in the CMS media library and are referenced by relative path.
 * An absolute URL would bake the CMS origin into content and break on any
 * move; `assetUrl` resolves these at render time instead.
 */
export const Asset = z.object({
  src: z
    .string()
    .regex(/^\/uploads\//, "must be a CMS path beginning with /uploads/"),
  alt: z.string(),
  caption: z.string().optional(),
});
export type Asset = z.infer<typeof Asset>;

export const EmploymentType = z.enum(["internship", "full-time", "part-time", "contract"]);
export type EmploymentType = z.infer<typeof EmploymentType>;

export const Proficiency = z.enum(["novice", "working", "fluent", "deep"]);
export type Proficiency = z.infer<typeof Proficiency>;

export const ThingType = z.enum(["book", "record", "tool", "gear", "furniture", "other"]);
export type ThingType = z.infer<typeof ThingType>;

export const ProjectStage = z.enum(["concept", "in-progress", "shipped", "archived"]);
export type ProjectStage = z.infer<typeof ProjectStage>;

export const LinkType = z.enum(["social", "bookmark"]);
export type LinkType = z.infer<typeof LinkType>;

export const ExperienceFrontmatter = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  companyUrl: urlString.optional(),
  type: EmploymentType.optional(),
  startDate: dateString,
  endDate: dateString.optional(),
  skills: z.array(slugRef).default([]),
});
export type ExperienceFrontmatter = z.infer<typeof ExperienceFrontmatter>;

export const EducationFrontmatter = z.object({
  title: z.string().min(1),
  institution: z.string().min(1),
  startDate: dateString,
  endDate: dateString.optional(),
});
export type EducationFrontmatter = z.infer<typeof EducationFrontmatter>;

export const SkillFrontmatter = z.object({
  name: z.string().min(1),
  proficiency: Proficiency.optional(),
  lastUsed: dateString.optional(),
  iconKey: z.string().optional(),
});
export type SkillFrontmatter = z.infer<typeof SkillFrontmatter>;

export const ProjectFrontmatter = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  cover: Asset.optional(),
  year: z.string().optional(),
  materials: z.string().optional(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  stage: ProjectStage.optional(),
  type: z.string().optional(),
  embedUrl: urlString.optional(),
  startDate: dateString.optional(),
  endDate: dateString.optional(),
  repoUrl: urlString.optional(),
  liveUrl: urlString.optional(),
  tags: z.array(z.string()).default([]),
  skills: z.array(slugRef).default([]),
  gallery: z.array(Asset).default([]),
});
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatter>;

export const ArticleFrontmatter = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  publishedAt: dateString,
  draft: z.boolean().default(false),
  cover: Asset.optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  skills: z.array(slugRef).default([]),
  related: z.array(slugRef).default([]),
  project: slugRef.optional(),
});
export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatter>;

export const ThingFrontmatter = z.object({
  name: z.string().min(1),
  type: ThingType.optional(),
  isSelf: z.boolean().default(false),
  media: z.array(Asset).default([]),
  tags: z.array(z.string()).default([]),
});
export type ThingFrontmatter = z.infer<typeof ThingFrontmatter>;

export const LinkFrontmatter = z.object({
  title: z.string().min(1),
  url: urlString,
  description: z.string().optional(),
  iconKey: z.string().optional(),
  order: z.number().int().default(0),
  savedAt: dateString.optional(),
  type: LinkType,
  tags: z.array(z.string()).default([]),
});
export type LinkFrontmatter = z.infer<typeof LinkFrontmatter>;

export const AboutFrontmatter = z.object({
  displayName: z.string().min(1),
  pronouns: z.string().optional(),
  headline: z.string().optional(),
  shortBio: z.string().optional(),
  portrait: Asset.optional(),
  location: z.string().optional(),
  email: emailString.optional(),
  metaDescription: z.string().optional(),
});
export type AboutFrontmatter = z.infer<typeof AboutFrontmatter>;

export const StatementFrontmatter = z.object({
  title: z.string().min(1),
});
export type StatementFrontmatter = z.infer<typeof StatementFrontmatter>;
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd webapp && npx vitest run src/content/schema.test.ts`
Expected: PASS — 14 tests

- [ ] **Step 6: Write the failing asset tests**

Create `webapp/src/content/asset.test.ts`:

```ts
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
```

- [ ] **Step 7: Run tests to verify they fail**

Run: `cd webapp && npx vitest run src/content/asset.test.ts`
Expected: FAIL — "Failed to resolve import ./asset"

- [ ] **Step 8: Write the asset helpers**

Create `webapp/src/content/asset.ts`:

```ts
const DEFAULT_CMS_URL = "http://localhost:1337";

/**
 * Resolve a relative CMS upload path against the CMS origin. Read per call
 * rather than at module load so tests and multi-environment builds see the
 * value that is current when the URL is actually needed.
 */
export function assetUrl(src: string): string {
  if (/^https?:\/\//.test(src)) return src;
  const base = process.env.NEXT_PUBLIC_CMS_URL ?? DEFAULT_CMS_URL;
  return `${base}${src}`;
}

/** Anything that is not site-relative or an in-page anchor leaves the site. */
export function isExternalHref(href: string): boolean {
  return !href.startsWith("/") && !href.startsWith("#");
}
```

- [ ] **Step 9: Run tests to verify they pass**

Run: `cd webapp && npx vitest run src/content/`
Expected: PASS — 22 tests across both files

- [ ] **Step 10: Commit**

```bash
git add webapp/package.json webapp/package-lock.json webapp/src/content/
git commit -m "Add content schemas and asset URL resolution"
```

---

### Task 2: Loading and validating files

Reads every MDX file, parses frontmatter, validates it, and reports every problem at once.

**Files:**
- Create: `webapp/src/content/load.ts`
- Create: `webapp/src/content/test-helpers.ts`
- Create: `webapp/src/content/load.test.ts`

**Interfaces:**
- Consumes: every schema from `./schema`.
- Produces:
  - `class ContentError extends Error` with `readonly issues: string[]`
  - `interface Entry<T> { slug: string; data: T; body: string; file: string }`
  - `interface LoadedContent { experience: Entry<ExperienceFrontmatter>[]; education: Entry<EducationFrontmatter>[]; skills: Entry<SkillFrontmatter>[]; projects: Entry<ProjectFrontmatter>[]; articles: Entry<ArticleFrontmatter>[]; things: Entry<ThingFrontmatter>[]; links: Entry<LinkFrontmatter>[]; about: Entry<AboutFrontmatter>; statement: Entry<StatementFrontmatter> }`
  - `function load(dir: string): LoadedContent`
  - `function makeContentDir(files: Record<string, string>): string` and `const REQUIRED: Record<string, string>` from `./test-helpers`

- [ ] **Step 1: Write the test helper**

Create `webapp/src/content/test-helpers.ts`:

```ts
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";

/** The two singletons every valid content directory must contain. */
export const REQUIRED: Record<string, string> = {
  "about.mdx": "---\ndisplayName: Test Person\n---\n\nBio body.\n",
  "statement.mdx": "---\ntitle: Statement\n---\n\nStatement body.\n",
};

/** Build a throwaway content directory from a path-to-contents map. */
export function makeContentDir(files: Record<string, string>): string {
  const dir = mkdtempSync(path.join(tmpdir(), "content-"));
  for (const [rel, body] of Object.entries(files)) {
    const full = path.join(dir, rel);
    mkdirSync(path.dirname(full), { recursive: true });
    writeFileSync(full, body, "utf8");
  }
  return dir;
}
```

- [ ] **Step 2: Write the failing load tests**

Create `webapp/src/content/load.test.ts`:

```ts
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
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd webapp && npx vitest run src/content/load.test.ts`
Expected: FAIL — "Failed to resolve import ./load"

- [ ] **Step 4: Write the loader**

Create `webapp/src/content/load.ts`:

```ts
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { z } from "zod";
import {
  AboutFrontmatter,
  ArticleFrontmatter,
  EducationFrontmatter,
  ExperienceFrontmatter,
  LinkFrontmatter,
  ProjectFrontmatter,
  SkillFrontmatter,
  StatementFrontmatter,
  ThingFrontmatter,
} from "./schema";

/**
 * Every content failure, collected. Fail-fast would mean fixing one typo per
 * build; authors should see the whole list in one run.
 */
export class ContentError extends Error {
  constructor(readonly issues: string[]) {
    super(`Content validation failed:\n${issues.map((i) => `  - ${i}`).join("\n")}`);
    this.name = "ContentError";
  }
}

export interface Entry<T> {
  /** Derived from the filename; the route param and React key. */
  slug: string;
  data: T;
  /** Raw MDX body, frontmatter stripped. */
  body: string;
  /** Path relative to the content directory, for error messages. */
  file: string;
}

export interface LoadedContent {
  experience: Entry<z.infer<typeof ExperienceFrontmatter>>[];
  education: Entry<z.infer<typeof EducationFrontmatter>>[];
  skills: Entry<z.infer<typeof SkillFrontmatter>>[];
  projects: Entry<z.infer<typeof ProjectFrontmatter>>[];
  articles: Entry<z.infer<typeof ArticleFrontmatter>>[];
  things: Entry<z.infer<typeof ThingFrontmatter>>[];
  links: Entry<z.infer<typeof LinkFrontmatter>>[];
  about: Entry<z.infer<typeof AboutFrontmatter>>;
  statement: Entry<z.infer<typeof StatementFrontmatter>>;
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function describeIssues(file: string, error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const where = issue.path.length ? issue.path.join(".") : "(root)";
    return `${file}: ${where} — ${issue.message}`;
  });
}

function parseFile<S extends z.ZodType>(
  dir: string,
  file: string,
  schema: S,
  issues: string[]
): Entry<z.infer<S>> | null {
  const raw = readFileSync(path.join(dir, file), "utf8");
  const { data, content } = matter(raw);
  const result = schema.safeParse(data);
  if (!result.success) {
    issues.push(...describeIssues(file, result.error));
    return null;
  }
  return {
    slug: path.basename(file, ".mdx"),
    data: result.data,
    body: content,
    file,
  };
}

function loadCollection<S extends z.ZodType>(
  dir: string,
  name: string,
  schema: S,
  issues: string[]
): Entry<z.infer<S>>[] {
  const collectionDir = path.join(dir, name);
  // A collection you have not started yet is empty, not broken.
  if (!existsSync(collectionDir) || !statSync(collectionDir).isDirectory()) return [];

  const files = readdirSync(collectionDir)
    .filter((f) => f.endsWith(".mdx"))
    .sort();

  const entries: Entry<z.infer<S>>[] = [];
  for (const filename of files) {
    const rel = path.join(name, filename);
    const slug = path.basename(filename, ".mdx");
    if (!SLUG_PATTERN.test(slug)) {
      issues.push(
        `${rel}: filename must be a lowercase kebab-case slug — it becomes the URL for this item`
      );
      continue;
    }
    const entry = parseFile(dir, rel, schema, issues);
    if (entry) entries.push(entry);
  }
  return entries;
}

function loadSingleton<S extends z.ZodType>(
  dir: string,
  file: string,
  schema: S,
  issues: string[]
): Entry<z.infer<S>> | null {
  if (!existsSync(path.join(dir, file))) {
    issues.push(`${file}: required file is missing`);
    return null;
  }
  return parseFile(dir, file, schema, issues);
}

/**
 * Read and validate every content file. Drafts are included — filtering them
 * is the graph's job, which needs to know a draft exists in order to tell it
 * apart from a slug that does not.
 */
export function load(dir: string): LoadedContent {
  if (!existsSync(dir) || !statSync(dir).isDirectory()) {
    throw new ContentError([
      `content directory not found at ${dir} — check the build is running from the webapp directory, or set CONTENT_DIR`,
    ]);
  }

  const issues: string[] = [];

  const experience = loadCollection(dir, "experience", ExperienceFrontmatter, issues);
  const education = loadCollection(dir, "education", EducationFrontmatter, issues);
  const skills = loadCollection(dir, "skills", SkillFrontmatter, issues);
  const projects = loadCollection(dir, "projects", ProjectFrontmatter, issues);
  const articles = loadCollection(dir, "articles", ArticleFrontmatter, issues);
  const things = loadCollection(dir, "things", ThingFrontmatter, issues);
  const links = loadCollection(dir, "links", LinkFrontmatter, issues);
  const about = loadSingleton(dir, "about.mdx", AboutFrontmatter, issues);
  const statement = loadSingleton(dir, "statement.mdx", StatementFrontmatter, issues);

  if (issues.length > 0 || !about || !statement) throw new ContentError(issues);

  return { experience, education, skills, projects, articles, things, links, about, statement };
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `cd webapp && npx vitest run src/content/load.test.ts`
Expected: PASS — 15 tests

- [ ] **Step 6: Commit**

```bash
git add webapp/src/content/load.ts webapp/src/content/load.test.ts webapp/src/content/test-helpers.ts
git commit -m "Load and validate content files, collecting every failure"
```

---

### Task 3: Reading time

`readingTime` currently walks a Strapi Blocks tree. Bodies are now markdown strings, so it needs a string version.

**Files:**
- Create: `webapp/src/content/text.ts`
- Create: `webapp/src/content/text.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: `function readingTime(markdown: string): number | null`

- [ ] **Step 1: Write the failing test**

Create `webapp/src/content/text.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd webapp && npx vitest run src/content/text.test.ts`
Expected: FAIL — "Failed to resolve import ./text"

- [ ] **Step 3: Write the implementation**

Create `webapp/src/content/text.ts`:

```ts
const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time from an MDX body. Code fences and standalone JSX are
 * stripped first — a long code sample is scanned, not read, and counting it
 * as prose inflates the estimate badly.
 */
export function readingTime(markdown: string): number | null {
  const prose = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<\/?[A-Za-z][^>]*>/g, " ");
  const words = prose.trim().split(/\s+/).filter(Boolean).length;
  if (!words) return null;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd webapp && npx vitest run src/content/text.test.ts`
Expected: PASS — 5 tests

- [ ] **Step 5: Commit**

```bash
git add webapp/src/content/text.ts webapp/src/content/text.test.ts
git commit -m "Estimate reading time from markdown bodies"
```

---

### Task 4: The content graph

Resolves slug references into objects, derives inverse relations, collects tags, and sorts.

**Files:**
- Create: `webapp/src/content/graph.ts`
- Create: `webapp/src/content/graph.test.ts`

**Interfaces:**
- Consumes: `load`, `ContentError`, `Entry`, `LoadedContent` from `./load`; `readingTime` from `./text`; types from `./schema`.
- Produces:

```ts
interface Skill  { slug, name, description, proficiency?, lastUsed?, iconKey? }
interface ArticleRef { slug, title, summary }
interface ProjectRef { slug, title, summary }
interface Article { slug, title, summary, publishedAt, draft, cover?, category?, tags, skills: Skill[],
                    body, minutes, related: ArticleRef[], backlinks: ArticleRef[], project?: ProjectRef }
interface Project { slug, title, summary, cover?, year?, materials?, featured, order, stage?, type?,
                    embedUrl?, startDate?, endDate?, repoUrl?, liveUrl?, tags, skills: Skill[],
                    gallery, body, articles: ArticleRef[] }
interface Experience { slug, title, company, companyUrl?, type?, startDate, endDate?, isCurrent,
                       skills: Skill[], body }
interface Education { slug, title, institution, startDate, endDate?, body }
interface Thing { slug, name, type?, isSelf, media, tags, body }
interface SiteLink { slug, title, url, description?, iconKey?, order, savedAt?, type, tags }
interface About { displayName, pronouns?, headline?, shortBio?, portrait?, location?, email?,
                  metaDescription?, body }
interface Statement { title, body }
interface TagCount { tag: string; count: number }
interface ContentGraph { experience, education, skills, projects, articles, things, links, about,
                         statement, tags: TagCount[] }

function resolve(loaded: LoadedContent, options: { includeDrafts: boolean }): ContentGraph
```

- [ ] **Step 1: Write the failing graph tests**

Create `webapp/src/content/graph.test.ts`:

```ts
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
    ).toThrow(/orbit\.mdx.*rst/s);
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
      /one\.mdx.*ghost/s
    );
  });

  it("errors when an article lists itself as related", () => {
    expect(() => build({ "articles/one.mdx": article("One", "related: [one]\n") })).toThrow(
      /one\.mdx.*itself/s
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
      /one\.mdx.*ghost/s
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd webapp && npx vitest run src/content/graph.test.ts`
Expected: FAIL — "Failed to resolve import ./graph"

- [ ] **Step 3: Write the graph**

Create `webapp/src/content/graph.ts`:

```ts
import { ContentError, type Entry, type LoadedContent } from "./load";
import { readingTime } from "./text";
import type {
  Asset,
  EmploymentType,
  LinkType,
  Proficiency,
  ProjectStage,
  ThingType,
} from "./schema";

export interface Skill {
  slug: string;
  name: string;
  description: string;
  proficiency?: Proficiency;
  lastUsed?: string;
  iconKey?: string;
}

export interface ArticleRef {
  slug: string;
  title: string;
  summary: string;
}

export interface ProjectRef {
  slug: string;
  title: string;
  summary: string;
}

export interface Article {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  draft: boolean;
  cover?: Asset;
  category?: string;
  tags: string[];
  skills: Skill[];
  body: string;
  minutes: number | null;
  related: ArticleRef[];
  backlinks: ArticleRef[];
  project?: ProjectRef;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  cover?: Asset;
  year?: string;
  materials?: string;
  featured: boolean;
  order: number;
  stage?: ProjectStage;
  type?: string;
  embedUrl?: string;
  startDate?: string;
  endDate?: string;
  repoUrl?: string;
  liveUrl?: string;
  tags: string[];
  skills: Skill[];
  gallery: Asset[];
  body: string;
  articles: ArticleRef[];
}

export interface Experience {
  slug: string;
  title: string;
  company: string;
  companyUrl?: string;
  type?: EmploymentType;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  skills: Skill[];
  body: string;
}

export interface Education {
  slug: string;
  title: string;
  institution: string;
  startDate: string;
  endDate?: string;
  body: string;
}

export interface Thing {
  slug: string;
  name: string;
  type?: ThingType;
  isSelf: boolean;
  media: Asset[];
  tags: string[];
  body: string;
}

export interface SiteLink {
  slug: string;
  title: string;
  url: string;
  description?: string;
  iconKey?: string;
  order: number;
  savedAt?: string;
  type: LinkType;
  tags: string[];
}

export interface About {
  displayName: string;
  pronouns?: string;
  headline?: string;
  shortBio?: string;
  portrait?: Asset;
  location?: string;
  email?: string;
  metaDescription?: string;
  body: string;
}

export interface Statement {
  title: string;
  body: string;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface ContentGraph {
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  articles: Article[];
  things: Thing[];
  links: SiteLink[];
  about: About;
  statement: Statement;
  tags: TagCount[];
}

/** Newest first. Shorter strings (YYYY-MM) compare correctly against YYYY-MM-DD. */
const byDateDesc = (a: string, b: string) => b.localeCompare(a);

export function resolve(
  loaded: LoadedContent,
  options: { includeDrafts: boolean }
): ContentGraph {
  const issues: string[] = [];

  const skills: Skill[] = loaded.skills
    .map((e) => ({
      slug: e.slug,
      name: e.data.name,
      description: e.body,
      proficiency: e.data.proficiency,
      lastUsed: e.data.lastUsed,
      iconKey: e.data.iconKey,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const skillBySlug = new Map(skills.map((s) => [s.slug, s]));

  const resolveSkills = (file: string, refs: string[]): Skill[] =>
    refs.flatMap((ref) => {
      const skill = skillBySlug.get(ref);
      if (!skill) {
        issues.push(`${file}: unknown skill "${ref}" — no content/skills/${ref}.mdx`);
        return [];
      }
      return [skill];
    });

  // Every article, drafts included: needed to tell a draft reference apart
  // from a reference to nothing at all.
  const allArticles = new Map(loaded.articles.map((e) => [e.slug, e]));
  const visibleArticles = loaded.articles.filter((e) => options.includeDrafts || !e.data.draft);
  const visibleArticleSlugs = new Set(visibleArticles.map((e) => e.slug));

  const articleRef = (e: Entry<{ title: string; summary: string }>): ArticleRef => ({
    slug: e.slug,
    title: e.data.title,
    summary: e.data.summary,
  });

  const projectBySlug = new Map(loaded.projects.map((e) => [e.slug, e]));

  const projectRef = (slug: string): ProjectRef | undefined => {
    const p = projectBySlug.get(slug);
    return p ? { slug: p.slug, title: p.data.title, summary: p.data.summary } : undefined;
  };

  /** Outgoing links, with unknown slugs reported and draft targets dropped. */
  const resolveRelated = (entry: Entry<{ related: string[] }>): ArticleRef[] =>
    entry.data.related.flatMap((ref) => {
      if (ref === entry.slug) {
        issues.push(`${entry.file}: an article cannot list itself in related`);
        return [];
      }
      const target = allArticles.get(ref);
      if (!target) {
        issues.push(`${entry.file}: unknown related article "${ref}" — no content/articles/${ref}.mdx`);
        return [];
      }
      // The target exists but is unpublished: a legitimate forward reference,
      // not an authoring mistake. Drop it quietly until the draft ships.
      if (!visibleArticleSlugs.has(ref)) return [];
      return [articleRef(target)];
    });

  const articles: Article[] = visibleArticles
    .map((e) => {
      if (e.data.project && !projectBySlug.has(e.data.project)) {
        issues.push(
          `${e.file}: unknown project "${e.data.project}" — no content/projects/${e.data.project}.mdx`
        );
      }
      return {
        slug: e.slug,
        title: e.data.title,
        summary: e.data.summary,
        publishedAt: e.data.publishedAt,
        draft: e.data.draft,
        cover: e.data.cover,
        category: e.data.category,
        tags: e.data.tags,
        skills: resolveSkills(e.file, e.data.skills),
        body: e.body,
        minutes: readingTime(e.body),
        related: resolveRelated(e),
        backlinks: [],
        project: e.data.project ? projectRef(e.data.project) : undefined,
      };
    })
    .sort((a, b) => byDateDesc(a.publishedAt, b.publishedAt));

  // Backlinks are the inverse of related. Deriving rather than authoring them
  // is what keeps the two halves from disagreeing.
  const byArticleSlug = new Map(articles.map((a) => [a.slug, a]));
  for (const article of articles) {
    for (const target of article.related) {
      byArticleSlug.get(target.slug)?.backlinks.push({
        slug: article.slug,
        title: article.title,
        summary: article.summary,
      });
    }
  }

  const projects: Project[] = loaded.projects
    .map((e) => ({
      slug: e.slug,
      title: e.data.title,
      summary: e.data.summary,
      cover: e.data.cover,
      year: e.data.year,
      materials: e.data.materials,
      featured: e.data.featured,
      order: e.data.order,
      stage: e.data.stage,
      type: e.data.type,
      embedUrl: e.data.embedUrl,
      startDate: e.data.startDate,
      endDate: e.data.endDate,
      repoUrl: e.data.repoUrl,
      liveUrl: e.data.liveUrl,
      tags: e.data.tags,
      skills: resolveSkills(e.file, e.data.skills),
      gallery: e.data.gallery,
      body: e.body,
      // Inverted from article.project, so only published articles appear.
      articles: articles
        .filter((a) => a.project?.slug === e.slug)
        .map((a) => ({ slug: a.slug, title: a.title, summary: a.summary })),
    }))
    .sort(
      (a, b) =>
        Number(b.featured) - Number(a.featured) ||
        a.order - b.order ||
        byDateDesc(a.startDate ?? "", b.startDate ?? "")
    );

  const experience: Experience[] = loaded.experience
    .map((e) => ({
      slug: e.slug,
      title: e.data.title,
      company: e.data.company,
      companyUrl: e.data.companyUrl,
      type: e.data.type,
      startDate: e.data.startDate,
      endDate: e.data.endDate,
      isCurrent: !e.data.endDate,
      skills: resolveSkills(e.file, e.data.skills),
      body: e.body,
    }))
    .sort((a, b) => byDateDesc(a.startDate, b.startDate));

  const education: Education[] = loaded.education
    .map((e) => ({
      slug: e.slug,
      title: e.data.title,
      institution: e.data.institution,
      startDate: e.data.startDate,
      endDate: e.data.endDate,
      body: e.body,
    }))
    .sort((a, b) => byDateDesc(a.startDate, b.startDate));

  const things: Thing[] = loaded.things
    .map((e) => ({
      slug: e.slug,
      name: e.data.name,
      type: e.data.type,
      isSelf: e.data.isSelf,
      media: e.data.media,
      tags: e.data.tags,
      body: e.body,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const links: SiteLink[] = loaded.links
    .map((e) => ({
      slug: e.slug,
      title: e.data.title,
      url: e.data.url,
      description: e.data.description,
      iconKey: e.data.iconKey,
      order: e.data.order,
      savedAt: e.data.savedAt,
      type: e.data.type,
      tags: e.data.tags,
    }))
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));

  const counts = new Map<string, number>();
  for (const tag of [
    ...articles.flatMap((a) => a.tags),
    ...projects.flatMap((p) => p.tags),
    ...things.flatMap((t) => t.tags),
    ...links.flatMap((l) => l.tags),
  ]) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  const tags: TagCount[] = [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  if (issues.length > 0) throw new ContentError(issues);

  return {
    experience,
    education,
    skills,
    projects,
    articles,
    things,
    links,
    about: { ...loaded.about.data, body: loaded.about.body },
    statement: { title: loaded.statement.data.title, body: loaded.statement.body },
    tags,
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd webapp && npx vitest run src/content/graph.test.ts`
Expected: PASS — 21 tests

- [ ] **Step 5: Run the whole content suite**

Run: `cd webapp && npx vitest run src/content/`
Expected: PASS — 63 tests

- [ ] **Step 6: Commit**

```bash
git add webapp/src/content/graph.ts webapp/src/content/graph.test.ts
git commit -m "Resolve the content graph and derive inverse relations"
```

---

### Task 5: The public API

The only module pages import. Resolves the content directory, decides about drafts, and memoizes in production.

**Files:**
- Create: `webapp/src/content/index.ts`
- Create: `webapp/src/content/index.test.ts`

**Interfaces:**
- Consumes: `load` from `./load`, `resolve` and every graph type from `./graph`.
- Produces: `contentDir()`, `getGraph()`, `getExperience()`, `getEducation()`, `getSkills()`, `getSkill(slug)`, `getProjects()`, `getProject(slug)`, `getArticles()`, `getArticle(slug)`, `getThings()`, `getLinks(type?)`, `getTags()`, `getAbout()`, `getStatement()`; re-exports every type from `./graph`, `Asset` from `./schema`, and `assetUrl` from `./asset`.

- [ ] **Step 1: Write the failing test**

Create `webapp/src/content/index.test.ts`:

```ts
import { afterEach, describe, expect, it } from "vitest";
import { REQUIRED, makeContentDir } from "./test-helpers";

const original = process.env.CONTENT_DIR;
afterEach(() => {
  if (original === undefined) delete process.env.CONTENT_DIR;
  else process.env.CONTENT_DIR = original;
});

/** index.ts memoizes, so each test needs a fresh module instance. */
async function freshApi(files: Record<string, string>) {
  process.env.CONTENT_DIR = makeContentDir({ ...REQUIRED, ...files });
  return import(`./index?cachebust=${Math.random()}`) as Promise<typeof import("./index")>;
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd webapp && npx vitest run src/content/index.test.ts`
Expected: FAIL — "Failed to resolve import ./index"

- [ ] **Step 3: Write the public API**

Create `webapp/src/content/index.ts`:

```ts
import path from "node:path";
import { load } from "./load";
import { resolve, type ContentGraph } from "./graph";
import type { Article, Education, Experience, Project, Skill, SiteLink, Thing } from "./graph";
import type { LinkType } from "./schema";

export type {
  About,
  Article,
  ArticleRef,
  ContentGraph,
  Education,
  Experience,
  Project,
  ProjectRef,
  Skill,
  SiteLink,
  Statement,
  TagCount,
  Thing,
} from "./graph";
export type { Asset, EmploymentType, LinkType, Proficiency, ProjectStage, ThingType } from "./schema";
export { assetUrl, isExternalHref } from "./asset";
export { ContentError } from "./load";

/**
 * Content lives beside the Next app, not inside it. Next runs with the app
 * directory as its cwd during both build and dev, so one level up is the
 * repository root. CONTENT_DIR overrides it for tests.
 */
export function contentDir(): string {
  return process.env.CONTENT_DIR ?? path.join(process.cwd(), "..", "content");
}

const isProduction = () => process.env.NODE_ENV === "production";

let cached: ContentGraph | null = null;

/**
 * Memoized in production only. In development the graph rebuilds per request
 * so that editing a file shows up on refresh — Turbopack does not watch
 * outside the app directory, so without this an edit would need a restart.
 */
export function getGraph(): ContentGraph {
  if (isProduction() && cached) return cached;
  const graph = resolve(load(contentDir()), { includeDrafts: !isProduction() });
  if (isProduction()) cached = graph;
  return graph;
}

export function getExperience(): Experience[] {
  return getGraph().experience;
}

export function getEducation(): Education[] {
  return getGraph().education;
}

export function getSkills(): Skill[] {
  return getGraph().skills;
}

export function getSkill(slug: string): Skill | null {
  return getGraph().skills.find((s) => s.slug === slug) ?? null;
}

export function getProjects(): Project[] {
  return getGraph().projects;
}

export function getProject(slug: string): Project | null {
  return getGraph().projects.find((p) => p.slug === slug) ?? null;
}

export function getArticles(): Article[] {
  return getGraph().articles;
}

export function getArticle(slug: string): Article | null {
  return getGraph().articles.find((a) => a.slug === slug) ?? null;
}

export function getThings(): Thing[] {
  return getGraph().things;
}

export function getLinks(type?: LinkType): SiteLink[] {
  const links = getGraph().links;
  return type ? links.filter((l) => l.type === type) : links;
}

export function getTags() {
  return getGraph().tags;
}

export function getAbout() {
  return getGraph().about;
}

export function getStatement() {
  return getGraph().statement;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `cd webapp && npx vitest run src/content/index.test.ts`
Expected: PASS — 7 tests

- [ ] **Step 5: Commit**

```bash
git add webapp/src/content/index.ts webapp/src/content/index.test.ts
git commit -m "Expose the content graph through a small public API"
```

---

### Task 6: MDX rendering

Compiles MDX bodies and supplies the component map. No unit tests: `compileMDX` returns React Server Component output, which Vitest's node environment cannot render. It is verified by `tsc` here and exercised by the page builds in Tasks 8–11.

**Files:**
- Create: `webapp/src/content/mdx.tsx`

**Interfaces:**
- Consumes: `assetUrl`, `isExternalHref` from `./asset`; `Asset` from `./schema`.
- Produces: `async function Mdx({ source }: { source: string }): Promise<React.ReactElement>`; `const PROSE_CLASS: string`; components `Gallery`, `Embed`.

- [ ] **Step 1: Write the MDX renderer**

Create `webapp/src/content/mdx.tsx`:

```tsx
import type { ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { assetUrl, isExternalHref } from "./asset";
import type { Asset } from "./schema";

/** Shared prose styling, previously duplicated in Markdown.tsx and RichText.tsx. */
export const PROSE_CLASS = [
  "prose prose-neutral dark:prose-invert max-w-none",
  "prose-headings:font-funnel prose-headings:font-semibold",
  "prose-a:underline-offset-2",
  "prose-code:rounded prose-code:bg-neutral-100 prose-code:px-1 prose-code:py-0.5 prose-code:text-sm prose-code:font-normal prose-code:before:content-none prose-code:after:content-none",
  "prose-pre:rounded-lg prose-pre:bg-neutral-100",
  "prose-img:rounded-lg",
].join(" ");

/** A row of captioned images, usable mid-body or from a page template. */
export function Gallery({ images }: { images: Asset[] }) {
  if (!images?.length) return null;
  return (
    <ul className="not-prose my-8 flex flex-col gap-8">
      {images.map((image) => (
        <li key={image.src}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={assetUrl(image.src)} alt={image.alt} className="w-full rounded-lg" />
          {image.caption && <p className="mt-2 text-xs text-gray-400">{image.caption}</p>}
        </li>
      ))}
    </ul>
  );
}

/** A sandboxed iframe. The URL comes from content, never markup. */
export function Embed({ url, title }: { url: string; title: string }) {
  return (
    <div className="not-prose my-8 aspect-video w-full overflow-hidden rounded-lg bg-brand-dark/5 dark:bg-brand-white/5">
      <iframe
        src={url}
        title={title}
        className="h-full w-full"
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-presentation"
        allowFullScreen
      />
    </div>
  );
}

const components = {
  // Content references uploads by relative path; resolve to the CMS origin here
  // so nothing in content/ knows where the CMS lives.
  img: ({ src, alt }: { src?: string; alt?: string }) =>
    src ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={assetUrl(src)} alt={alt ?? ""} className="rounded-lg" />
    ) : null,
  a: ({ href, children }: { href?: string; children?: ReactNode }) => {
    if (!href) return <span>{children}</span>;
    return isExternalHref(href) ? (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <a href={href}>{children}</a>
    );
  },
  Gallery,
  Embed,
};

/** Render an MDX body with the site's component map and prose styling. */
export async function Mdx({ source }: { source: string }) {
  if (!source.trim()) return null;
  return (
    <div className={PROSE_CLASS}>
      <MDXRemote
        source={source}
        components={components}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Verify it typechecks**

Run: `cd webapp && npx tsc --noEmit`
Expected: no errors

- [ ] **Step 3: Verify lint passes**

Run: `cd webapp && npm run lint`
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add webapp/src/content/mdx.tsx
git commit -m "Render MDX bodies with a site component map"
```

---

### Task 7: Seed content, the check script, and build config

Creates the real content tree, wires `content:check`, and makes the out-of-app content directory reachable from a deployed build.

**Files:**
- Create: `content/about.mdx`, `content/statement.mdx`
- Create: `content/skills/typescript.mdx`, `content/skills/react.mdx`
- Create: `content/experience/moz.mdx`
- Create: `content/education/york.mdx`
- Create: `content/projects/orbit-rail.mdx`
- Create: `content/articles/on-circles.mdx`
- Create: `content/things/juno-106.mdx`
- Create: `content/links/github.mdx`, `content/links/bookmark-inconvergent.mdx`
- Create: `webapp/src/content/check.test.ts`
- Modify: `webapp/package.json` (scripts)
- Modify: `webapp/next.config.ts` (add `outputFileTracingRoot`)

**Interfaces:**
- Consumes: `load`, `resolve`, `contentDir` from the content module.
- Produces: a populated `content/` tree; `npm run content:check`.

- [ ] **Step 1: Write the singletons**

Create `content/about.mdx`:

```mdx
---
displayName: Darko Cejkov
headline: developer, designer, creator
shortBio: I love making, breaking, fixing, and understanding things.
location: Toronto, Canada
---

I'm a passionate developer, designer, and creator. I love making, breaking,
fixing, and understanding things — it's what I do.
```

Create `content/statement.mdx`:

```mdx
---
title: Statement
---

I'm very inspired to create cool things.
```

- [ ] **Step 2: Write the skills**

Create `content/skills/typescript.mdx`:

```mdx
---
name: TypeScript
proficiency: fluent
lastUsed: 2026-09
iconKey: typescript
---

Day-to-day language for application and tooling work.
```

Create `content/skills/react.mdx`:

```mdx
---
name: React
proficiency: fluent
lastUsed: 2026-09
iconKey: react
---

Server components, suspense, and the surrounding Next.js ecosystem.
```

- [ ] **Step 3: Write one item per remaining collection**

Create `content/experience/moz.mdx`:

```mdx
---
title: Software Engineer
company: Moz
companyUrl: https://moz.com
type: full-time
startDate: 2024-06-01
skills: [typescript, react]
---

Building tools for search and marketing data.
```

Create `content/education/york.mdx`:

```mdx
---
title: BSc Computer Science
institution: York University
startDate: 2019-09-01
endDate: 2023-06-01
---

Specialised in graphics and human-computer interaction.
```

Create `content/projects/orbit-rail.mdx`:

```mdx
---
title: Orbit Rail
summary: A persistent circular navigation shell built on a parametric ring generator.
featured: true
order: 0
stage: shipped
type: web
materials: SVG, Motion
startDate: 2026-01-01
repoUrl: https://github.com/darkocejkov/circularity
tags: [svg, animation]
skills: [typescript, react]
---

The site is one continuous scene rather than a set of pages. A two-circle eye
sits at the centre of the viewport and morphs into navigation chrome as you move
between sections.

Every ring is an exact `<circle>` — nothing is ever sampled to a path.
```

Create `content/articles/on-circles.mdx`:

```mdx
---
title: On circles
summary: Why constraining a parametric generator made the design decision disappear.
publishedAt: 2026-09-13
category: essay
tags: [design, svg]
skills: [typescript]
project: orbit-rail
---

Circularity ramps morph and wave by a ring's position within the set. Animating
the count therefore changes every existing ring's character.

Constraining the generator to radius, spacing, count and stroke dissolves the
question: with no morph and no wave, nothing ramps.
```

Create `content/things/juno-106.mdx`:

```mdx
---
name: Juno-106
type: record
isSelf: false
tags: [synths]
---

Chorus circuit doing most of the heavy lifting.
```

Create `content/links/github.mdx`:

```mdx
---
title: GitHub
url: https://github.com/darkocejkov
iconKey: github
order: 0
type: social
---
```

Create `content/links/bookmark-inconvergent.mdx`:

```mdx
---
title: Inconvergent
url: https://inconvergent.net
description: Generative algorithms, written up with unusual care.
order: 0
savedAt: 2026-01-15
type: bookmark
tags: [generative]
---
```

- [ ] **Step 4: Write the check test**

Create `webapp/src/content/check.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { contentDir } from "./index";
import { load } from "./load";
import { resolve } from "./graph";

/**
 * Validates the real content tree, not a fixture. This is what
 * `npm run content:check` runs — the pre-commit substitute for a CMS admin
 * refusing to publish something broken.
 */
describe("the real content directory", () => {
  it("loads and resolves with no schema or reference errors", () => {
    const graph = resolve(load(contentDir()), { includeDrafts: false });
    expect(graph.about.displayName.length).toBeGreaterThan(0);
  });

  it("resolves identically with drafts included", () => {
    expect(() => resolve(load(contentDir()), { includeDrafts: true })).not.toThrow();
  });
});
```

- [ ] **Step 5: Add the check script**

In `webapp/package.json`, add to `scripts`:

```json
"content:check": "vitest run src/content/check.test.ts"
```

- [ ] **Step 6: Point output file tracing at the repository root**

In `webapp/next.config.ts`, add below the existing `appDir` constant:

```ts
// Content lives at the repository root, outside this app. Tracing has to start
// there or the build will not carry those files. Distinct from turbopack.root,
// which must stay pinned to appDir — see the comment above.
const repoRoot = fileURLToPath(new URL("../", import.meta.url));
```

and add to `nextConfig`, immediately after the `turbopack` block:

```ts
  outputFileTracingRoot: repoRoot,
```

- [ ] **Step 7: Run the check**

Run: `cd webapp && npm run content:check`
Expected: PASS — 2 tests

- [ ] **Step 8: Run the whole suite**

Run: `cd webapp && npm test`
Expected: PASS — all content tests plus the existing circularity and orbit tests

- [ ] **Step 9: Commit**

```bash
git add content webapp/src/content/check.test.ts webapp/package.json webapp/next.config.ts
git commit -m "Seed the content tree and validate it on demand"
```

---

### Task 8: Bookmarks and things pages

The two simplest list pages. Both currently swallow CMS errors and render an empty state; content failures should fail the build instead.

Each step replaces a whole file. Line-by-line patching would be unreliable here, because the first edit in a file shifts every line number after it.

**Files:**
- Modify: `webapp/src/app/bookmarks/page.tsx` (replace entirely)
- Modify: `webapp/src/app/things/page.tsx` (replace entirely)

**Interfaces:**
- Consumes: `getLinks`, `getThings`, `assetUrl` from `@/content`; `Mdx` from `@/content/mdx`.
- Produces: nothing for later tasks.

- [ ] **Step 1: Replace the bookmarks page**

Replace `webapp/src/app/bookmarks/page.tsx` entirely with:

```tsx
import { getLinks } from "@/content";

function formatDate(date: string | undefined) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function hostname(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function Bookmarks() {
  // Social links are my own accounts and render in the footer instead.
  const bookmarks = getLinks("bookmark");

  return (
    <div>
      <h1 className="font-funnel mb-2 text-4xl font-bold">Bookmarks</h1>
      <p className="mb-10 max-w-prose text-gray-500">Things worth coming back to.</p>

      {bookmarks.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing saved yet.</p>
      ) : (
        <ul className="flex max-w-2xl flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {bookmarks.map((link) => {
            const saved = formatDate(link.savedAt);
            return (
              <li key={link.slug} className="py-4 first:pt-0">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="group block">
                  <span className="text-sm font-medium group-hover:underline">{link.title}</span>
                  {link.description && (
                    <span className="mt-0.5 block text-sm text-gray-500">{link.description}</span>
                  )}
                  <span className="mt-1.5 flex flex-wrap items-center gap-x-3 text-xs text-gray-400">
                    <span>{hostname(link.url)}</span>
                    {saved && <span>{saved}</span>}
                    {link.tags.length > 0 && <span>{link.tags.join(", ")}</span>}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Replace the things page**

Replace `webapp/src/app/things/page.tsx` entirely with:

```tsx
import { assetUrl, getThings } from "@/content";
import { Mdx } from "@/content/mdx";

export const metadata = { title: "Things" };

export default function ThingsPage() {
  const things = getThings();

  return (
    <div className="max-w-4xl">
      <h1 className="font-funnel text-4xl font-bold">Things</h1>
      <p className="mt-2 text-gray-500">Objects I own, collected, or made.</p>

      {things.length === 0 ? (
        <p className="mt-10 text-sm text-gray-400">Nothing catalogued yet.</p>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-3">
          {things.map((thing) => {
            const cover = thing.media[0];
            return (
              <li key={thing.slug}>
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={assetUrl(cover.src)}
                    alt={cover.alt}
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ) : (
                  <div className="aspect-square w-full rounded-lg bg-gray-100 dark:bg-gray-800" />
                )}
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <h2 className="text-sm font-medium">{thing.name}</h2>
                  {thing.isSelf && (
                    <span className="text-xs text-brand-orange" title="I made this">
                      made
                    </span>
                  )}
                </div>
                {thing.type && <p className="text-xs text-gray-400">{thing.type}</p>}
                {thing.body.trim() && (
                  <div className="mt-1 text-xs text-gray-500">
                    <Mdx source={thing.body} />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `cd webapp && npx tsc --noEmit && npm run lint`
Expected: no errors

- [ ] **Step 4: Build and confirm both routes prerender**

Run: `cd webapp && npm run build`
Expected: build succeeds; the route table lists `/bookmarks` and `/things` as static (`○`)

- [ ] **Step 5: Commit**

```bash
git add webapp/src/app/bookmarks/page.tsx webapp/src/app/things/page.tsx
git commit -m "Read bookmarks and things from content files"
```

---

### Task 9: Project pages

List and detail. `project.type` becomes a plain string, gallery items become assets, and the body becomes MDX rendered through the shared component map.

**Files:**
- Modify: `webapp/src/app/projects/page.tsx` (replace entirely)
- Modify: `webapp/src/app/projects/[slug]/page.tsx` (replace entirely)

**Interfaces:**
- Consumes: `getProjects`, `getProject`, `assetUrl` from `@/content`; `Mdx`, `Gallery`, `Embed` from `@/content/mdx`.
- Produces: nothing for later tasks.

- [ ] **Step 1: Replace the projects list page**

Replace `webapp/src/app/projects/page.tsx` entirely with:

```tsx
import Link from "next/link";
import { assetUrl, getProjects } from "@/content";

const stageLabel: Record<string, string> = {
  concept: "Concept",
  "in-progress": "In progress",
  shipped: "Shipped",
  archived: "Archived",
};

export default function Projects() {
  // Curated order first, newest work next — `featured` pins the highlights.
  const projects = getProjects();

  return (
    <div>
      <h1 className="font-funnel mb-2 text-4xl font-bold">Work</h1>
      <p className="mb-10 max-w-prose text-gray-500">
        Software, objects, and things that fall between.
      </p>

      {projects.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing here yet.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => {
            const cover = project.cover;
            return (
              <li key={project.slug} className="group">
                <Link href={`/projects/${project.slug}`} className="flex flex-col gap-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-brand-dark/5 dark:bg-brand-white/5">
                    {cover ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={assetUrl(cover.src)}
                        alt={cover.alt}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                        no image
                      </div>
                    )}
                    {project.featured && (
                      <span className="absolute left-2 top-2 rounded-full bg-brand-orange px-2 py-0.5 text-xs text-white">
                        Featured
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-2">
                      <h2 className="font-funnel text-lg font-semibold group-hover:underline">
                        {project.title}
                      </h2>
                      {project.year && <span className="text-xs text-gray-400">{project.year}</span>}
                    </div>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{project.summary}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                      {project.type && <span>{project.type}</span>}
                      {project.stage && <span>· {stageLabel[project.stage] ?? project.stage}</span>}
                      {project.materials && <span>· {project.materials}</span>}
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Replace the project detail page**

Replace `webapp/src/app/projects/[slug]/page.tsx` entirely with:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { assetUrl, getProject, getProjects } from "@/content";
import { Embed, Gallery, Mdx } from "@/content/mdx";

/**
 * Prerender every project at build time. The content graph is read during the
 * build, so no filesystem access happens on a visitor's request.
 */
export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

const stageLabel: Record<string, string> = {
  concept: "Concept",
  "in-progress": "In progress",
  shipped: "Shipped",
  archived: "Archived",
};

function Meta({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const cover = project.cover;

  return (
    <div>
      <div className="mx-auto max-w-3xl">
        <Link
          href="/projects"
          className="mb-8 inline-block text-sm text-gray-400 transition-colors hover:text-gray-700"
        >
          ← Back to Work
        </Link>

        <h1 className="font-funnel text-4xl font-bold leading-tight">{project.title}</h1>
        <p className="mt-2 text-gray-500">{project.summary}</p>

        <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-4 border-y border-gray-100 dark:border-gray-800 py-4">
          <Meta label="Year" value={project.year} />
          <Meta label="Type" value={project.type} />
          <Meta label="Stage" value={project.stage ? stageLabel[project.stage] : null} />
          <Meta label="Made with" value={project.materials} />
          <Meta label="Tools" value={project.skills.map((s) => s.name).join(", ") || null} />
        </dl>

        {(project.repoUrl || project.liveUrl) && (
          <div className="mt-4 flex gap-4 text-sm">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="underline">
                View live
              </a>
            )}
            {project.repoUrl && (
              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="underline">
                Source
              </a>
            )}
          </div>
        )}

        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assetUrl(cover.src)}
            alt={cover.alt}
            className="mt-10 w-full rounded-lg object-cover"
          />
        )}

        <div className="mt-10">
          <Mdx source={project.body} />
        </div>

        {project.embedUrl && <Embed url={project.embedUrl} title={`${project.title} embed`} />}

        {project.gallery.length > 0 && (
          <div className="mt-10">
            <Gallery images={project.gallery} />
          </div>
        )}

        {project.tags.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-gray-200 dark:border-gray-700 px-2 py-0.5 text-xs text-gray-500"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}

        {project.articles.length > 0 && (
          <section className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-6">
            <h2 className="font-funnel text-sm font-semibold uppercase tracking-wide text-gray-400">
              Written about
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {project.articles.map((article) => (
                <li key={article.slug}>
                  <Link href={`/blog/${article.slug}`} className="group block">
                    <span className="text-sm font-medium group-hover:underline">{article.title}</span>
                    <span className="block text-xs text-gray-500 line-clamp-1">{article.summary}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck and lint**

Run: `cd webapp && npx tsc --noEmit && npm run lint`
Expected: no errors

- [ ] **Step 4: Build and confirm the detail route prerenders from content**

Run: `cd webapp && npm run build`
Expected: build succeeds; `/projects/orbit-rail` appears among the prerendered paths

- [ ] **Step 5: Commit**

```bash
git add webapp/src/app/projects
git commit -m "Read project pages from content files"
```

---

### Task 10: Blog pages

List, the client-side filter component, and detail. Categories are now strings, so `BlogList` takes `string[]` instead of `ArticleCategory[]`.

**Files:**
- Modify: `webapp/src/app/blog/page.tsx` (replace entirely)
- Modify: `webapp/src/components/BlogList.tsx` (replace entirely)
- Modify: `webapp/src/app/blog/[slug]/page.tsx` (replace entirely)

**Interfaces:**
- Consumes: `getArticles`, `getArticle`, `assetUrl`, type `Article`, type `ArticleRef` from `@/content`; `Mdx` from `@/content/mdx`.
- Produces: `BlogList` accepting `{ articles: (Article & { coverUrl: string | null })[]; categories: string[] }`.

- [ ] **Step 1: Replace the blog list page**

Replace `webapp/src/app/blog/page.tsx` entirely with:

```tsx
import { Suspense } from "react";
import BlogList from "@/components/BlogList";
import { assetUrl, getArticles } from "@/content";

export default function Blog() {
  const articles = getArticles();

  // Categories are implicit — the set actually in use, alphabetised.
  const categories = [...new Set(articles.flatMap((a) => (a.category ? [a.category] : [])))].sort();

  // Resolve media URLs server-side so the client component stays free of env config.
  const withCovers = articles.map((a) => ({
    ...a,
    coverUrl: a.cover ? assetUrl(a.cover.src) : null,
  }));

  return (
    <div>
      <h1 className="font-funnel mb-6 text-4xl font-bold">Blog</h1>
      <Suspense fallback={<p className="text-sm text-gray-400">Loading…</p>}>
        <BlogList articles={withCovers} categories={categories} />
      </Suspense>
    </div>
  );
}
```

- [ ] **Step 2: Replace the BlogList component**

Replace `webapp/src/components/BlogList.tsx` entirely with:

```tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Article } from "@/content";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogList({
  articles,
  categories,
}: {
  articles: (Article & { coverUrl: string | null })[];
  categories: string[];
}) {
  const searchParams = useSearchParams();
  const raw = searchParams.get("category") ?? undefined;
  const active = raw && categories.includes(raw) ? raw : undefined;

  const visible = active ? articles.filter((a) => a.category === active) : articles;

  const chip = (isActive: boolean) =>
    `rounded-full px-3 py-1 text-sm transition-colors ${
      isActive
        ? "bg-brand-orange text-white"
        : "border border-gray-200 dark:border-gray-700 text-gray-600 hover:border-gray-400"
    }`;

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-2">
        <Link href="/blog" className={chip(!active)}>
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${encodeURIComponent(cat)}`}
            className={chip(active === cat)}
          >
            {cat}
          </Link>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-gray-400">No posts yet.</p>
      ) : (
        <ol className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
          {visible.map((article) => (
            <li key={article.slug} className="py-6 first:pt-0 last:pb-0">
              <Link href={`/blog/${article.slug}`} className="group flex gap-4 items-start">
                {article.coverUrl && (
                  <div className="shrink-0 w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={article.coverUrl}
                      alt={article.cover?.alt ?? article.title}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="min-w-0">
                  {article.category && (
                    <div className="mb-1">
                      <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
                        {article.category}
                      </span>
                    </div>
                  )}
                  <h2 className="font-funnel text-xl font-semibold group-hover:underline">
                    {article.title}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{article.summary}</p>
                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span>{formatDate(article.publishedAt)}</span>
                    {article.tags.length > 0 && <span>{article.tags.join(", ")}</span>}
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
```

- [ ] **Step 3: Replace the article detail page**

Replace `webapp/src/app/blog/[slug]/page.tsx` entirely with:

```tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { assetUrl, getArticle, getArticles, type ArticleRef } from "@/content";
import { Mdx } from "@/content/mdx";

/**
 * Prerender every article at build time. The content graph is read during the
 * build, so no filesystem access happens on a visitor's request.
 */
export function generateStaticParams() {
  return getArticles().map((a) => ({ slug: a.slug }));
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ArticleLinkList({
  heading,
  note,
  items,
}: {
  heading: string;
  note: string;
  items: ArticleRef[];
}) {
  if (!items.length) return null;
  return (
    <section className="mt-12 border-t border-gray-100 dark:border-gray-800 pt-6">
      <h2 className="font-funnel text-sm font-semibold uppercase tracking-wide text-gray-400">
        {heading}
      </h2>
      <p className="mt-1 text-xs text-gray-400">{note}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/blog/${item.slug}`} className="group block">
              <span className="text-sm font-medium group-hover:underline">{item.title}</span>
              <span className="block text-xs text-gray-500 line-clamp-1">{item.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const cover = article.cover;

  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <Link
          href="/blog"
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors mb-8 inline-block"
        >
          ← Back to Blog
        </Link>

        {article.category && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-0.5 text-xs text-gray-500">
              {article.category}
            </span>
          </div>
        )}

        <h1 className="font-funnel text-4xl font-bold leading-tight mb-3">{article.title}</h1>

        <div className="flex items-center gap-3 text-xs text-gray-400 mb-8">
          <span>{formatDate(article.publishedAt)}</span>
          {article.minutes && <span>{article.minutes} min read</span>}
          {article.tags.length > 0 && <span>{article.tags.join(", ")}</span>}
        </div>

        {cover && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assetUrl(cover.src)}
            alt={cover.alt}
            className="w-full rounded-lg mb-10 object-cover max-h-80"
          />
        )}

        <Mdx source={article.body} />

        <ArticleLinkList
          heading="Related"
          note="Pages this one links out to."
          items={article.related}
        />
        <ArticleLinkList
          heading="Linked from"
          note="Pages that link here — collected automatically."
          items={article.backlinks}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Typecheck and lint**

Run: `cd webapp && npx tsc --noEmit && npm run lint`
Expected: no errors

- [ ] **Step 5: Build and confirm the article prerenders**

Run: `cd webapp && npm run build`
Expected: build succeeds; `/blog/on-circles` appears among the prerendered paths

- [ ] **Step 6: Commit**

```bash
git add webapp/src/app/blog webapp/src/components/BlogList.tsx
git commit -m "Read blog pages from content files"
```

---

### Task 11: About page

The only page reading from both sources: identity and prose from content, availability and downloads from Strapi.

**Files:**
- Modify: `webapp/src/lib/strapi.ts` (add the `SiteStatus` interface)
- Modify: `webapp/src/app/about/page.tsx` (replace entirely)

**Interfaces:**
- Consumes: `getAbout`, `getStatement`, `getLinks`, `assetUrl` from `@/content`; `Mdx` from `@/content/mdx`; `strapiGet`, `mediaUrl`, `Download`, `StrapiList`, `StrapiSingle` from `@/lib/strapi`.
- Produces: `interface SiteStatus { lookingForWork: boolean; currently: string | null }` in `lib/strapi.ts`.

- [ ] **Step 1: Add the SiteStatus interface to the Strapi client**

In `webapp/src/lib/strapi.ts`, add immediately after the closing brace of the existing `About` interface:

```ts
/**
 * The half of the Strapi `about` record that stays in the CMS: state that must
 * change without a deploy. Identity and prose now live in content/about.mdx.
 */
export interface SiteStatus {
  lookingForWork: boolean;
  currently: string | null;
}
```

- [ ] **Step 2: Replace the about page**

Replace `webapp/src/app/about/page.tsx` entirely with:

```tsx
import SocialIcon from "@/components/SocialIcon";
import { assetUrl, getAbout, getLinks, getStatement } from "@/content";
import { Mdx } from "@/content/mdx";
import {
  mediaUrl,
  strapiGet,
  type Download,
  type SiteStatus,
  type StrapiList,
  type StrapiSingle,
} from "@/lib/strapi";

/** Availability is the one thing here that must change without a deploy. */
async function getStatus(): Promise<SiteStatus> {
  try {
    const res = await strapiGet<StrapiSingle<SiteStatus>>("/about", {
      "fields[0]": "lookingForWork",
      "fields[1]": "currently",
    });
    return res.data;
  } catch {
    return { lookingForWork: false, currently: null };
  }
}

async function getDownloads(): Promise<Download[]> {
  try {
    const res = await strapiGet<StrapiList<Download>>("/downloads", {
      populate: "file",
      sort: "title:asc",
    });
    return res.data;
  } catch {
    return [];
  }
}

export function generateMetadata() {
  const about = getAbout();
  return {
    title: `About — ${about.displayName}`,
    description: about.metaDescription,
  };
}

function Fact({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-gray-400">{label}</dt>
      <dd className="text-sm">{value}</dd>
    </div>
  );
}

export default async function AboutPage() {
  const about = getAbout();
  const statement = getStatement();
  // My own accounts. Bookmarks live on /bookmarks.
  const links = getLinks("social");
  const [status, downloads] = await Promise.all([getStatus(), getDownloads()]);

  const portrait = about.portrait;

  return (
    <div className="max-w-2xl">
      <div className="flex flex-wrap items-start gap-6">
        {portrait && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={assetUrl(portrait.src)}
            alt={portrait.alt}
            width={96}
            height={96}
            className="rounded-lg object-cover"
          />
        )}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-funnel text-5xl font-bold leading-tight">{about.displayName}</h1>
            {status.lookingForWork && (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Open to work
              </span>
            )}
          </div>
          {about.pronouns && <p className="mt-1 text-sm text-gray-400">{about.pronouns}</p>}
          {about.headline && <p className="mt-1 text-gray-500">{about.headline}</p>}
        </div>
      </div>

      {about.shortBio && <p className="mt-8 text-gray-600 dark:text-gray-400">{about.shortBio}</p>}

      <div className="mt-6">
        <Mdx source={about.body} />
      </div>

      <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-y border-gray-100 py-4 dark:border-gray-800">
        <Fact label="Location" value={about.location} />
        <Fact label="Currently" value={status.currently} />
      </dl>

      {statement.body.trim() && (
        <section className="mt-10">
          <h2 className="font-funnel mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            {statement.title}
          </h2>
          <Mdx source={statement.body} />
        </section>
      )}

      {links.length > 0 && (
        <section className="mt-10">
          <h2 className="font-funnel mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Elsewhere
          </h2>
          <div className="flex flex-wrap items-center gap-4">
            {links.map((link) => (
              <a
                key={link.slug}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                className="text-gray-500 transition-colors hover:text-brand-dark dark:hover:text-brand-white"
              >
                <SocialIcon url={link.url} title={link.title} iconKey={link.iconKey ?? null} />
                <span className="sr-only">{link.title}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {downloads.length > 0 && (
        <section className="mt-10">
          <h2 className="font-funnel mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
            Files
          </h2>
          <ul className="space-y-1 text-sm">
            {downloads.map((download) => {
              const href = mediaUrl(download.file);
              if (!href) return null;
              return (
                <li key={download.id}>
                  <a href={href} download className="underline underline-offset-2">
                    {download.title}
                  </a>
                  {download.description && (
                    <span className="ml-2 text-gray-400">{download.description}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {about.email && (
        <p className="mt-10 text-sm">
          <a href={`mailto:${about.email}`} className="underline underline-offset-2">
            {about.email}
          </a>
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Check the SocialIcon prop type still matches**

Run: `cd webapp && grep -n "iconKey" src/components/SocialIcon.tsx`
Expected: a prop typed `string | null`. If it is typed `string | null | undefined`, drop the `?? null` in the call above; if it is typed `string`, widen it to `string | null`.

- [ ] **Step 4: Typecheck and lint**

Run: `cd webapp && npx tsc --noEmit && npm run lint`
Expected: no errors

- [ ] **Step 5: Build**

Run: `cd webapp && npm run build`
Expected: build succeeds

- [ ] **Step 6: Commit**

```bash
git add webapp/src/app/about/page.tsx webapp/src/lib/strapi.ts
git commit -m "Read about identity and prose from content, status from the CMS"
```

---

### Task 12: Shrink the Strapi client and remove dead renderers

Nothing left in the CMS uses Blocks, so the renderer, its dependency, and every migrated type go.

**Files:**
- Modify: `webapp/src/lib/strapi.ts` (reduce to the surviving surface)
- Delete: `webapp/src/components/RichText.tsx`
- Delete: `webapp/src/components/Markdown.tsx`
- Modify: `webapp/package.json` (remove dependencies)

**Interfaces:**
- Consumes: `assetUrl` from `@/content/asset`.
- Produces: a `lib/strapi.ts` exporting only `strapiGet`, `checkHealth`, `mediaUrl`, `StrapiList`, `StrapiSingle`, `StrapiMedia`, `Download`, `SiteNotification`, `SiteMeta`, `SiteStatus`, `isNotificationActive`.

- [ ] **Step 1: Confirm nothing still imports the doomed modules**

Run: `cd webapp && grep -rn "RichText\|components/Markdown\|blocks-react-renderer\|BlocksContent" src`
Expected: matches only in `src/components/RichText.tsx`, `src/components/Markdown.tsx`, and `src/lib/strapi.ts`

- [ ] **Step 2: Delete the dead renderers**

```bash
cd webapp && rm src/components/RichText.tsx src/components/Markdown.tsx
```

- [ ] **Step 3: Reduce the Strapi client**

Replace `webapp/src/lib/strapi.ts` entirely with:

```ts
import { assetUrl } from "@/content/asset";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

/** Strapi returns relative media paths (/uploads/...), so they need the CMS origin. */
export function mediaUrl(media: StrapiMedia | null | undefined): string | null {
  if (!media?.url) return null;
  return assetUrl(media.url);
}

export async function checkHealth(): Promise<{ ok: boolean; status: number | null; ms: number }> {
  const start = Date.now();
  try {
    const res = await fetch(`${CMS_URL}/_health`, { cache: "no-store" });
    const ms = Date.now() - start;
    const ok = res.status === 204 || res.ok;
    console.log(`[strapi] health ${ok ? "✓" : "✗"} ${res.status} (${ms}ms)`);
    return { ok, status: res.status, ms };
  } catch (e) {
    const ms = Date.now() - start;
    console.error(`[strapi] health ✗ unreachable (${ms}ms)`, e);
    return { ok: false, status: null, ms };
  }
}

export async function strapiGet<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`/api${path}`, CMS_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const fullUrl = url.toString();
  const start = Date.now();
  console.log(`[strapi] ⏳ GET ${path}`);
  let res: Response;
  try {
    res = await fetch(fullUrl, { next: { revalidate: 60 } });
  } catch (e) {
    console.error(`[strapi] ✗ GET ${path} — network error (${Date.now() - start}ms)`, e);
    throw e;
  }
  const ms = Date.now() - start;
  if (!res.ok) {
    console.error(`[strapi] ✗ GET ${path} — ${res.status} (${ms}ms)`);
    throw new Error(`Strapi fetch failed: ${path} (${res.status})`);
  }
  console.log(`[strapi] ✓ GET ${path} — ${res.status} (${ms}ms)`);
  return res.json();
}

export interface StrapiList<T> {
  data: T[];
}

export interface StrapiSingle<T> {
  data: T;
}

export interface StrapiMedia {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}

/** A file to download — resume and similar. The file itself lives in the CMS. */
export interface Download {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  description: string | null;
  version: string | null;
  file: StrapiMedia | null;
}

export interface SiteNotification {
  id: number;
  message: string;
  level: "info" | "success" | "warning";
  url: string | null;
  startsAt: string | null;
  endsAt: string | null;
}

/** Site chrome state only — the banner and its notifications. */
export interface SiteMeta {
  id: number;
  documentId: string;
  underConstruction: boolean;
  notifications: SiteNotification[];
}

/**
 * The half of the Strapi `about` record that stays in the CMS: state that must
 * change without a deploy. Identity and prose live in content/about.mdx.
 */
export interface SiteStatus {
  lookingForWork: boolean;
  currently: string | null;
}

/** A notification is live when now falls inside its optional window. */
export function isNotificationActive(n: SiteNotification, now = new Date()): boolean {
  if (n.startsAt && new Date(n.startsAt) > now) return false;
  if (n.endsAt && new Date(n.endsAt) < now) return false;
  return true;
}
```

- [ ] **Step 4: Remove the now-unused dependencies**

```bash
cd webapp && npm uninstall @strapi/blocks-react-renderer react-markdown
```

- [ ] **Step 5: Typecheck and lint**

Run: `cd webapp && npx tsc --noEmit && npm run lint`
Expected: no errors

- [ ] **Step 6: Run the full test suite**

Run: `cd webapp && npm test`
Expected: PASS — every test

- [ ] **Step 7: Build and verify the route table**

Run: `cd webapp && npm run build`
Expected: build succeeds. `/blog`, `/blog/[slug]`, `/projects`, `/projects/[slug]`, `/things`, `/bookmarks` are static (`○` or `●`); `/about` is dynamic or revalidating, because it still fetches CMS status.

- [ ] **Step 8: Confirm content edits appear in dev**

Run: `cd webapp && npm run dev`, open `http://localhost:3000/blog`, edit the `title` in `content/articles/on-circles.mdx`, save, and refresh the browser.
Expected: the new title renders after a manual refresh. (No hot reload — Turbopack does not watch outside the app directory.)

- [ ] **Step 9: Confirm a broken reference fails the check**

Temporarily add `related: [ghost]` to `content/articles/on-circles.mdx`, then run: `cd webapp && npm run content:check`
Expected: FAIL naming `articles/on-circles.mdx` and `ghost`. Remove the line and re-run to confirm it passes.

- [ ] **Step 10: Commit**

```bash
git add webapp/src/lib/strapi.ts webapp/package.json webapp/package-lock.json
git commit -m "Shrink the Strapi client to uploads, downloads, and status"
```

---

## Deployment note

This is a hosting-configuration step, not a code change, and must happen before the first deploy from this branch:

- **Vercel:** enable *"Include source files outside of the Root Directory in the Build Step"* in Project Settings → Build.
- **Any other host:** run the build with `webapp/` as the working directory, or set `CONTENT_DIR` to the content tree. Building from the repository root does *not* work on its own — `contentDir()` resolves `path.join(process.cwd(), "..", "content")`, so a repo-root cwd looks one level above the repository.

If it is missed, `load()` throws `content directory not found` and the build fails loudly rather than deploying an empty site.

It can also fail *after* a successful build. `MaintenanceBanner` fetches Strapi with `next: { revalidate: 60 }`, which puts every route on ISR, so pages re-read `content/` from disk whenever they revalidate — content is not read at build time only. `outputFileTracingIncludes` in `next.config.ts` is what carries the tree into a traced deploy; `outputFileTracingRoot` alone does not, because the tracer never sees the runtime read. Removing the include breaks the site on the first cold render rather than at build time.
