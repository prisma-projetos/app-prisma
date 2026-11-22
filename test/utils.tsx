import { QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { vi } from "vitest";
import { criarQueryClient } from "@/app/lib/api/query-client";

type Rota = (params: URLSearchParams) => Response | Promise<Response>;

/**
 * Mocka o fetch do navegador respondendo por caminho do proxy
 * (ex.: "partidos/detalhe"). Caminho sem rota → 500.
 */
export function mockApi(rotas: Record<string, Rota | unknown>) {
  const fetchMock = vi.fn(async (entrada: string) => {
    const url = new URL(entrada, "http://localhost");
    const caminho = url.pathname.replace(/^\/api\/prisma\//, "");
    const rota = rotas[caminho];
    if (rota === undefined) return Response.json({ erro: "sem rota" }, { status: 500 });
    if (typeof rota === "function") return (rota as Rota)(url.searchParams);
    return Response.json(rota);
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

export function erroApi(status: number) {
  return () => Response.json({ erro: "falhou" }, { status });
}

export function renderComQuery(ui: ReactElement) {
  const client = criarQueryClient();
  client.setDefaultOptions({
    queries: { ...client.getDefaultOptions().queries, retry: false },
  });
  // wrapper (e não o provider no ui) para o rerender manter o mesmo QueryClient
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    ),
  });
}

/** Chamadas feitas ao proxy para um caminho, como URLSearchParams. */
export function chamadasPara(fetchMock: ReturnType<typeof mockApi>, caminho: string) {
  return fetchMock.mock.calls
    .map(([entrada]) => new URL(String(entrada), "http://localhost"))
    .filter((url) => url.pathname === `/api/prisma/${caminho}`)
    .map((url) => url.searchParams);
}
