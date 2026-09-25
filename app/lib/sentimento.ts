import type { Sentimento } from "@/app/lib/api/types";

/** Ordem fixa (alfabética) de exibição dos sentimentos. Nunca é um ranking. */
export const SENTIMENTOS: readonly Sentimento[] = ["negativo", "neutro", "positivo"];

export const SENTIMENTO_LABEL: Record<Sentimento, string> = {
  negativo: "Negativo",
  neutro: "Neutro",
  positivo: "Positivo",
};

// Tons da mesma família (ardósia), sem verde/vermelho: a cor não carrega juízo.
export const SENTIMENTO_COR: Record<Sentimento, string> = {
  negativo: "bg-slate-900 dark:bg-slate-100",
  neutro: "bg-slate-600 dark:bg-slate-400",
  positivo: "bg-slate-400 dark:bg-slate-600",
};
