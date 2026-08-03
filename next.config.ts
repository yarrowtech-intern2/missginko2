import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        // Temporary stand-in imagery until real Cloudinary photography is
        // supplied — safe to remove once every PlaceholderMedia `src` below
        // has been swapped over.
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
