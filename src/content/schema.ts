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
 * A slug or tag repeated in a YAML list is an authoring slip, never a request
 * for the item to appear twice. Deduping here — at the one boundary every
 * reference list passes through — means nothing downstream has to defend
 * against it: no duplicate React keys under "Linked from", no
 * "TypeScript, TypeScript" in a tools row, no inflated tag counts.
 *
 * The default runs first, so an omitted field still yields `[]`. Asset lists
 * (`gallery`, `media`) deliberately do not use this: repeating an image is a
 * legitimate editorial choice.
 */
const uniqueList = (item: z.ZodType<string, string>) =>
  z
    .array(item)
    .default([])
    .transform((values) => [...new Set(values)]);

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
 * Uploaded media lives in the R2 bucket. Store its bucket-relative path so
 * content stays independent of the public asset hostname.
 */
export const Asset = z.object({
  src: z
    .string()
    .regex(/^\/(art|assets)\//, "must begin with /art/ or /assets/"),
  alt: z.string(),
  caption: z.string().optional(),
});
export type Asset = z.infer<typeof Asset>;

export const EmploymentType = z.enum(["internship", "full-time", "part-time", "contract"]);
export type EmploymentType = z.infer<typeof EmploymentType>;

export const Proficiency = z.enum(["novice", "working", "fluent", "deep"]);
export type Proficiency = z.infer<typeof Proficiency>;

export const ThingType = z.enum(["book", "record", "tool", "video", "gear", "furniture", "other"]);
export type ThingType = z.infer<typeof ThingType>;

export const ProjectStage = z.enum(["concept", "in-progress", "shipped", "archived"]);
export type ProjectStage = z.infer<typeof ProjectStage>;

export const LinkType = z.enum(["social", "bookmark"]);
export type LinkType = z.infer<typeof LinkType>;

/** A headline figure shown large above a writeup, e.g. `{ value: "880", label: "PRs authored" }`. */
export const Highlight = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});
export type Highlight = z.infer<typeof Highlight>;

export const ExperienceFrontmatter = z.object({
  title: z.string().min(1),
  company: z.string().min(1),
  companyUrl: urlString.optional(),
  type: EmploymentType.optional(),
  startDate: dateString,
  endDate: dateString.optional(),
  skills: uniqueList(slugRef),
  highlights: z.array(Highlight).default([]),
});
export type ExperienceFrontmatter = z.infer<typeof ExperienceFrontmatter>;

export const EducationFrontmatter = z.object({
  title: z.string().min(1),
  institution: z.string().min(1),
  startDate: dateString,
  endDate: dateString.optional(),
  highlights: z.array(Highlight).default([]),
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
  tags: uniqueList(z.string()),
  skills: uniqueList(slugRef),
  gallery: z.array(Asset).default([]),
});
export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatter>;

export const ArtworkImage = Asset.extend({
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const ArtworkFrontmatter = z.object({
  name: z.string().min(1),
  image: ArtworkImage,
  description: z.string().optional(),
  medium: z.string().optional(),
  materials: z.string().optional(),
  year: z.string().optional(),
  dimensions: z.string().optional(),
  series: z.string().optional(),
  order: z.number().int().default(0),
  tags: uniqueList(z.string()),
});
export type ArtworkFrontmatter = z.infer<typeof ArtworkFrontmatter>;

export const VideoFrontmatter = z.object({
  name: z.string().min(1),
  video: z.object({
    src: z.string().regex(/^\/video\/.+/, "must be an R2 path beginning with /video/"),
    poster: z.string().regex(/^\/(art|assets)\/.+/, "must begin with /art/ or /assets/").optional(),
  }),
  description: z.string().optional(),
  year: z.string().optional(),
  order: z.number().int().default(0),
  tags: uniqueList(z.string()),
});
export type VideoFrontmatter = z.infer<typeof VideoFrontmatter>;

export const ArticleFrontmatter = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  publishedAt: dateString,
  draft: z.boolean().default(false),
  cover: Asset.optional(),
  category: z.string().optional(),
  tags: uniqueList(z.string()),
  skills: uniqueList(slugRef),
  related: uniqueList(slugRef),
  project: slugRef.optional(),
});
export type ArticleFrontmatter = z.infer<typeof ArticleFrontmatter>;

export const ThingFrontmatter = z.object({
  name: z.string().min(1),
  type: ThingType.optional(),
  isSelf: z.boolean().default(false),
  media: z.array(Asset).default([]),
  tags: uniqueList(z.string()),
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
  tags: uniqueList(z.string()),
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

export const ArticlesPageFrontmatter = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
});
export type ArticlesPageFrontmatter = z.infer<typeof ArticlesPageFrontmatter>;

const notificationDateTime = z.preprocess(
  (value) => (value instanceof Date ? value.toISOString() : value),
  z.string().refine((value) => !Number.isNaN(Date.parse(value)), "must be a valid date/time")
);

export const SiteNotification = z.object({
  message: z.string().min(1),
  level: z.enum(["info", "success", "warning"]).default("info"),
  url: z.string().min(1).optional(),
  startsAt: notificationDateTime.optional(),
  endsAt: notificationDateTime.optional(),
});
export type SiteNotification = z.infer<typeof SiteNotification>;

export const ResumeDownload = z.object({
  title: z.string().min(1),
  file: z.string().regex(/^\/resume\/.+/, "must be an R2 path beginning with /resume/"),
  description: z.string().optional(),
  version: z.string().optional(),
});
export type ResumeDownload = z.infer<typeof ResumeDownload>;

export const MetadataFrontmatter = z.object({
  lookingForWork: z.boolean().default(false),
  currently: z.string().nullable().default(null),
  underConstruction: z.boolean().default(false),
  notifications: z.array(SiteNotification).default([]),
  downloads: z.array(ResumeDownload).default([]),
});
export type MetadataFrontmatter = z.infer<typeof MetadataFrontmatter>;
