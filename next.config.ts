import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // A stray lockfile above this directory makes Next guess the wrong root.
  turbopack: { root: __dirname },
  outputFileTracingRoot: __dirname,
  images: {
    loader: "custom",
    loaderFile: "./lib/sanity-loader.ts",
  },
  redirects() {
    return [
      {
        source: "/:path*",
        // x-forwarded-proto is absent in local dev, so this never fires there.
        has: [
          { type: "header", key: "x-forwarded-proto", value: "http" },
          { type: "host", value: "(?<host>.*)" },
        ],
        destination: "https://:host/:path*",
        permanent: true,
      },
    ];
  },
  headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
