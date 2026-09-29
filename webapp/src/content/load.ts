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
