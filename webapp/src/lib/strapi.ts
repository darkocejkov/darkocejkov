const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? "http://localhost:1337";

export async function strapiGet<T>(
  path: string,
  params?: Record<string, string>
): Promise<T> {
  const url = new URL(`/api${path}`, CMS_URL);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }
  const res = await fetch(url.toString(), { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Strapi fetch failed: ${path} (${res.status})`);
  return res.json();
}

export interface StrapiList<T> {
  data: T[];
}

export interface SocialLink {
  id: number;
  title: string;
  url: string;
  category: "personal" | "professional";
}

export interface About {
  id: number;
  displayName: string;
  headline: string | null;
  shortBio: string | null;
  content: string | null;
  openToWork: boolean;
  underMaintenance: boolean;
  metaDescription: string | null;
  avatar: StrapiMedia | null;
  gallery: StrapiMedia[] | null;
}

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
}

export interface StrapySingle<T> {
  data: T;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location: string | null;
  url: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  type: "internship" | "full-time" | "part-time" | null;
  summary: string | null;
  description: string | null;
}

export interface Course {
  id: number;
  name: string;
  grade: string | null;
}

export interface Education {
  id: number;
  school: string;
  degree: string;
  location: string | null;
  url: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  grade: number | null;
  gradeScale: number | null;
  courses: Course[];
}

export type BlogCategory = "general" | "technology" | "project" | "design" | "career" | "personal";

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[] | null;
  featured: boolean;
  readingTime: number | null;
  publishedAt: string;
  coverImage: StrapiMedia | null;
}

export interface BlogPostFull extends BlogPost {
  content: string;
  coverImage: StrapiMedia | null;
  metaDescription: string | null;
}

export type SkillCategory =
  | "frontend"
  | "backend"
  | "module"
  | "cloud"
  | "devops"
  | "design"
  | "data"
  | "mobile"
  | "testing"
  | "software"
  | "other";

export interface Skill {
  id: number;
  name: string;
  slug: string;
  category: SkillCategory;
  level: "familiar" | "beginner" | "intermediate" | "advanced" | "expert";
  description: string | null;
  lastUsed: string | null;
}

export interface Resume {
  id: number;
  label: string;
  order: number;
  file: StrapiMedia;
}
