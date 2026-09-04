import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_PAGES_EXPORT === "true";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1", "172.19.0.1"],
  assetPrefix: isGithubPages ? "/crypto-cards" : undefined,
  basePath: isGithubPages ? "/crypto-cards" : undefined,
  images: {
    unoptimized: true,
  },
  output: isGithubPages ? "export" : undefined,
  trailingSlash: isGithubPages,
};

export default nextConfig;
