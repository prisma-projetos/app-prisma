import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Só em desenvolvimento: libera outros aparelhos da rede (ex.: DEV_ORIGINS=192.168.0.10).
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(",").map((origem) => origem.trim()),
};

export default nextConfig;
