import { assetUrl } from "@/content/asset";

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

/**
 * Null-guard adapter from a Strapi media record to a renderable URL. The
 * origin work belongs to `assetUrl`; this only unwraps the record and turns
 * a missing one into null rather than a broken src.
 */
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
