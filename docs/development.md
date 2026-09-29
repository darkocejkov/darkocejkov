# Development

A Next.js app whose content lives in the repository rather than in a CMS.

```
content/   authored content as MDX: experience, education, skills,
           projects, articles, things, links
src/       the app. src/content/ is the loader that turns those files
           into a validated, cross-referenced graph
docs/      this, plus the design specs under docs/superpowers/
```

Strapi still runs behind it, but only for the things a file cannot do: the media
library, downloadable files, and the state that has to change without a deploy —
the maintenance banner and the availability flags.

## Running it

```bash
npm install
npm run dev
```

The CMS runs separately on `localhost:1337`. It does not need to be up: every
call into it is wrapped, so the site builds and renders without it — you lose
the maintenance banner, the "open to work" badge, and the downloads list, and
nothing else.

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm test` | Unit tests |
| `npm run content:check` | Validates and resolves the real content tree |
| `npm run lint` | ESLint |

Run `content:check` before committing content. It takes a couple of seconds and
exits nonzero on any schema or unresolved-reference error — the pre-commit
substitute for a CMS admin refusing to publish something broken.

## Writing content

Every item is one MDX file whose **filename is its slug**. Frontmatter is
validated by `src/content/schema.ts`, which is the contract: if a field is not
in there, it does not exist.

**Relations are declared once and inverted.** An article names `related`, and
the backlinks on the other end are derived. An article names its `project`, and
that project's article list is derived. Nothing authors an inverse by hand,
because maintaining both halves is how content graphs rot.

**Unresolved references fail the build.** A typo'd skill slug is an error naming
the file and the slug, not an `undefined` three components deep. The one
exception: a published article may reference a draft, and that reference is
dropped silently rather than erroring — the draft legitimately exists, and
forbidding the link until it ships would be worse.

**Images go to the CMS**, and are referenced by relative `/uploads/...` path,
never an absolute URL. `assetUrl()` resolves them at render, so moving the CMS
does not break every image in every file.

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

Without it, a traced deploy ships without `content/` and fails *after* deploy
rather than at build time — quietly, serving stale prerendered pages while the
function logs fill with `content directory not found`. Every route is on ISR
because the root layout fetches the maintenance banner, so pages do re-read the
filesystem long after the build.

See `docs/superpowers/specs/2026-09-28-markdown-content-layer-design.md` for why
the content layer is shaped the way it is.
