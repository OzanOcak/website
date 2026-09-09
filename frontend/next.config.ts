import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
    ],
  },
  experimental: {
    staleTimes: {
      dynamic: 6000,
    },
  },
};

export default nextConfig;
