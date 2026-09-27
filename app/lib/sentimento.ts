import type { Sentimento } from "@/app/lib/api/types";

/** Ordem fixa (alfabética) de exibição dos sentimentos. Nunca é um ranking. */
export const SENTIMENTOS: readonly Sentimento[] = ["negativo", "neutro", "positivo"];

export const SENTIMENTO_LABEL: Record<Sentimento, string> = {
  negativo: "Negativo",
  neutro: "Neutro",
  positivo: "Positivo",
};

// Cinzas neutros; o nome do sentimento acompanha a cor.
// Cinza + retícula (spec 025): cada sentimento se distingue pela textura, não só
// pelo tom. Nenhuma cor nem textura carrega juízo.
export const SENTIMENTO_COR: Record<Sentimento, string> = {
  negativo: "bg-sent-negativo reticula-negativo",
  neutro: "bg-sent-neutro reticula-neutro",
  positivo: "bg-sent-positivo reticula-positivo",
};
