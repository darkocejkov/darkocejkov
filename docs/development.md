# Development

A Next.js app whose content lives in the repository rather than in a CMS.

```
content/   authored content as MDX: experience, education, skills,
           projects, articles, things, links
src/       the app. src/content/ is the loader that turns those files
           into a validated, cross-referenced graph
docs/      this, plus the design specs under docs/superpowers/
```

R2 serves uploaded media and downloadable files from `assets.darkocejkov.ca`.
Availability, notifications, and resume links are versioned in
`content/metadata.mdx`.

## Running it

```bash
npm install
npm run dev
```

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run new` | Interactively scaffold a content entry with Plop |
| `npm run build` | Production build |
| `npm test` | Unit tests |
| `npm run content:check` | Validates and resolves the real content tree |
| `npm run lint` | ESLint |

Run `content:check` before committing content. It takes a couple of seconds and
exits nonzero on any schema or unresolved-reference error.

### Environment

The `/connect` email form sends through [Resend](https://resend.com) from
`/api/connect`. Without these set, the form answers with a "not set up" error.

| Variable | Value |
|---|---|
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO` | Inbox that receives submissions |
| `CONTACT_FROM` | Sender on a Resend-verified domain, e.g. `connect@darkocejkov.ca` |

## Writing content

Every item is one MDX file whose **filename is its slug**. Frontmatter is
validated by `src/content/schema.ts`, which is the contract: if a field is not
in there, it does not exist.

Run `npm run new` to scaffold an article, project, artwork, experience,
education entry, skill, thing, or link. The generator asks for the required
fields, suggests a kebab-case filename, and writes schema-compatible MDX under
`content/`.
Templates live in `plop-templates/`; their prompts and output paths are defined
in `plopfile.cjs`.

`content/articles.mdx` is the articles landing page, not an article in the
`content/articles/` collection. Its `title` and `subtitle` frontmatter and MDX
body provide the heading, subheading, and description shown at `/brain`.

`content/metadata.mdx` holds the open-to-work flag, current status, construction
flag, dated notifications, and downloadable files. Resume files use paths under
`/resume/`; each download has a title, file path, and optional description or
version.

**Relations are declared once and inverted.** An article names `related`, and
the backlinks on the other end are derived. An article names its `project`, and
that project's article list is derived. Nothing authors an inverse by hand,
because maintaining both halves is how content graphs rot.

**Unresolved references fail the build.** A typo'd skill slug is an error naming
the file and the slug, not an `undefined` three components deep. The one
exception: a published article may reference a draft, and that reference is
dropped silently rather than erroring — the draft legitimately exists, and
forbidding the link until it ships would be worse.

**Media goes to R2** and is referenced by bucket-relative paths: high-quality
images under `/art/`, other images and files under `/assets/`, and resumes under
`/resume/`. `assetUrl()` resolves these against
`https://assets.darkocejkov.ca`.

**`draft: true`** keeps an article out of production builds while leaving it
visible in development.

**Dates are bare calendar dates** (`YYYY-MM-DD` or `YYYY-MM`). They are rendered
in UTC deliberately: they parse as UTC midnight, so formatting them in local
time renders the day before for any reader west of UTC.

A caveat worth knowing: editing a file in `content/` does not hot-reload, because
Turbopack watches the app's source rather than arbitrary data files. The graph
re-reads on every request in development, so a browser refresh picks it up.

## Deployment

`content/` sits inside the project root, so nothing special is needed to reach
it — but `outputFileTracingIncludes` in `next.config.ts` is load-bearing and
should not be removed. It looks redundant now that content is inside the
project; it is not. `load.ts` reads the directory at runtime from a path
computed off `process.cwd()`, and the tracer only includes what it can find by
static analysis, at any path depth.

Without it, a traced deployment can omit `content/`. Unprerendered article and
project routes can render on demand, so those routes need the content directory
at runtime.

See `docs/superpowers/specs/2026-09-28-markdown-content-layer-design.md` for why
the content layer is shaped the way it is.
