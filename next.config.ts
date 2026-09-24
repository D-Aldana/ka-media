import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile above this directory makes Next guess the wrong root.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  images: {
    loader: "custom",
    loaderFile: "./lib/sanity-loader.ts",
  },
};

export default nextConfig;
