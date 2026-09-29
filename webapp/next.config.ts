import type { NextConfig } from "next";
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
// Distinct from turbopack.root, which must stay pinned to appDir — see the
// comment above.
const repoRoot = fileURLToPath(new URL("../", import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: appDir,
  },
  outputFileTracingRoot: repoRoot,
  // Globs resolve from this app directory (Next runs them with cwd = project
  // dir), so ../content is the repo-root folder. "/**" applies to every route.
  outputFileTracingIncludes: {
    "/**": ["../content/**/*"],
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

export default nextConfig;
