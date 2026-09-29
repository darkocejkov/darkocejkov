import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

// Pin the workspace root. Next infers it by walking up for lockfiles, so a
// stray package-lock.json in the repo root above this app silently moves the
// root there — and module resolution for things like `@import "tailwindcss"`
// then starts from a directory with no node_modules. Turbopack tolerates it;
// webpack fails outright with "Can't resolve 'tailwindcss'".
const appDir = fileURLToPath(new URL(".", import.meta.url));

// Content lives at the repository root, outside this app. Tracing has to start
// there or the build will not carry those files. Distinct from turbopack.root,
// which must stay pinned to appDir — see the comment above.
const repoRoot = fileURLToPath(new URL("../", import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: appDir,
  },
  outputFileTracingRoot: repoRoot,
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
