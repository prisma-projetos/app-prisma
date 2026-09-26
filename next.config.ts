import type { NextConfig } from "next";
import { cabecalhosDeSeguranca } from "./app/lib/seguranca";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // Só em desenvolvimento: libera outros aparelhos da rede (ex.: DEV_ORIGINS=192.168.0.10).
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(",").map((origem) => origem.trim()),
  async headers() {
    return [
      {
        source: "/:path*",
        headers: cabecalhosDeSeguranca({
          producao: process.env.NODE_ENV === "production",
          // MinIO onde ficam as logos dos partidos e as fotos dos candidatos.
          origemImagens: process.env.IMAGENS_ORIGEM ?? "https://api-minio.ajvale.com.br",
        }),
      },
    ];
  },
};

export default nextConfig;
