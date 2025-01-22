import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "tokxv8ehtdjc1lpj.public.blob.vercel-storage.com",
      },
    ],
    localPatterns: [
      {
        pathname: "/assets/**",
        search: "",
      },
    ],
  },
};

export default nextConfig;
