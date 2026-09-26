import { janelaPorExtenso } from "./formatacao";

/** Quantos meses o seletor oferece (a API não diz quais meses têm dados). */
const MESES_OFERECIDOS = 12;

/** "AAAA-MM" do mês atual no fuso de Brasília. */
function mesAtual(agora: Date): { ano: number; mes: number } {
  const [ano, mes] = agora
    .toLocaleDateString("en-CA", { timeZone: "America/Sao_Paulo" })
    .split("-")
    .map(Number);
  return { ano, mes };
}

function formatar(ano: number, mes: number): string {
  return `${ano}-${String(mes).padStart(2, "0")}`;
}

/** Os 12 últimos meses até o atual, do mais recente para o mais antigo. */
export function mesesDisponiveis(agora: Date = new Date()): string[] {
  const { ano, mes } = mesAtual(agora);
  return Array.from({ length: MESES_OFERECIDOS }, (_, i) => {
    const indice = ano * 12 + (mes - 1) - i;
    return formatar(Math.floor(indice / 12), (indice % 12) + 1);
  });
}

/**
 * Janela válida da URL, ou "" (todo o período). Aceita qualquer mês até o
 * atual (meses[0]), inclusive fora da lista: um link compartilhado com um mês
 * antigo continua mostrando aquele mês (spec 018, emenda).
 */
export function lerJanela(valor: string | null, meses: readonly string[]): string {
  if (!valor || !/^\d{4}-(0[1-9]|1[0-2])$/.test(valor)) return "";
  return meses.length > 0 && valor <= meses[0] ? valor : "";
}

/** "2026-02" → { de: "2026-02-01", ate: "2026-02-28" }. */
export function intervaloDaJanela(janela: string): { de: string; ate: string } {
  const [ano, mes] = janela.split("-").map(Number);
  // Dia 0 do mês seguinte é o último dia deste mês.
  const ultimoDia = new Date(Date.UTC(ano, mes, 0)).getUTCDate();
  return { de: `${janela}-01`, ate: `${janela}-${String(ultimoDia).padStart(2, "0")}` };
}

/** "" → "em todo o período"; "2026-08" → "em agosto de 2026". */
export function periodoPorExtenso(janela: string): string {
  return janela ? `em ${janelaPorExtenso(janela)}` : "em todo o período";
}
