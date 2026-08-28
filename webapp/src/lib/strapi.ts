import type { BlocksContent } from "@strapi/blocks-react-renderer";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

/** Strapi returns relative media paths (/uploads/...), so they need the CMS origin. */
export function mediaUrl(media: StrapiMedia | null | undefined): string | null {
  if (!media?.url) return null;
  return media.url.startsWith("http") ? media.url : `${CMS_URL}${media.url}`;
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

/* ------------------------------------------------------------------ */
/* Envelopes                                                           */
/* ------------------------------------------------------------------ */

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

export type { BlocksContent };

/* ------------------------------------------------------------------ */
/* Taxonomy                                                            */
/* ------------------------------------------------------------------ */

/** The FORMAT of an article (Note, Essay, Log...), not its subject. */
export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
}

/** Global subject taxonomy, shared across every content type. */
export interface Tag {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
}

export type Proficiency = "novice" | "working" | "fluent" | "deep";

export interface Skill {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  description: string | null;
  proficiency: Proficiency | null;
  lastUsed: string | null;
  iconKey: string | null;
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

export interface Article {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  summary: string | null;
  publishedAt: string;
  cover: StrapiMedia | null;
  category: Category | null;
  tags: Tag[];
  skills: Skill[];
}

export interface ArticleFull extends Article {
  body: BlocksContent;
  related: Pick<Article, "id" | "documentId" | "title" | "slug" | "summary">[];
  backlinks: Pick<Article, "id" | "documentId" | "title" | "slug" | "summary">[];
}

export interface Highlight {
  id: number;
  text: string;
}

export interface Experience {
  id: number;
  documentId: string;
  role: string;
  organization: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  summary: string | null;
  highlights: Highlight[];
  skills: Skill[];
}

export interface Course {
  id: number;
  name: string;
  description: string | null;
  year: string | null;
}

export interface Education {
  id: number;
  documentId: string;
  title: string;
  institution: string;
  summary: string | null;
  startDate: string | null;
  endDate: string | null;
  courses: Course[];
  skills: Skill[];
}

export interface SiteLink {
  id: number;
  documentId: string;
  label: string;
  url: string;
  iconKey: string | null;
  order: number;
}

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

export interface SiteMeta {
  id: number;
  documentId: string;
  displayName: string;
  headline: string | null;
  shortBio: string | null;
  bio: BlocksContent | null;
  metaDescription: string | null;
  avatar: StrapiMedia | null;
  lookingForWork: boolean;
  underConstruction: boolean;
  notifications: SiteNotification[];
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

/** Flatten a Blocks tree to plain text — used for reading-time estimates. */
export function blocksToPlainText(blocks: BlocksContent | null | undefined): string {
  if (!Array.isArray(blocks)) return "";
  const walk = (node: unknown): string => {
    if (!node || typeof node !== "object") return "";
    const n = node as { text?: string; children?: unknown[] };
    if (typeof n.text === "string") return n.text;
    if (Array.isArray(n.children)) return n.children.map(walk).join(" ");
    return "";
  };
  return blocks.map(walk).join(" ");
}

/** Reading time in minutes, computed rather than stored in the CMS. */
export function readingTime(blocks: BlocksContent | null | undefined): number | null {
  const words = blocksToPlainText(blocks).trim().split(/\s+/).filter(Boolean).length;
  if (!words) return null;
  return Math.max(1, Math.round(words / 200));
}

/** A notification is live when now falls inside its optional window. */
export function isNotificationActive(n: SiteNotification, now = new Date()): boolean {
  if (n.startsAt && new Date(n.startsAt) > now) return false;
  if (n.endsAt && new Date(n.endsAt) < now) return false;
  return true;
}
