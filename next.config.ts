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
  // Dynamic article and project routes can render slugs that were not
  // prerendered. Include the content tree for those traced server functions.
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.darkocejkov.ca",
        pathname: "/art/**",
      },
      {
        protocol: "https",
        hostname: "assets.darkocejkov.ca",
        pathname: "/assets/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/links", destination: "/bookmarks", permanent: true },
      { source: "/blog/:path*", destination: "/brain/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
