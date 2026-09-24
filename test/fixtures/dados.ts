import type {
  PanoramaResponse,
  PartidoResponse,
  PoliticoDetalheResponse,
  SentimentoResumoResponse,
} from "@/app/lib/api/types";

export const partidoPT: PartidoResponse = {
  numero: 13,
  sigla: "PT",
  nome: "PARTIDO DOS TRABALHADORES",
  descricao: undefined,
  urlLogo: "https://minio.test/PT.svg",
};

export const partidos: PartidoResponse[] = [
  { numero: 70, sigla: "AVANTE", nome: "AVANTE", urlLogo: "https://minio.test/AVANTE.svg" },
  partidoPT,
  { numero: 36, sigla: "AGIR", nome: "AGIR", urlLogo: "https://minio.test/AGIR.svg" },
];

export const sentimentoPT: SentimentoResumoResponse = {
  tipoEntidade: "partido",
  identificador: "13",
  nome: "PT",
  totalParagrafos: 15887,
  // Ordem da API propositalmente diferente da ordem de exibição.
  porSentimento: [
    { sentimento: "neutro", total: 13432, percentual: 84.55, scoreMedio: 0 },
    { sentimento: "positivo", total: 1524, percentual: 9.59, scoreMedio: 0.98 },
    { sentimento: "negativo", total: 931, percentual: 5.86, scoreMedio: 0.97 },
  ],
  proveniencia: [{ metodo: "lexicon-baseline-v1", pipelineVersion: "v1", total: 15887 }],
};

export const sentimentoVazio: SentimentoResumoResponse = {
  tipoEntidade: "partido",
  identificador: "36",
  nome: "AGIR",
  totalParagrafos: 0,
  porSentimento: [],
  proveniencia: [],
};

const fonteG1 = {
  itemId: "art_1",
  veiculo: "G1",
  url: "https://g1.globo.com/materia-1",
  dataPublicacao: "2026-09-02T02:34:15Z",
};
const fonteSemVeiculo = {
  itemId: "art_2",
  veiculo: undefined,
  url: "https://www.cartacapital.com.br/materia-2",
  dataPublicacao: "2026-09-01T13:26:00Z",
};

export const panoramaPT: PanoramaResponse = {
  tipo: "partido",
  identificador: "13",
  nome: "PT",
  janela: "2026-09",
  eixos: [
    {
      eixo: "positivo",
      versao: 1,
      totalItens: 27,
      texto: "Texto do panorama positivo.",
      temas: [],
      fontes: [fonteG1],
      avisos: [],
      modelo: "qwen2.5:3b",
    },
    {
      eixo: "neutro",
      versao: 1,
      totalItens: 151,
      texto: "Texto do panorama neutro.",
      temas: [{ tema: "Lula", ocorrencias: 34, fontes: [fonteG1] }],
      fontes: [fonteG1, fonteSemVeiculo],
      avisos: ["tema 'Lula' declarou 12 ocorrências e lista 34 fontes distintas"],
      modelo: "qwen2.5:3b",
    },
    {
      eixo: "negativo",
      versao: 1,
      totalItens: 3,
      texto: "Texto negativo sem fonte.",
      temas: [],
      fontes: [],
      avisos: [],
      modelo: "qwen2.5:3b",
    },
  ],
};

export const panoramaVazio: PanoramaResponse = {
  tipo: "partido",
  identificador: "36",
  nome: "AGIR",
  janela: undefined,
  eixos: [],
};

export const politicoDetalhe: PoliticoDetalheResponse = {
  politico: {
    tituloEleitoral: "016828001937",
    nome: "AARON SALLES FERNANDES SILVA TORRES",
    nomeSocial: undefined,
  },
  candidaturas: [
    { sequencial: 1, anoEleicao: 2022, turno: 1, cargo: "DEPUTADO FEDERAL", uf: "SP", nrPartido: 40, siglaPartido: "PSB", numeroUrna: 4000, resultado: "NÃO ELEITO", urlFoto: "https://minio.test/2022.jpg" },
    { sequencial: 2, anoEleicao: 2026, turno: 1, cargo: "DEPUTADO ESTADUAL", uf: "MS", nrPartido: 13, siglaPartido: "PT", numeroUrna: 13031, resultado: undefined, urlFoto: "https://minio.test/2026-t1.jpg" },
    { sequencial: 3, anoEleicao: 2026, turno: 2, cargo: "GOVERNADOR", uf: "MS", nrPartido: 13, siglaPartido: "PT", numeroUrna: 13, resultado: undefined, urlFoto: "https://minio.test/2026-t2.jpg" },
  ],
};

export function paginaDeCandidatos(pagina: number, totalPages: number, quantidade = 2) {
  return {
    content: Array.from({ length: quantidade }, (_, i) => ({
      tituloEleitoral: `00${pagina}${i}`,
      nome: `CANDIDATO ${pagina}-${i}`,
      urlFoto: `https://minio.test/${pagina}-${i}.jpg`,
    })),
    number: pagina,
    totalPages,
    totalElements: totalPages * quantidade,
    first: pagina === 0,
    last: pagina >= totalPages - 1,
    empty: quantidade === 0,
  };
}
