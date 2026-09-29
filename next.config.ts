import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";

// Pin the workspace root. Next infers it by walking up for lockfiles, so a
// stray package-lock.json in any directory above this one silently moves the
// root there — and module resolution for things like `@import "tailwindcss"`
// then starts from a directory with no node_modules. Turbopack tolerates it;
// webpack fails outright with "Can't resolve 'tailwindcss'".
const appDir = fileURLToPath(new URL(".", import.meta.url));

const nextConfig: NextConfig = {
  turbopack: {
    root: appDir,
  },
  // `content/` lives inside the project root, but the tracer still cannot see
  // it: load.ts reads the directory at runtime from a path computed off
  // process.cwd(), and @vercel/nft only includes what it can find statically.
  // Without this a traced deploy (Vercel, `output: "standalone"`) fails at
  // runtime with "content directory not found", because the maintenance
  // banner's fetch puts every route on ISR and pages re-read the filesystem
  // after revalidation.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
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
