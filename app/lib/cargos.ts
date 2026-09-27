import { nomeProprio } from "./formatacao";

/**
 * Cargos das candidaturas, com o valor exato usado pela API (filtro `cargo`).
 * Lista fixa: a API não expõe um endpoint de cargos. Ordem do TSE, da esfera
 * federal para a estadual; não é um ranking.
 */
export const CARGOS = [
  { valor: "PRESIDENTE", rotulo: "Presidente" },
  { valor: "VICE-PRESIDENTE", rotulo: "Vice-presidente" },
  { valor: "GOVERNADOR", rotulo: "Governador" },
  { valor: "VICE-GOVERNADOR", rotulo: "Vice-governador" },
  { valor: "SENADOR", rotulo: "Senador" },
  { valor: "1º SUPLENTE", rotulo: "1º suplente" },
  { valor: "2º SUPLENTE", rotulo: "2º suplente" },
  { valor: "DEPUTADO FEDERAL", rotulo: "Deputado federal" },
  { valor: "DEPUTADO ESTADUAL", rotulo: "Deputado estadual" },
  { valor: "DEPUTADO DISTRITAL", rotulo: "Deputado distrital" },
] as const;

/** Valor da API correspondente (ignorando caixa), ou "" se não for um cargo conhecido. */
export function lerCargo(valor: string | null): string {
  if (!valor) return "";
  const alvo = valor.toLocaleUpperCase("pt-BR");
  return CARGOS.find((c) => c.valor === alvo)?.valor ?? "";
}

/** Rótulo em caixa normal de um cargo vindo da API; fora da lista, formata o texto. */
export function rotuloDoCargo(cargo?: string | null): string | undefined {
  if (!cargo) return undefined;
  return CARGOS.find((c) => c.valor === cargo.toLocaleUpperCase("pt-BR"))?.rotulo ?? nomeProprio(cargo);
}
