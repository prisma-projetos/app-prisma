import { ApiError } from "@/app/lib/api/client";

/** "13" → 13; qualquer coisa que não seja inteiro positivo → null. */
export function lerNrPartido(valor: string): number | null {
  return /^[1-9]\d*$/.test(valor) ? Number(valor) : null;
}

/** Título eleitoral: só dígitos, mantido como string (zeros à esquerda). */
export function lerTituloEleitoral(valor: string): string | null {
  return /^\d+$/.test(valor) ? valor : null;
}

/** Página da URL: inteiro ≥ 0; qualquer outra coisa vira 0. */
export function lerPagina(valor: string | null): number {
  return valor && /^\d+$/.test(valor) ? Number(valor) : 0;
}

export function naoEncontrado(erro: unknown): boolean {
  return erro instanceof ApiError && erro.status === 404;
}
