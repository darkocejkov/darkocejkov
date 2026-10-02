import path from "node:path";
import { load } from "./load";
import { resolve, type ContentGraph } from "./graph";
import type {
  Article,
  ArticlesPage,
  Artwork,
  Education,
  Experience,
  Project,
  Skill,
  SiteLink,
  Thing,
  Video,
} from "./graph";
import type { LinkType, MetadataFrontmatter } from "./schema";

export type {
  About,
  Article,
  ArticlesPage,
  ArticleRef,
  Artwork,
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
  Video,
} from "./graph";
export type {
  Asset,
  EmploymentType,
  LinkType,
  MetadataFrontmatter,
  Proficiency,
  ProjectStage,
  ResumeDownload,
  SiteNotification,
  ThingType,
} from "./schema";
export { assetUrl, isExternalHref } from "./asset";
export { ContentError } from "./load";

/**
 * Content sits at the project root, alongside the app that reads it. Next runs
 * with the project directory as its cwd during both build and dev.
 * CONTENT_DIR overrides it for tests.
 */
export function contentDir(): string {
  return process.env.CONTENT_DIR ?? path.join(process.cwd(), "content");
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

export function getArtworks(): Artwork[] {
  return getGraph().artworks;
}

export function getVideos(): Video[] {
  return getGraph().videos;
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

export function getArticlesPage(): ArticlesPage {
  return getGraph().articlesPage;
}

export function getMetadata(): MetadataFrontmatter {
  return getGraph().metadata;
}
