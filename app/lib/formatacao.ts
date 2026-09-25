import type { CandidaturaResponse } from "@/app/lib/api/types";

const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];

/** "2026-09" → "setembro de 2026". Devolve a entrada se não for uma janela válida. */
export function janelaPorExtenso(janela: string): string {
  const match = /^(\d{4})-(\d{2})$/.exec(janela);
  const mes = match ? MESES[Number(match[2]) - 1] : undefined;
  return match && mes ? `${mes} de ${match[1]}` : janela;
}

/** Data ISO → "dd/mm/aaaa", no fuso de Brasília. */
export function dataCurta(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const data = new Date(iso);
  if (Number.isNaN(data.getTime())) return undefined;
  return data.toLocaleDateString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

/** "https://www.g1.globo.com/x" → "g1.globo.com". */
export function dominio(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export function formatarPercentual(valor: number | undefined): string {
  return `${(valor ?? 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  })}%`;
}

export function formatarNumero(valor: number | undefined): string {
  return (valor ?? 0).toLocaleString("pt-BR");
}

/** Ano decrescente, depois turno decrescente. */
export function ordenarCandidaturas(
  candidaturas: CandidaturaResponse[] = []
): CandidaturaResponse[] {
  return [...candidaturas].sort(
    (a, b) =>
      (b.anoEleicao ?? 0) - (a.anoEleicao ?? 0) || (b.turno ?? 0) - (a.turno ?? 0)
  );
}

/** Maior anoEleicao, desempatado pelo maior turno. */
export function candidaturaMaisRecente(
  candidaturas: CandidaturaResponse[] = []
): CandidaturaResponse | undefined {
  return ordenarCandidaturas(candidaturas)[0];
}
