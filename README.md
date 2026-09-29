# Howdy! (｡•̀ᴗ-)✧ 
i'm a passionate developer, designer, and creator.
i love making, breaking, fixing, and understanding things. it's what i do.
i am very inspired to create cool things.
you can check out my [repos](https://github.com/darkocejkov?tab=repositories) to see some of my work or head on over to my [portfolio](https://www.darkocejkov.ca).

---

## This repository

The portfolio itself — a Next.js app whose content lives in the repo rather than in a CMS.

```
content/   authored content as MDX: experience, education, skills,
           projects, articles, things, links
src/       the app. src/content/ is the loader that turns those files
           into a validated, cross-referenced graph
```

Strapi still runs behind it, but only for the things a file cannot do: the media
library, downloadable files, and the state that has to change without a deploy —
the maintenance banner and the availability flags.

## Running it

```bash
npm install
npm run dev
```

`npm run content:check` validates and resolves the real content tree in a couple
of seconds, exiting nonzero on any schema or unresolved-reference error. Run it
before committing content — it is the pre-commit substitute for a CMS admin
refusing to publish something broken.

## Writing content

Every item is one MDX file whose **filename is its slug**. Frontmatter is
validated by `src/content/schema.ts`, which is the contract: if a field is not
in there, it does not exist.

Relations are declared once and inverted automatically — an article names
`related`, and the backlinks on the other end are derived. Nothing authors an
inverse by hand.

Images are uploaded to the CMS and referenced by their relative `/uploads/...`
path, never an absolute URL, so moving the CMS does not break every image.

`draft: true` keeps an article out of production builds while leaving it visible
in development.
