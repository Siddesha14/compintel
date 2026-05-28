import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pg", "@prisma/adapter-pg", "@prisma/client", "@neondatabase/serverless"],
  experimental: {
    turbo: {
      resolveExtensions: [".ts", ".tsx", ".js", ".jsx"],
    },
  },
};

export default nextConfig;
