import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { fileURLToPath } from "node:url";

// Pin the workspace root. Next infers it by walking up for lockfiles, so a
// stray package-lock.json in the repo root above this app silently moves the
// root there — and module resolution for things like `@import "tailwindcss"`
// then starts from a directory with no node_modules. Turbopack tolerates it;
// webpack fails outright with "Can't resolve 'tailwindcss'".
const appDir = fileURLToPath(new URL(".", import.meta.url));

// Content lives at the repository root, outside this app, and both tracing
// settings below are needed to ship it. outputFileTracingRoot only *permits*
// files under the repo root to be traced; the tracer (@vercel/nft) still has
// to see them being read, and it cannot — load.ts reads the directory at
// runtime from a path computed off process.cwd(), which is invisible to static
// analysis. outputFileTracingIncludes is what actually carries the files.
// Without it a traced deploy (Vercel, `output: "standalone"`) fails at runtime
// with "content directory not found", because pages are on ISR via the
// MaintenanceBanner fetch and re-read the filesystem after revalidation.
const repoRoot = fileURLToPath(new URL("../", import.meta.url));

const baseConfig: NextConfig = {
  turbopack: {
    root: appDir,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cms.darkocejkov.ca",
        pathname: "/uploads/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/links", destination: "/bookmarks", permanent: true },
      { source: "/brain", destination: "/", permanent: true },
    ];
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

/**
 * The tracing settings are applied to the production build ONLY, and that is
 * load-bearing rather than tidiness.
 *
 * `outputFileTracingRoot` does double duty in Next: it is the tracing root,
 * and it is also the root webpack resolves modules from. `next dev` runs on
 * webpack unless `--turbopack` is passed, so setting it globally makes dev
 * resolve `node_modules` from the repository root — which has none — and
 * `@import "tailwindcss"` dies with "Can't resolve 'tailwindcss'". Builds are
 * unaffected because `turbopack.root` above pins Turbopack to this directory.
 *
 * It cannot simply be dropped either: with the project root left at this
 * directory, `../content/**` is rejected outright — "glob is invalid, it has a
 * prefix that navigates out of the project root".
 *
 * Phase is the axis that separates the two: tracing exists to produce build
 * output, and dev never traces. Both needs are met by scoping it to the build.
 *
 * Moving this app to the repository root would dissolve the conflict entirely
 * — `content/` would sit inside the project root, no tracing root would be
 * needed, and the Vercel "Include source files outside of the Root Directory"
 * setting could go too.
 */
export default function config(phase: string): NextConfig {
  if (phase !== PHASE_PRODUCTION_BUILD) return baseConfig;

  return {
    ...baseConfig,
    outputFileTracingRoot: repoRoot,
    // Globs resolve from this app directory (Next runs them with cwd = project
    // dir), so ../content is the repo-root folder. "/**" applies to every route.
    outputFileTracingIncludes: {
      "/**": ["../content/**/*"],
    },
  };
}
