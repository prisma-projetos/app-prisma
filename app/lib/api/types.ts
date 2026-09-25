// Tipos espelhando os schemas do OpenAPI "API Prisma" v1.
// O OpenAPI não declara campos obrigatórios, então todos são opcionais.

export type Sentimento = "positivo" | "neutro" | "negativo";

export interface SortObject {
  empty?: boolean;
  unsorted?: boolean;
  sorted?: boolean;
}

export interface PageableObject {
  offset?: number;
  paged?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sort?: SortObject;
  unpaged?: boolean;
}

export interface Page<T> {
  totalPages?: number;
  totalElements?: number;
  size?: number;
  content?: T[];
  number?: number;
  sort?: SortObject;
  pageable?: PageableObject;
  numberOfElements?: number;
  first?: boolean;
  last?: boolean;
  empty?: boolean;
}

export interface ConsultaRequest {
  tituloEleitoral?: string;
  nrPartido?: number;
  sentimento?: Sentimento;
  tema?: string;
  janela?: string;
  de?: string;
  ate?: string;
  pagina?: number;
  tamanho?: number;
}

export interface PoliticoResponse {
  tituloEleitoral?: string;
  nome?: string;
  nomeSocial?: string;
  dataNascimento?: string;
  ufNascimento?: string;
  genero?: string;
  grauInstrucao?: string;
  corRaca?: string;
  ocupacao?: string;
  descricao?: string;
}

export interface CandidatoResumoResponse {
  tituloEleitoral?: string;
  nome?: string;
  cargo?: string;
  urlFoto?: string;
}

export interface CandidaturaResponse {
  sequencial?: number;
  anoEleicao?: number;
  turno?: number;
  cargo?: string;
  uf?: string;
  unidadeEleitoral?: string;
  numeroUrna?: number;
  nomeUrna?: string;
  nrPartido?: number;
  siglaPartido?: string;
  situacaoCandidatura?: string;
  resultado?: string;
  coligacao?: string;
  federacao?: string;
  urlFoto?: string;
}

export interface PoliticoDetalheResponse {
  politico?: PoliticoResponse;
  candidaturas?: CandidaturaResponse[];
}

export interface PartidoResponse {
  numero?: number;
  sigla?: string;
  nome?: string;
  descricao?: string;
  urlLogo?: string;
}

export interface ContagemSentimento {
  sentimento?: string;
  total?: number;
  percentual?: number;
  scoreMedio?: number;
}

export interface Proveniencia {
  metodo?: string;
  pipelineVersion?: string;
  total?: number;
}

export interface SentimentoResumoResponse {
  tipoEntidade?: string;
  identificador?: string;
  nome?: string;
  periodoInicio?: string;
  periodoFim?: string;
  totalParagrafos?: number;
  porSentimento?: ContagemSentimento[];
  proveniencia?: Proveniencia[];
}

export interface TemaContagem {
  tema?: string;
  total?: number;
  percentual?: number;
}

export interface ProvenienciaAnalise {
  modelo?: string;
  regraAgregacao?: string;
  total?: number;
}

export interface AnalisePorTemaResponse {
  tipo?: string;
  identificador?: string;
  nome?: string;
  totalMaterias?: number;
  semTema?: number;
  temas?: TemaContagem[];
  proveniencia?: ProvenienciaAnalise[];
}

export interface MidiaSentimento {
  idMidia?: number;
  nomeMidia?: string;
  total?: number;
  percentualDoTotal?: number;
  positivo?: number;
  neutro?: number;
  negativo?: number;
}

export interface SentimentoPorMidiaResponse {
  tipoEntidade?: string;
  identificador?: string;
  nome?: string;
  veiculosDistintos?: number;
  totalParagrafos?: number;
  paragrafosSemVeiculo?: number;
  midias?: MidiaSentimento[];
}

export interface Fonte {
  itemId?: string;
  veiculo?: string;
  url?: string;
  dataPublicacao?: string;
}

export interface TemaPanorama {
  tema?: string;
  ocorrencias?: number;
  fontes?: Fonte[];
}

export interface PanoramaEixo {
  eixo?: string;
  versao?: number;
  totalItens?: number;
  texto?: string;
  temas?: TemaPanorama[];
  fontes?: Fonte[];
  avisos?: string[];
  modelo?: string;
  criadoEm?: string;
}

export interface PanoramaResponse {
  tipo?: string;
  identificador?: string;
  nome?: string;
  janela?: string;
  eixos?: PanoramaEixo[];
}

export interface MencaoResponse {
  idClassificacao?: number;
  paragrafo?: string;
  linkNoticia?: string;
  idMidia?: number;
  nomeMidia?: string;
  dataPublicacao?: string;
  sentimento?: string;
  scoreConfianca?: number;
  metodo?: string;
  pipelineVersion?: string;
  idArtigoScrape?: number;
}

export interface AnaliseMateriaResponse {
  itemId?: string;
  articleId?: number;
  rotulo?: string;
  resumo?: string;
  temas?: string[];
  linkNoticia?: string;
  idMidia?: number;
  nomeMidia?: string;
  dataPublicacao?: string;
  janela?: string;
  modelo?: string;
  regraAgregacao?: string;
  status?: string;
}
