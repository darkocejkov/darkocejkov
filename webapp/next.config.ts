import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      { source: "/about", destination: "/", permanent: true },
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
