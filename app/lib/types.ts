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
  | "presidente"
  | "vice_presidente";

export const CARGO_LABELS: Record<CargoCategoria, string> = {
  deputado_federal: "Deputado federal",
  deputado_estadual: "Deputado estadual",
  senador_primeira_vaga: "Senador (primeira vaga)",
  senador_segunda_vaga: "Senador (segunda vaga)",
  governador_vice_governador: "Governador e vice-governador",
  presidente: "Presidente da República",
  vice_presidente: "Vice-presidente da República",
};

export interface ReferenciaPolitico {
  partidoSlug: string;
  politicoSlug: string;
}

export interface Politico {
  slug: string;
  nome: string;
  cargo: CargoCategoria;
  viceNome?: string;
  viceRef?: ReferenciaPolitico;
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

export const CARGO_GRUPOS: { chave: string; titulo: string; cargos: CargoCategoria[] }[] = [
  { chave: "deputado_federal", titulo: "Deputado federal", cargos: ["deputado_federal"] },
  { chave: "deputado_estadual", titulo: "Deputado estadual", cargos: ["deputado_estadual"] },
  {
    chave: "senador_primeira_vaga",
    titulo: "Senador (primeira vaga)",
    cargos: ["senador_primeira_vaga"],
  },
  {
    chave: "senador_segunda_vaga",
    titulo: "Senador (segunda vaga)",
    cargos: ["senador_segunda_vaga"],
  },
  {
    chave: "governador_vice_governador",
    titulo: "Governador e vice-governador",
    cargos: ["governador_vice_governador"],
  },
  {
    chave: "presidencia",
    titulo: "Presidente e vice-presidente da República",
    cargos: ["presidente", "vice_presidente"],
  },
];
