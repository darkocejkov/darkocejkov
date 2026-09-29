# Markdown content layer — retiring the CMS for authored content

**Date:** 2026-09-28
**Status:** Approved, ready for implementation planning

## Concept

Authored content moves out of Strapi and into MDX files in the repository. The CMS keeps only
what genuinely needs a service behind it: the media library, downloadable files, and the two
kinds of state that must change without a deploy — the maintenance banner and the availability
flags.

The motivation is control. A CMS imposes a shape on content and a ceiling on presentation;
every bespoke thing the site wants to do has to be negotiated with the admin UI. Files impose
nothing. MDX in particular lets a project page place a gallery mid-paragraph or embed something
inline without a schema change.

The cost is that publishing becomes a commit, and content can now fail a build. Both are
accepted deliberately. `npm run content:check` exists to make the second one cheap.

## Scope

| Lives in | What |
|---|---|
| `content/` (repo) | experience, education, skills, projects, articles, things, links & bookmarks, about, statement |
| Strapi | media library, downloads (resume etc.), `SiteMeta` (`underConstruction`, notifications), `About.lookingForWork`, `About.currently` |

Taxonomy — tags, article categories, project types — becomes plain strings in frontmatter. No
declaration files; the loader collects the union across items.

**No CMS schema change is required.** The remaining Strapi content types keep their current
shape; the app simply stops reading the fields that moved.

## Decisions

| Decision | Choice | Why |
|---|---|---|
| Body format | MDX | Inline components are the point — a gallery or embed mid-body without a schema change. |
| Loader | Hand-rolled: `gray-matter` + `zod` + `next-mdx-remote/rsc` | ~200 lines fully owned, matching the project's preference for control over convention. No pipeline framework to keep in step with Next 16. |
| Load strategy | One eager graph, resolved in two passes | Backlinks require the whole corpus regardless; a lazy per-type API would read everything anyway while pretending not to. |
| Taxonomy | Implicit strings | Tags multiply naturally; declaring each one is friction without payoff. |
| Migration | None — author fresh | The CMS holds no content worth exporting. Removes the Blocks→MDX converter entirely. |
| Identity | Filename is the slug | `id`, `documentId` and `slug` existed only because a database needed them. |
| Inverse relations | Derived, never authored | Declaring both halves of a relation is how content graphs rot. |
| Asset references | Relative paths (`/uploads/x.png`), resolved by `mediaUrl()` | Absolute URLs bake `localhost:1337` / `cms.darkocejkov.ca` into content and break on any CMS move. |
| Unknown slug references | Build error | The safety a database relation gave for free must be handed back deliberately. |
| Content location | `content/` at repo root | Keeps content out of the application directory. Requires build configuration — see Deployment. |
| Dev caching | Memoize in production only | A module singleton would need a server restart per edit. Re-reading per request costs single-digit milliseconds at this corpus size. |
| Rendering | Prerendered, then revalidated | `generateStaticParams` over the graph. Faster than today, where every render hits the CMS — but the maintenance banner puts every route on ISR, so pages re-read `content/` after revalidation. See Deployment. |

### Why one eager graph rather than per-type loaders

Mirroring `strapi.ts` one function at a time is the obvious move, and it fails on backlinks:
determining what links *to* an article means reading every article. `getArticle()` would load
the whole corpus while presenting itself as a targeted read.

Loading everything once and resolving references in a second pass matches what the data
actually is — a small graph, not ten independent lists. Backlinks, project↔article links and
the tag union all fall out of that pass instead of each becoming a special case. It also gives
one honest place to fail: a bad slug throws at load with a file path, rather than surfacing as
`undefined` three components deep.

## Architecture

```
content/                      # repo root
  experience/*.mdx
  education/*.mdx
  skills/*.mdx
  projects/*.mdx
  articles/*.mdx
  things/*.mdx
  links/*.mdx
  about.mdx
  statement.mdx

webapp/src/content/
  schema.ts     zod schemas — the single definition of every item shape
  load.ts       read + parse frontmatter + validate  (raw, unresolved)
  graph.ts      resolve references, invert relations, collect tags
  index.ts      the public API pages import
  mdx.tsx       MDX component map and compile helper
```

Four units with one job each. `schema.ts` and `load.ts` know nothing about relationships;
`graph.ts` knows nothing about the filesystem; `index.ts` is the only thing pages import.

### `schema.ts` — shapes

zod becomes the schema of record. The current interfaces in `lib/strapi.ts` are hand-written
assertions about API responses that are never checked; frontmatter is hand-typed YAML and
genuinely needs validating. TypeScript types are inferred from the schemas rather than
maintained alongside them.

A shared asset schema, because Strapi carried `alternativeText` on the media record and
frontmatter must carry it explicitly or images ship without alt text:

```ts
const Asset = z.object({
  src: z.string().startsWith("/uploads/"),
  alt: z.string(),
  caption: z.string().optional(),
});
```

**experience/** — sorted by `startDate` descending. `isCurrent` is derived from a missing
`endDate` rather than authored.

```yaml
title: Software Engineer
company: Moz
companyUrl: https://moz.com      # optional
type: full-time                  # internship | full-time | part-time | contract
startDate: 2024-06-01
endDate: 2026-03-01              # omit while current
skills: [typescript, react]      # slugs, validated against skills/
```

**education/** — same sort. Was a Strapi single type limited to one qualification; as files
that limit has no reason to exist.

```yaml
title: BSc Computer Science
institution: York University
startDate: 2019-09-01
endDate: 2023-06-01              # optional
```

**skills/** — body is the description.

```yaml
name: TypeScript
proficiency: fluent              # novice | working | fluent | deep  (optional)
lastUsed: 2026-09                # optional
iconKey: typescript              # optional
```

**projects/** — `featured` and `order` survive because "which three go at the top" is an
editorial choice no date expresses. `articles` is derived, never authored.

```yaml
title: Orbit Rail
summary: One-line description
cover: { src: /uploads/orbit.png, alt: The orbit rail in motion }
year: "2026"                     # optional
materials: SVG, Motion           # optional
featured: true
order: 0
stage: shipped                   # concept | in-progress | shipped | archived
type: web                        # free string
embedUrl: https://...            # optional
startDate: 2026-01-01            # optional
endDate: 2026-04-01              # optional
repoUrl: https://...             # optional
liveUrl: https://...             # optional
tags: [svg, animation]
skills: [typescript]
gallery:
  - { src: /uploads/a.png, alt: "...", caption: "..." }
```

**articles/** — sorted by `publishedAt` descending. `draft` replaces Strapi's publish state:
drafts render in development and are excluded from production builds. `backlinks` is derived
by inverting `related`.

```yaml
title: On circles
summary: One-line description
publishedAt: 2026-09-28
draft: false
cover: { src: /uploads/c.png, alt: "..." }   # optional
category: essay                  # free string
tags: [design]
skills: []
related: [another-article]       # slugs, validated
project: orbit-rail              # optional; inverts into project.articles
```

**things/** — body is the notes.

```yaml
name: Juno-106
type: record                     # book | record | tool | gear | furniture | other
isSelf: false
media:
  - { src: /uploads/juno.png, alt: "..." }
tags: [synths]
```

**links/** — `order` survives; footer socials have a deliberate sequence.

```yaml
title: GitHub
url: https://github.com/darkocejkov
description: ...                 # optional
iconKey: github                  # optional
order: 0
savedAt: 2026-01-01              # optional
type: social                     # social | bookmark
tags: []
```

**about.mdx** — identity in frontmatter, long bio as the body. The Strapi `About` record was
one entity doing three jobs; this splits it along the line of what changes without a deploy.

```yaml
displayName: Darko Cejkov
pronouns: they/them              # optional
headline: developer, designer, creator
shortBio: One or two sentences
portrait: { src: /uploads/me.png, alt: "..." }
location: Toronto
email: ...
metaDescription: ...
```

**statement.mdx** — the practice statement, its own file because it is its own piece of
writing. Frontmatter carries only `title`.

`lookingForWork` and `currently` stay in Strapi and are read separately.

### `load.ts` — read and validate

Globs each content directory, parses frontmatter with `gray-matter`, validates against the
matching zod schema. Returns raw items plus their unresolved reference slugs.

**Failures are collected, never fail-fast.** Fail-fast means fixing one typo per build across
six builds. One run reports every invalid file with its path and the zod issue.

**A missing or empty `content/` directory throws.** This makes a misconfigured deployment a
loud build failure rather than a silently empty portfolio.

### `graph.ts` — resolve

Second pass over the loaded items:

1. `skills: [slug]` → `Skill` objects. Unknown slug is an error.
2. `related: [slug]` → articles, then inverted to produce `backlinks`. Unknown slug is an error.
3. `article.project` → project, then inverted to produce `project.articles`.
4. Tag strings collected into a union with counts.
5. Items sorted per type (date descending; projects by `featured` then `order`).

Like `load.ts`, errors accumulate before being reported together.

**Environment is injected, not read.** `load.ts` and `graph.ts` take an explicit
`{ dir, includeDrafts }` rather than consulting `NODE_ENV` themselves; `index.ts` is the only
module that derives those from the environment. This keeps both units pure functions of their
arguments, which is what makes the draft-filtering and fixture tests possible without mutating
global state.

Memoized at module level in `index.ts` **only when `NODE_ENV === "production"`**. In
development the graph rebuilds per request so a saved file shows on refresh.

### `index.ts` — the public API

Deliberately shaped like the existing `strapi.ts` surface, so page components change by a line
or two rather than being rewritten. The redesign stays behind the seam.

```ts
getExperience(): Experience[]
getEducation(): Education[]
getSkills(): Skill[]
getSkill(slug: string): Skill | null
getProjects(): Project[]
getProject(slug: string): ProjectFull | null
getArticles(): Article[]
getArticle(slug: string): ArticleFull | null
getThings(): Thing[]
getLinks(type?: LinkType): SiteLink[]
getTags(): { tag: string; count: number }[]
getAbout(): About
getStatement(): Statement
```

### `mdx.tsx` — rendering

`compileMDX` from `next-mdx-remote/rsc`, keeping `remark-gfm`. The component map:

- `img` override routing `/uploads/...` through the existing `mediaUrl()`
- `a` — external links get `target="_blank"` and `rel`
- `<Gallery>` and `<Embed>` for mid-body use, sharing the components the page templates use

Prose styling reuses the class list already in `components/Markdown.tsx`.

## What Strapi becomes

`lib/strapi.ts` shrinks to roughly sixty lines: `strapiGet`, `checkHealth`, `mediaUrl`, and
types for `SiteMeta`, `SiteNotification`, `Download`, and a trimmed `SiteStatus` carrying only
`lookingForWork` and `currently` (renamed from `About`, since the identity half of that record
now lives in `content/about.mdx` and two types called `About` would be a trap).

Every other type — `LinkType`, `Proficiency`, `EmploymentType`, `ThingType`, `ProjectStage`,
`Tag`, `Skill`, and the content interfaces — moves to `content/schema.ts` as zod schemas with
inferred types. `lib/strapi.ts` stops being the project's type vocabulary.

Deleted outright: `@strapi/blocks-react-renderer`, `components/RichText.tsx`, and every Blocks
type — nothing that remains in the CMS uses Blocks.

Added: `gray-matter`, `zod`, `next-mdx-remote`.

## Page migration

| Page | Change |
|---|---|
| `app/about/page.tsx` | `getAbout()` / `getStatement()`; Strapi for `lookingForWork`, `currently`, downloads; `getLinks("social")` |
| `app/blog/page.tsx` | `getArticles()`, `getTags()` |
| `app/blog/[slug]/page.tsx` | `getArticle()`, `generateStaticParams` over `getArticles()` |
| `app/projects/page.tsx` | `getProjects()` |
| `app/projects/[slug]/page.tsx` | `getProject()`, `generateStaticParams` |
| `app/things/page.tsx` | `getThings()` |
| `app/bookmarks/page.tsx` | `getLinks("bookmark")` |
| `components/MaintenanceBanner.tsx` | Unchanged — stays on Strapi |
| `app/api/health/route.ts` | Unchanged |

New pages for experience and education are **out of scope**. Those types are currently defined
but unrendered; this work makes the data available, and designing those pages is separate.

## Deployment

Content sits outside the Next application directory, so both the build *and the running
server* must reach it. The tempting simplification — that content is read at build time only,
which would make this a build configuration concern rather than a runtime bundling one — is
wrong, and the implementation proved it. The root layout renders `MaintenanceBanner`, which
fetches Strapi with `next: { revalidate: 60 }`, and that puts every route on ISR. Pages are
prerendered, but they re-render on the server once their revalidation window lapses, and each
of those re-renders reads `content/` off the filesystem again.

- Enable *"Include source files outside of the Root Directory in the Build Step"* on Vercel
  (Project Settings → Build). On another host, build with the app directory as the working
  directory, or set `CONTENT_DIR`. Building from the repository root is *not* an escape hatch
  on its own: `contentDir()` resolves `path.join(process.cwd(), "..", "content")`, so a
  repo-root cwd looks for content in the repository's parent and fails.
- Set `outputFileTracingRoot` to the repository root in `next.config.ts`. This is independent
  of `turbopack.root`, which must stay pinned to the app directory — a stray root lockfile
  otherwise breaks module resolution.
- Set `outputFileTracingIncludes` to carry `../content/**/*` into every route. This is
  load-bearing, not belt-and-braces. `outputFileTracingRoot` only *permits* files under the
  repository root to be traced; the tracer still has to observe them being read, and it cannot,
  because `load.ts` reads a directory computed from `process.cwd()` at runtime and no static
  analysis follows that. Without the explicit include, a traced deploy ships without `content/`
  and 500s on the first render after a revalidation — not at build time, when it would be
  noticed.
- The empty-directory guard in `load.ts` turns a misconfiguration into a loud failure, and its
  message names the Vercel setting rather than leaving the reader to find it here.

**Known ergonomic cost:** Turbopack watches only inside the Next project, so editing a file in
`content/` will not hot-reload. Because the graph re-reads per request in development, a manual
browser refresh picks up the change.

## Verification

`npm run content:check` runs both passes over the real `content/` directory and exits nonzero
on any schema or reference failure, without a full build. This is the pre-commit substitute
for the admin UI refusing to publish something broken.

It is implemented as a Vitest test that loads the real content tree, run via
`vitest run content-check`. Vitest is already a dependency and already knows how to execute
TypeScript — a standalone script would mean adding `tsx` or a build step to run three lines.

## Testing

Vitest is already configured. `load.ts` and `graph.ts` are pure given a directory path and
deserve real tests against a small fixture content tree:

- valid frontmatter parses into the expected shape
- invalid frontmatter is rejected, and **all** failures are reported, not just the first
- `related` inverts into `backlinks` on both articles
- `article.project` inverts into `project.articles`
- tag union counts correctly across types
- an unknown skill slug throws naming the file and the slug
- a missing content directory throws
- drafts are excluded when `includeDrafts` is false and present when true

Page swaps are mechanical and need no tests of their own.

## Out of scope

- Experience and education page designs
- Tag archive routes (`getTags()` exists; no route consumes it yet)
- Search, RSS
- Any change to the Strapi schema
