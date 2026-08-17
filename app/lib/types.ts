export type TrechoTipo = "fato" | "opiniao_autor" | "inferencia_modelo";

export interface Trecho {
  tipo: TrechoTipo;
  texto: string;
  fonteUrl: string;
  fonteTitulo: string;
}

export interface TrechoInformativo {
  texto: string;
  fonteUrl: string;
  fonteTitulo: string;
}

export interface Sintese {
  sobre: TrechoInformativo[];
  elogios: Trecho[];
  criticas: Trecho[];
}

export type CargoCategoria =
  | "deputado_federal"
  | "deputado_estadual"
  | "senador_primeira_vaga"
  | "senador_segunda_vaga"
  | "governador_vice_governador"
  | "presidente_vice_presidente";

export const CARGO_LABELS: Record<CargoCategoria, string> = {
  deputado_federal: "Deputado federal",
  deputado_estadual: "Deputado estadual",
  senador_primeira_vaga: "Senador (primeira vaga)",
  senador_segunda_vaga: "Senador (segunda vaga)",
  governador_vice_governador: "Governador e vice-governador",
  presidente_vice_presidente: "Presidente e vice-presidente da República",
};

export interface Politico {
  slug: string;
  nome: string;
  cargo: CargoCategoria;
  viceNome?: string;
  imagemUrl?: string;
  sintese: Sintese;
}

export interface Partido {
  slug: string;
  nome: string;
  sigla: string;
  logoUrl: string;
  sintese: Sintese;
  politicos: Politico[];
}
