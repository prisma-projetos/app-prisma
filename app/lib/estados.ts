/** As 27 unidades da federação, em ordem alfabética do nome (spec 023). */
export const ESTADOS = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
] as const;

/** Cargos disputados por estado, na ordem do TSE (sem Presidente e Vice, que são nacionais). */
export const CARGOS_ESTADUAIS = [
  "GOVERNADOR",
  "VICE-GOVERNADOR",
  "SENADOR",
  "1º SUPLENTE",
  "2º SUPLENTE",
  "DEPUTADO FEDERAL",
  "DEPUTADO ESTADUAL",
  "DEPUTADO DISTRITAL",
] as const;

/** UF válida da URL (ignorando caixa), ou "". */
export function lerUf(valor: string | null): string {
  if (!valor) return "";
  const alvo = valor.toUpperCase();
  return ESTADOS.some((e) => e.uf === alvo) ? alvo : "";
}

export function nomeDoEstado(uf: string): string {
  return ESTADOS.find((e) => e.uf === uf)?.nome ?? uf;
}

/**
 * O filtro por UF só funciona depois que a api-prisma aceitar `uf` (spec 023).
 * Até lá, a página /estados e o filtro "Estado" ficam desligados.
 */
export function filtroUfAtivo(): boolean {
  return process.env.NEXT_PUBLIC_FILTRO_UF === "1";
}
