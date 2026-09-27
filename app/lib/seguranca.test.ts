// @vitest-environment node
import { describe, expect, it } from "vitest";
import nextConfig from "@/next.config";
import { cabecalhosDeSeguranca } from "./seguranca";

function mapa(producao: boolean) {
  return Object.fromEntries(
    cabecalhosDeSeguranca({ producao, origemImagens: "https://imagens.test" }).map((c) => [c.key, c.value])
  );
}

describe("cabeçalhos de segurança (spec 019)", () => {
  it("CSP permite as imagens configuradas e proíbe frames", () => {
    const csp = mapa(true)["Content-Security-Policy"];
    for (const diretiva of [
      "default-src 'self'",
      "img-src 'self' data: https://imagens.test",
      "connect-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ]) {
      expect(csp).toContain(diretiva);
    }
    expect(csp).not.toContain("unsafe-eval");
    expect(mapa(false)["Content-Security-Policy"]).toContain("'unsafe-eval'");
  });

  it("envia os cabeçalhos de proteção", () => {
    const c = mapa(true);
    expect(c["X-Content-Type-Options"]).toBe("nosniff");
    expect(c["X-Frame-Options"]).toBe("DENY");
    expect(c["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(c["Permissions-Policy"]).toBe("camera=(), microphone=(), geolocation=()");
  });

  it("HSTS só em produção", () => {
    expect(mapa(true)["Strict-Transport-Security"]).toBe("max-age=31536000; includeSubDomains");
    expect(mapa(false)["Strict-Transport-Security"]).toBeUndefined();
  });

  it("next.config aplica os cabeçalhos em todas as rotas e esconde X-Powered-By", async () => {
    expect(nextConfig.poweredByHeader).toBe(false);
    const regras = await nextConfig.headers!();
    expect(regras[0].source).toBe("/:path*");
    expect(regras[0].headers.map((h) => h.key)).toContain("Content-Security-Policy");
  });
});
