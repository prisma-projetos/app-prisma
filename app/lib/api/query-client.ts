import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "./client";

const MAX_TENTATIVAS_EXTRAS = 2;

export function deveRepetir(falhas: number, erro: unknown): boolean {
  if (erro instanceof ApiError && erro.status >= 400 && erro.status < 500) {
    return false;
  }
  return falhas < MAX_TENTATIVAS_EXTRAS;
}

export function criarQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60_000,
        retry: deveRepetir,
        refetchOnWindowFocus: false,
      },
    },
  });
}
