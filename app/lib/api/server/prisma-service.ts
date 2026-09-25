import "server-only";

// Serviço base de acesso à API Prisma. Roda apenas no servidor: é aqui que a
// chave (API_PRISMA_KEY) é usada, e ela nunca deve chegar ao navegador.

const TIMEOUT_MS = 10_000;

type Validador = (valor: string) => boolean;

const inteiro: Validador = (v) => /^-?\d+$/.test(v);
const texto: Validador = (v) => v.length > 0;

const VALIDADORES: Record<string, Validador> = {
  q: texto,
  tituloEleitoral: texto,
  nrPartido: (v) => /^\d+$/.test(v),
  sentimento: (v) => v === "positivo" || v === "neutro" || v === "negativo",
  tema: texto,
  anoEleicao: (v) => /^\d{4}$/.test(v),
  janela: (v) => /^\d{4}-(0[1-9]|1[0-2])$/.test(v),
  de: dataIso,
  ate: dataIso,
  pagina: (v) => inteiro(v) && Number(v) >= 0,
  tamanho: (v) => inteiro(v) && Number(v) >= 1 && Number(v) <= 100,
};

const CONSULTA = [
  "tituloEleitoral",
  "nrPartido",
  "sentimento",
  "tema",
  "janela",
  "de",
  "ate",
  "pagina",
  "tamanho",
];

// Caminho (relativo a /api no backend) → parâmetros aceitos.
export const CAMINHOS_PERMITIDOS: Record<string, readonly string[]> = {
  politicos: ["q", "nrPartido", "anoEleicao", "pagina", "tamanho"],
  "politicos/detalhe": ["tituloEleitoral"],
  partidos: ["q"],
  "partidos/detalhe": ["nrPartido"],
  "analise/sentimento": CONSULTA,
  "analise/por-tema": CONSULTA,
  "analise/por-midia": CONSULTA,
  "analise/panorama": CONSULTA,
  "analise/mencoes": CONSULTA,
  "analise/materias": CONSULTA,
};

function dataIso(v: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
  const data = new Date(`${v}T00:00:00Z`);
  return !Number.isNaN(data.getTime()) && data.toISOString().startsWith(v);
}

export type Resultado =
  | { ok: true; resposta: Response }
  | { ok: false; status: number; erro: string };

function falha(status: number, erro: string): Resultado {
  return { ok: false, status, erro };
}

export function caminhoPermitido(caminho: string): boolean {
  return Object.hasOwn(CAMINHOS_PERMITIDOS, caminho);
}

/** Valida os parâmetros para o caminho; devolve a mensagem de erro ou null. */
export function validarParametros(
  caminho: string,
  params: URLSearchParams
): string | null {
  const aceitos = CAMINHOS_PERMITIDOS[caminho];
  for (const [nome, valor] of params) {
    if (!aceitos.includes(nome)) return `Parâmetro desconhecido: ${nome}`;
    if (params.getAll(nome).length > 1) return `Parâmetro repetido: ${nome}`;
    if (!VALIDADORES[nome](valor)) return `Parâmetro inválido: ${nome}`;
  }
  return null;
}

/** Repassa a consulta ao backend como GET com query string. */
export async function encaminhar(
  caminho: string,
  params: URLSearchParams
): Promise<Resultado> {
  if (!caminhoPermitido(caminho)) return falha(404, "Recurso não encontrado");

  const erroValidacao = validarParametros(caminho, params);
  if (erroValidacao) return falha(400, erroValidacao);

  const base = process.env.API_PRISMA;
  const chave = process.env.API_PRISMA_KEY;
  if (!base || !chave) return falha(500, "API não configurada");

  const url = new URL(`api/${caminho}`, base.endsWith("/") ? base : `${base}/`);
  url.search = params.toString();

  try {
    const resposta = await fetch(url, {
      method: "GET",
      headers: { "X-API-KEY": chave, Accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
    return { ok: true, resposta };
  } catch {
    return falha(502, "Falha ao contatar a API");
  }
}
