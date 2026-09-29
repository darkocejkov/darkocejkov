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
