import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://apis.google.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://lh3.googleusercontent.com https://github.com",
  "font-src 'self' data:",
  "connect-src 'self' https://api.oocak.com https://accounts.google.com https://oauth2.googleapis.com https://www.googleapis.com",
  "frame-src https://accounts.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://accounts.google.com",
  "frame-ancestors 'self'",
].join("; ");

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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy-Report-Only",
            value: csp,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
