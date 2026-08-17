import type { Partido, Politico } from "./types";

function logoPlaceholder(sigla: string, cor: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="16" fill="${cor}"/><text x="48" y="56" font-family="sans-serif" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">${sigla}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const TSE_PARTIDOS_URL = "https://www.tse.jus.br/partidos/partidos-registrados-no-tse";
const TSE_PARTIDOS_TITULO = "Partidos políticos registrados no TSE";

function partidoSemPoliticos(input: {
  slug: string;
  nome: string;
  sigla: string;
  cor: string;
  logoUrl?: string;
  sobre: string;
  fonteUrl?: string;
  fonteTitulo?: string;
}): Partido {
  return {
    slug: input.slug,
    nome: input.nome,
    sigla: input.sigla,
    logoUrl: input.logoUrl ?? logoPlaceholder(input.sigla, input.cor),
    sintese: {
      sobre: [
        {
          texto: input.sobre,
          fonteUrl: input.fonteUrl ?? TSE_PARTIDOS_URL,
          fonteTitulo: input.fonteTitulo ?? TSE_PARTIDOS_TITULO,
        },
      ],
      elogios: [],
      criticas: [],
    },
    politicos: [],
  };
}

const partidos: Partido[] = [
  partidoSemPoliticos({
    slug: "agir",
    nome: "Agir",
    sigla: "AGIR",
    cor: "#0f766e",
    sobre:
      "Agir é a nova denominação do antigo PTC (Partido Trabalhista Cristão), com registro definitivo no TSE.",
  }),
  partidoSemPoliticos({
    slug: "avante",
    nome: "Avante",
    sigla: "AVANTE",
    cor: "#f97316",
    sobre:
      "Avante é a nova denominação do antigo PTdoB (Partido Trabalhista do Brasil), de orientação de centro.",
  }),
  partidoSemPoliticos({
    slug: "cidadania",
    nome: "Cidadania",
    sigla: "CIDADANIA",
    cor: "#0891b2",
    sobre:
      "Cidadania é a nova denominação do antigo PPS (Partido Popular Socialista), de orientação de centro.",
  }),
  partidoSemPoliticos({
    slug: "democracia-crista",
    nome: "Democracia Cristã",
    sigla: "DC",
    cor: "#1d4ed8",
    sobre:
      "Fundada em 1995 como PSDC (Partido Social Democrata Cristão), a legenda foi definitivamente registrada em 1997 e passou a se chamar Democracia Cristã em 2018, com reconhecimento do TSE. Tem orientação democrata-cristã.",
  }),
  partidoSemPoliticos({
    slug: "democrata",
    nome: "Democrata",
    sigla: "DEMOCRATA",
    cor: "#334155",
    sobre: "Partido com registro definitivo no TSE, habilitado a lançar candidaturas nas eleições de 2026.",
  }),
  partidoSemPoliticos({
    slug: "mdb",
    nome: "Movimento Democrático Brasileiro",
    sigla: "MDB",
    cor: "#166534",
    sobre:
      "O MDB tem origem no antigo MDB da ditadura militar (fundado em 1966 como oposição consentida) e é uma das legendas mais antigas em atividade no país, historicamente associada ao centro político.",
  }),
  partidoSemPoliticos({
    slug: "mobilizacao-nacional",
    nome: "Mobilização Nacional",
    sigla: "MOBILIZA",
    cor: "#7c2d12",
    sobre: "Partido com registro definitivo no TSE, habilitado a lançar candidaturas nas eleições de 2026.",
  }),
  partidoSemPoliticos({
    slug: "novo",
    nome: "Partido Novo",
    sigla: "NOVO",
    cor: "#f97316",
    sobre:
      "Fundado em 2011 e com registro definitivo obtido em 2015, o Novo se define como um partido liberal, defensor da redução do tamanho do Estado e da livre iniciativa, e não recebe fundo partidário nem tempo de propaganda partidária gratuita por opção estatutária.",
  }),
  partidoSemPoliticos({
    slug: "pcb",
    nome: "Partido Comunista Brasileiro",
    sigla: "PCB",
    cor: "#b91c1c",
    sobre:
      "O PCB reivindica a tradição do Partido Comunista Brasileiro fundado em 1922, refundado sob o registro atual em 1988, de orientação marxista-leninista.",
  }),
  partidoSemPoliticos({
    slug: "pcdob",
    nome: "Partido Comunista do Brasil",
    sigla: "PCdoB",
    cor: "#b91c1c",
    sobre:
      "Fundado em 1962 a partir de uma dissidência do PCB, o PCdoB é um partido de esquerda com histórico de atuação na resistência à ditadura militar.",
  }),
  partidoSemPoliticos({
    slug: "pco",
    nome: "Partido da Causa Operária",
    sigla: "PCO",
    cor: "#991b1b",
    sobre:
      "O PCO é um partido de esquerda, de orientação trotskista, com registro no TSE desde a década de 1990.",
  }),
  partidoSemPoliticos({
    slug: "pdt",
    nome: "Partido Democrático Trabalhista",
    sigla: "PDT",
    cor: "#b91c1c",
    logoUrl: "/images/nova_logo_PDT.png",
    sobre:
      "Fundado em 1980 por Leonel Brizola como herdeiro da tradição trabalhista brasileira, o PDT tem orientação de centro-esquerda.",
  }),
  partidoSemPoliticos({
    slug: "pl",
    nome: "Partido Liberal",
    sigla: "PL",
    cor: "#1e3a8a",
    sobre:
      "O PL atual resulta da fusão do antigo Partido Liberal com o PR (Partido da República) em 2006, mantendo a sigla histórica PL. É um partido de direita.",
  }),
  partidoSemPoliticos({
    slug: "podemos",
    nome: "Podemos",
    sigla: "PODE",
    cor: "#0369a1",
    sobre:
      "Podemos é a nova denominação do antigo PTN (Partido Trabalhista Nacional), com orientação liberal.",
  }),
  partidoSemPoliticos({
    slug: "pp",
    nome: "Progressistas",
    sigla: "PP",
    cor: "#1e40af",
    sobre:
      "Os Progressistas descendem de uma linhagem partidária que remonta à ARENA e ao PDS, tendo passado por PPB e PPR antes de adotar a denominação atual. É um partido de centro-direita.",
  }),
  partidoSemPoliticos({
    slug: "prd",
    nome: "Partido Renovação Democrática",
    sigla: "PRD",
    cor: "#78350f",
    sobre:
      "PRD é a nova denominação adotada pelo antigo PTB (Partido Trabalhista Brasileiro) a partir de 2024.",
  }),
  partidoSemPoliticos({
    slug: "prtb",
    nome: "Partido Renovador Trabalhista Brasileiro",
    sigla: "PRTB",
    cor: "#57534e",
    sobre: "O PRTB é um partido de direita com registro definitivo no TSE.",
  }),
  partidoSemPoliticos({
    slug: "psb",
    nome: "Partido Socialista Brasileiro",
    sigla: "PSB",
    cor: "#facc15",
    sobre:
      "Com origem histórica em 1947, o PSB foi refundado em 1985 após a redemocratização e tem orientação de centro-esquerda.",
  }),
  partidoSemPoliticos({
    slug: "psd",
    nome: "Partido Social Democrático",
    sigla: "PSD",
    cor: "#f59e0b",
    sobre:
      "Fundado em 2011 por Gilberto Kassab, o PSD (não confundir com a antiga sigla homônima pré-1965) é um partido de centro, com forte presença em prefeituras e governos estaduais.",
  }),
  partidoSemPoliticos({
    slug: "psdb",
    nome: "Partido da Social Democracia Brasileira",
    sigla: "PSDB",
    cor: "#0284c7",
    sobre:
      "Fundado em 1988 por dissidentes do MDB, o PSDB tem orientação social-democrata e centrista.",
  }),
  partidoSemPoliticos({
    slug: "psol",
    nome: "Partido Socialismo e Liberdade",
    sigla: "PSOL",
    cor: "#dc2626",
    sobre: "Fundado em 2004 por dissidentes do PT, o PSOL é um partido de esquerda.",
  }),
  partidoSemPoliticos({
    slug: "pstu",
    nome: "Partido Socialista dos Trabalhadores Unificado",
    sigla: "PSTU",
    cor: "#dc2626",
    sobre:
      "Fundado em 1994 a partir de uma dissidência do PT, o PSTU é um partido de esquerda, de orientação trotskista.",
  }),
  partidoSemPoliticos({
    slug: "pv",
    nome: "Partido Verde",
    sigla: "PV",
    cor: "#16a34a",
    sobre: "Fundado em 1986, o PV é o principal partido de orientação ambientalista do país.",
  }),
  partidoSemPoliticos({
    slug: "rede-sustentabilidade",
    nome: "Rede Sustentabilidade",
    sigla: "REDE",
    cor: "#15803d",
    sobre:
      "Fundada em 2015 por Marina Silva, a Rede Sustentabilidade tem foco em pautas ambientais e de sustentabilidade.",
  }),
  partidoSemPoliticos({
    slug: "republicanos",
    nome: "Republicanos",
    sigla: "REPUBLICANOS",
    cor: "#1e3a8a",
    sobre:
      "Republicanos é a nova denominação do antigo PRB (Partido Republicano Brasileiro), com forte vínculo histórico a lideranças evangélicas. É um partido de direita.",
  }),
  partidoSemPoliticos({
    slug: "solidariedade",
    nome: "Solidariedade",
    sigla: "SOLIDARIEDADE",
    cor: "#ea580c",
    sobre: "Fundado em 2013, o Solidariedade é um partido de centro.",
  }),
  partidoSemPoliticos({
    slug: "pt",
    nome: "Partido dos Trabalhadores",
    sigla: "PT",
    cor: "#dc2626",
    logoUrl: "/images/PT_logo.svg",
    sobre:
      "Fundado em 1980 por lideranças sindicais, intelectuais e movimentos sociais, o PT é um partido de esquerda que já elegeu quatro presidentes da República.",
  }),
  partidoSemPoliticos({
    slug: "missao",
    nome: "Missão",
    sigla: "MISSÃO",
    cor: "#1e293b",
    logoUrl: "/images/MISSÃO_logo.png",
    sobre:
      "Criado pelo Movimento Brasil Livre (MBL), o Missão teve estatuto e programa publicados em outubro de 2023 e obteve registro definitivo unânime do TSE em novembro de 2025, tornando-se o 30º partido habilitado a disputar eleições no país. É um partido de direita.",
    fonteUrl: "https://pt.wikipedia.org/wiki/Partido_Miss%C3%A3o",
    fonteTitulo: "Partido Missão – Wikipédia",
  }),
  partidoSemPoliticos({
    slug: "unidade-popular",
    nome: "Unidade Popular",
    sigla: "UP",
    cor: "#b91c1c",
    sobre: "Fundada em 2018 e com registro definitivo obtido em 2019, a UP é um partido de esquerda.",
  }),
  partidoSemPoliticos({
    slug: "uniao-brasil",
    nome: "União Brasil",
    sigla: "UNIÃO",
    cor: "#facc15",
    sobre:
      "Resultado da fusão entre o DEM e o PSL, homologada em 2021/2022, o União Brasil é um partido de centro-direita e uma das maiores bancadas do Congresso.",
  }),
];

const partidosPorSlug = new Map(partidos.map((p) => [p.slug, p]));

function adicionarPolitico(partidoSlug: string, politico: Politico): void {
  const partido = partidosPorSlug.get(partidoSlug);
  if (!partido) {
    throw new Error(`Partido não encontrado para slug: ${partidoSlug}`);
  }
  partido.politicos.push(politico);
}

// Políticos mockados (mantidos da spec 001), agora recategorizados e
// vinculados a partidos reais.
adicionarPolitico("pt", {
  slug: "helena-marques",
  nome: "Helena Marques",
  cargo: "deputado_federal",
  sintese: {
    sobre: [
      {
        texto:
          "Helena Marques está em seu terceiro mandato como deputada federal, com atuação concentrada nas comissões de Seguridade Social e Educação.",
        fonteUrl: "https://exemplo-noticias.test/helena-marques-perfil",
        fonteTitulo: "Perfil: Helena Marques",
      },
    ],
    elogios: [
      {
        tipo: "fato",
        texto:
          "Relatora de três leis de ampliação de creches públicas aprovadas entre 2022 e 2025.",
        fonteUrl: "https://exemplo-noticias.test/helena-marques-creches",
        fonteTitulo: "Leis de educação infantil aprovadas",
      },
      {
        tipo: "inferencia_modelo",
        texto:
          "A cobertura recorrente em temas de educação infantil indica forte associação da deputada a essa pauta.",
        fonteUrl: "https://exemplo-analise.test/helena-marques-pauta",
        fonteTitulo: "Análise de pauta legislativa",
      },
    ],
    criticas: [
      {
        tipo: "opiniao_autor",
        texto:
          "Para o articulista, a deputada evita se posicionar publicamente sobre reforma tributária.",
        fonteUrl: "https://exemplo-opiniao.test/helena-marques-tributaria",
        fonteTitulo: "Coluna: silêncios da política tributária",
      },
    ],
  },
});

adicionarPolitico("mdb", {
  slug: "joao-pedrosa",
  nome: "João Pedrosa",
  cargo: "senador_primeira_vaga",
  sintese: {
    sobre: [
      {
        texto:
          "João Pedrosa é senador desde 2019 e preside a Comissão de Assuntos Sociais no atual mandato.",
        fonteUrl: "https://exemplo-noticias.test/joao-pedrosa-perfil",
        fonteTitulo: "Perfil: João Pedrosa",
      },
    ],
    elogios: [
      {
        tipo: "fato",
        texto:
          "Autor da lei que criou o programa nacional de qualificação profissional para jovens.",
        fonteUrl: "https://exemplo-noticias.test/joao-pedrosa-qualificacao",
        fonteTitulo: "Programa de qualificação profissional",
      },
    ],
    criticas: [
      {
        tipo: "fato",
        texto:
          "Teve um projeto de sua autoria rejeitado por unanimidade na comissão de finanças em 2023.",
        fonteUrl: "https://exemplo-noticias.test/joao-pedrosa-rejeicao",
        fonteTitulo: "Projeto rejeitado na comissão de finanças",
      },
      {
        tipo: "opiniao_autor",
        texto:
          "Segundo o comentarista, o senador tende a priorizar pautas de sua base eleitoral em detrimento de acordos nacionais.",
        fonteUrl: "https://exemplo-opiniao.test/joao-pedrosa-base",
        fonteTitulo: "Comentário: entre a base e o país",
      },
    ],
  },
});

adicionarPolitico("uniao-brasil", {
  slug: "ricardo-teixeira",
  nome: "Ricardo Teixeira",
  cargo: "governador_vice_governador",
  viceNome: "Marta Souza",
  sintese: {
    sobre: [
      {
        texto:
          "Ricardo Teixeira governa o estado desde 2023, após duas gestões como prefeito da capital.",
        fonteUrl: "https://exemplo-noticias.test/ricardo-teixeira-perfil",
        fonteTitulo: "Perfil: Ricardo Teixeira",
      },
    ],
    elogios: [
      {
        tipo: "fato",
        texto:
          "Reduziu o tempo médio de abertura de empresas no estado de 21 para 6 dias.",
        fonteUrl: "https://exemplo-noticias.test/ricardo-teixeira-abertura-empresas",
        fonteTitulo: "Desburocratização estadual",
      },
    ],
    criticas: [
      {
        tipo: "fato",
        texto:
          "O estado registrou queda de 18% no investimento em fiscalização ambiental durante sua gestão.",
        fonteUrl: "https://exemplo-noticias.test/ricardo-teixeira-fiscalizacao",
        fonteTitulo: "Queda na fiscalização ambiental",
      },
      {
        tipo: "opiniao_autor",
        texto:
          "Para a colunista, o governador trata pautas ambientais como obstáculo ao crescimento econômico.",
        fonteUrl: "https://exemplo-opiniao.test/ricardo-teixeira-ambiental",
        fonteTitulo: "Coluna: crescimento a que custo?",
      },
    ],
  },
});

adicionarPolitico("novo", {
  slug: "camila-nogueira",
  nome: "Camila Nogueira",
  cargo: "deputado_estadual",
  sintese: {
    sobre: [
      {
        texto:
          "Camila Nogueira está em seu primeiro mandato como deputada estadual, com atuação voltada a projetos de transparência.",
        fonteUrl: "https://exemplo-noticias.test/camila-nogueira-perfil",
        fonteTitulo: "Perfil: Camila Nogueira",
      },
    ],
    elogios: [
      {
        tipo: "fato",
        texto:
          "Autora da lei estadual que obriga publicação em tempo real de gastos de gabinete.",
        fonteUrl: "https://exemplo-noticias.test/camila-nogueira-gastos",
        fonteTitulo: "Lei de transparência de gastos",
      },
    ],
    criticas: [],
  },
});

// Candidatos à Presidência 2026 oficializados após as convenções partidárias
// de 5/8/2026. G1 (fonte solicitada na spec) está inacessível para fetch
// automatizado; usadas fontes jornalísticas alternativas que reportam a
// mesma leva de chapas oficializadas.
const CANDIDATOS_13_FONTE_URL =
  "https://imirante.com/noticias/brasil/2026/08/13/ipolitica-eleicoes-2026-conheca-os-13-candidatos-a-presidencia";
const CANDIDATOS_13_FONTE_TITULO =
  "Eleições 2026: Conheça os 13 candidatos à Presidência";

function candidatoPresidente(input: {
  partidoSlug: string;
  slug: string;
  nome: string;
  viceNome?: string;
  sobre: string;
  fonteUrl?: string;
  fonteTitulo?: string;
}): void {
  adicionarPolitico(input.partidoSlug, {
    slug: input.slug,
    nome: input.nome,
    cargo: "presidente_vice_presidente",
    viceNome: input.viceNome,
    sintese: {
      sobre: [
        {
          texto: input.sobre,
          fonteUrl: input.fonteUrl ?? CANDIDATOS_13_FONTE_URL,
          fonteTitulo: input.fonteTitulo ?? CANDIDATOS_13_FONTE_TITULO,
        },
      ],
      elogios: [],
      criticas: [],
    },
  });
}

candidatoPresidente({
  partidoSlug: "pt",
  slug: "luiz-inacio-lula-da-silva",
  nome: "Luiz Inácio Lula da Silva",
  viceNome: "Geraldo Alckmin (PSB)",
  sobre:
    "Candidatura à reeleição oficializada em 2 de agosto de 2026, durante convenção nacional do PT em São Paulo, com Geraldo Alckmin novamente como candidato a vice-presidente.",
});

candidatoPresidente({
  partidoSlug: "pl",
  slug: "flavio-bolsonaro",
  nome: "Flávio Bolsonaro",
  viceNome: "Alfredo Gaspar (PL-AL)",
  sobre:
    "Senador pelo Rio de Janeiro, teve a candidatura à Presidência oficializada pelo PL, escolhendo o deputado Alfredo Gaspar (PL-AL) como candidato a vice-presidente.",
});

candidatoPresidente({
  partidoSlug: "psd",
  slug: "ronaldo-caiado",
  nome: "Ronaldo Caiado",
  viceNome: "Gilberto Kassab (PSD)",
  sobre:
    "Candidatura à Presidência oficializada pelo PSD, tendo o presidente do partido, Gilberto Kassab, como candidato a vice-presidente.",
});

candidatoPresidente({
  partidoSlug: "novo",
  slug: "romeu-zema",
  nome: "Romeu Zema",
  viceNome: "Eduardo Girão (Novo-CE)",
  sobre:
    "Ex-governador de Minas Gerais, teve a candidatura oficializada pelo Novo no fim de julho de 2026, com o senador Eduardo Girão (Novo-CE) como candidato a vice-presidente.",
});

candidatoPresidente({
  partidoSlug: "avante",
  slug: "augusto-cury",
  nome: "Augusto Cury",
  sobre: "Candidatura à Presidência oficializada pelo Avante para as eleições de 2026.",
});

candidatoPresidente({
  partidoSlug: "democracia-crista",
  slug: "clariana-barao",
  nome: "Clariana Barão",
  sobre: "Candidatura à Presidência oficializada pela Democracia Cristã para as eleições de 2026.",
});

candidatoPresidente({
  partidoSlug: "pcb",
  slug: "edmilson-costa",
  nome: "Edmilson Costa",
  viceNome: "Cleusa Santos",
  sobre:
    "Candidatura à Presidência oficializada pelo PCB em evento realizado em São Paulo em 1º de agosto de 2026, com Cleusa Santos como candidata a vice-presidente.",
});

candidatoPresidente({
  partidoSlug: "pstu",
  slug: "hertz-dias",
  nome: "Hertz Dias",
  viceNome: "Vanessa Portugal",
  sobre:
    "Candidatura à Presidência oficializada pela convenção nacional do PSTU, com Vanessa Portugal como candidata a vice-presidente.",
});

candidatoPresidente({
  partidoSlug: "pco",
  slug: "rui-costa-pimenta",
  nome: "Rui Costa Pimenta",
  sobre: "Candidatura à Presidência oficializada pelo PCO para as eleições de 2026.",
});

candidatoPresidente({
  partidoSlug: "missao",
  slug: "renan-santos",
  nome: "Renan Santos",
  sobre: "Candidatura à Presidência oficializada pelo Missão para as eleições de 2026.",
});

candidatoPresidente({
  partidoSlug: "unidade-popular",
  slug: "samara-martins",
  nome: "Samara Martins",
  viceNome: "Raquel Brício",
  sobre:
    "Candidatura à Presidência oficializada pela Unidade Popular, com Raquel Brício como candidata a vice-presidente.",
});

candidatoPresidente({
  partidoSlug: "democrata",
  slug: "wilson-grassi",
  nome: "Wilson Grassi",
  sobre:
    "Candidatura à Presidência oficializada pelo Democrata para as eleições de 2026; vice-presidente ainda não anunciado até a data de escrita.",
});

// Nota: um candidato adicional (Pablo Marçal) foi divulgado como uma das 13
// chapas oficializadas, mas seu partido não pôde ser confirmado com
// confiança nas fontes disponíveis — deixado de fora conforme a spec, para
// evitar atribuir uma legenda incorreta.

export function getPartidos(): Partido[] {
  return [...partidos].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

export function getPartidoBySlug(slug: string): Partido | undefined {
  const partido = partidos.find((p) => p.slug === slug);
  if (!partido) return undefined;
  return {
    ...partido,
    politicos: [...partido.politicos].sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR")
    ),
  };
}

export function getPoliticoBySlug(
  partidoSlug: string,
  politicoSlug: string
): { partido: Partido; politico: Politico } | undefined {
  const partido = getPartidoBySlug(partidoSlug);
  if (!partido) return undefined;
  const politico = partido.politicos.find((p) => p.slug === politicoSlug);
  if (!politico) return undefined;
  return { partido, politico };
}
