import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"], // Add the domain here
  },
  /* config options here */
  experimental: {
    staleTimes: {
      dynamic: 6000, // 100 min
    },
  },
};

export default nextConfig;
