import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Ensure Turbopack resolves the project root correctly when multiple
  // package/lockfiles exist in the workspace (prevents resolving deps
  // from the workspace root instead of this `frontend` folder).
  turbopack: {
    root: path.resolve(__dirname),
  },
  compress: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["10.77.116.88"],
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
