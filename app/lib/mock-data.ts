import type { Partido, Politico } from "./types";

function logoPlaceholder(sigla: string, cor: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" rx="16" fill="${cor}"/><text x="48" y="56" font-family="sans-serif" font-size="26" font-weight="700" fill="#fff" text-anchor="middle">${sigla}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const partidos: Partido[] = [
  {
    slug: "frente-popular-unida",
    nome: "Frente Popular Unida",
    sigla: "FPU",
    logoUrl: logoPlaceholder("FPU", "#b91c1c"),
    sintese: {
      sobre: [
        {
          texto:
            "Fundada em 1987, a Frente Popular Unida defende ampliação de programas sociais, regulação do mercado financeiro e reforma agrária. Atualmente possui representação em 14 estados.",
          fonteUrl: "https://exemplo-noticias.test/fpu-perfil-historico",
          fonteTitulo: "Perfil histórico: Frente Popular Unida",
        },
      ],
      elogios: [
        {
          tipo: "fato",
          texto:
            "O partido aprovou 12 projetos de lei sobre transferência de renda na última legislatura.",
          fonteUrl: "https://exemplo-noticias.test/fpu-projetos-aprovados",
          fonteTitulo: "Balanço legislativo 2025",
        },
        {
          tipo: "opiniao_autor",
          texto:
            "Para o colunista, a FPU tem sido a voz mais consistente na defesa de políticas de redistribuição de renda no país.",
          fonteUrl: "https://exemplo-opiniao.test/coluna-fpu-redistribuicao",
          fonteTitulo: "Coluna: redistribuição em pauta",
        },
        {
          tipo: "inferencia_modelo",
          texto:
            "O padrão de cobertura sugere que a FPU é frequentemente associada a avanços em proteção social, mesmo em veículos de linha editorial distinta.",
          fonteUrl: "https://exemplo-analise.test/fpu-cobertura-social",
          fonteTitulo: "Análise de cobertura: pauta social",
        },
      ],
      criticas: [
        {
          tipo: "fato",
          texto:
            "Dois deputados do partido foram alvo de investigação por uso irregular de verba de gabinete em 2024.",
          fonteUrl: "https://exemplo-noticias.test/fpu-investigacao-verba",
          fonteTitulo: "Investigação sobre uso de verba parlamentar",
        },
        {
          tipo: "opiniao_autor",
          texto:
            "Segundo o editorialista, a legenda tem dificuldade de apresentar propostas de ajuste fiscal viáveis.",
          fonteUrl: "https://exemplo-opiniao.test/editorial-fpu-fiscal",
          fonteTitulo: "Editorial: contas públicas em xeque",
        },
      ],
    },
    politicos: [
      {
        slug: "helena-marques",
        nome: "Helena Marques",
        cargo: "Deputada Federal",
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
      },
      {
        slug: "joao-pedrosa",
        nome: "João Pedrosa",
        cargo: "Senador",
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
      },
    ],
  },
  {
    slug: "partido-alianca-nacional",
    nome: "Partido Aliança Nacional",
    sigla: "PAN",
    logoUrl: logoPlaceholder("PAN", "#1d4ed8"),
    sintese: {
      sobre: [
        {
          texto:
            "O Partido Aliança Nacional, fundado em 1994, defende redução da carga tributária sobre empresas e maior autonomia para estados e municípios.",
          fonteUrl: "https://exemplo-noticias.test/pan-perfil-historico",
          fonteTitulo: "Perfil histórico: Partido Aliança Nacional",
        },
      ],
      elogios: [
        {
          tipo: "fato",
          texto:
            "O partido liderou a aprovação da lei de simplificação tributária para pequenas empresas em 2024.",
          fonteUrl: "https://exemplo-noticias.test/pan-simplificacao-tributaria",
          fonteTitulo: "Lei de simplificação tributária",
        },
        {
          tipo: "opiniao_autor",
          texto:
            "Na visão do colunista, a legenda tem sido consistente na defesa do ambiente de negócios para pequenas empresas.",
          fonteUrl: "https://exemplo-opiniao.test/coluna-pan-negocios",
          fonteTitulo: "Coluna: ambiente de negócios",
        },
      ],
      criticas: [
        {
          tipo: "fato",
          texto:
            "Uma liderança do partido foi multada pelo tribunal eleitoral por propaganda irregular em 2023.",
          fonteUrl: "https://exemplo-noticias.test/pan-multa-eleitoral",
          fonteTitulo: "Multa por propaganda irregular",
        },
        {
          tipo: "inferencia_modelo",
          texto:
            "O padrão de cobertura sugere associação recorrente do partido a pautas de desregulamentação ambiental.",
          fonteUrl: "https://exemplo-analise.test/pan-cobertura-ambiental",
          fonteTitulo: "Análise de cobertura: pauta ambiental",
        },
      ],
    },
    politicos: [
      {
        slug: "ricardo-teixeira",
        nome: "Ricardo Teixeira",
        cargo: "Governador",
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
      },
    ],
  },
  {
    slug: "partido-novo-horizonte",
    nome: "Partido Novo Horizonte",
    sigla: "PNH",
    logoUrl: logoPlaceholder("PNH", "#15803d"),
    sintese: {
      sobre: [
        {
          texto:
            "O Partido Novo Horizonte é uma legenda de centro fundada em 2011, com foco em pautas de transparência pública e reforma política.",
          fonteUrl: "https://exemplo-noticias.test/pnh-perfil-historico",
          fonteTitulo: "Perfil histórico: Partido Novo Horizonte",
        },
      ],
      elogios: [
        {
          tipo: "fato",
          texto:
            "O partido foi o primeiro a publicar voluntariamente a lista de doadores de campanha em formato aberto.",
          fonteUrl: "https://exemplo-noticias.test/pnh-transparencia-doacoes",
          fonteTitulo: "Transparência em doações de campanha",
        },
      ],
      criticas: [
        {
          tipo: "opiniao_autor",
          texto:
            "Segundo o analista, o partido carece de uma agenda econômica clara para além do discurso de transparência.",
          fonteUrl: "https://exemplo-opiniao.test/pnh-agenda-economica",
          fonteTitulo: "Análise: além da transparência",
        },
      ],
    },
    politicos: [
      {
        slug: "camila-nogueira",
        nome: "Camila Nogueira",
        cargo: "Deputada Estadual",
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
      },
    ],
  },
];

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
