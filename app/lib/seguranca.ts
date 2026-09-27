// Cabeçalhos de segurança do site (spec 019), aplicados pelo next.config.ts.

interface Cabecalho {
  key: string;
  value: string;
}

export function cabecalhosDeSeguranca({
  producao,
  origemImagens,
}: {
  producao: boolean;
  origemImagens: string;
}): Cabecalho[] {
  const csp = [
    "default-src 'self'",
    // 'unsafe-inline': o script de tema no <head> e os scripts inline do Next.
    // 'unsafe-eval' só em desenvolvimento, onde o Next precisa dele.
    `script-src 'self' 'unsafe-inline'${producao ? "" : " 'unsafe-eval'"}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: ${origemImagens}`,
    "font-src 'self'",
    "connect-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: csp },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    // Em desenvolvimento o acesso pela rede local é HTTP: HSTS só em produção.
    ...(producao
      ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
      : []),
  ];
}
