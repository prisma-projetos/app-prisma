import type { ConsultaRequest } from "./types";

export interface FiltroPoliticos {
  q?: string;
  nrPartido?: number;
  anoEleicao?: number;
  cargo?: string;
  pagina?: number;
  tamanho?: number;
}

export interface FiltroPartidos {
  q?: string;
}

export const prismaKeys = {
  all: ["prisma"] as const,
  politicos: {
    all: () => [...prismaKeys.all, "politicos"] as const,
    lista: (filtro: FiltroPoliticos) =>
      [...prismaKeys.politicos.all(), "lista", filtro] as const,
    detalhe: (tituloEleitoral: string | undefined) =>
      [...prismaKeys.politicos.all(), "detalhe", tituloEleitoral] as const,
  },
  partidos: {
    all: () => [...prismaKeys.all, "partidos"] as const,
    lista: (filtro: FiltroPartidos) =>
      [...prismaKeys.partidos.all(), "lista", filtro] as const,
    detalhe: (nrPartido: number | undefined) =>
      [...prismaKeys.partidos.all(), "detalhe", nrPartido] as const,
  },
  analise: {
    all: () => [...prismaKeys.all, "analise"] as const,
    sentimento: (consulta: ConsultaRequest) =>
      [...prismaKeys.analise.all(), "sentimento", consulta] as const,
    porTema: (consulta: ConsultaRequest) =>
      [...prismaKeys.analise.all(), "por-tema", consulta] as const,
    porMidia: (consulta: ConsultaRequest) =>
      [...prismaKeys.analise.all(), "por-midia", consulta] as const,
    panorama: (consulta: ConsultaRequest) =>
      [...prismaKeys.analise.all(), "panorama", consulta] as const,
    mencoes: (consulta: ConsultaRequest) =>
      [...prismaKeys.analise.all(), "mencoes", consulta] as const,
    materias: (consulta: ConsultaRequest) =>
      [...prismaKeys.analise.all(), "materias", consulta] as const,
  },
};
