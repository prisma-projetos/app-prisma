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

export interface Politico {
  slug: string;
  nome: string;
  cargo: string;
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
