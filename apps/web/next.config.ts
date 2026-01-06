import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@tandem/api"],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/api/:path*",
      }
    ]
  }
};

export default nextConfig;
