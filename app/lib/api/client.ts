// Cliente usado no navegador: fala só com o proxy /api/prisma, nunca com a API direto.

const MENSAGEM_GENERICA = "Erro ao consultar a API";

export type Parametros = Record<string, string | number | null | undefined>;

export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly mensagem: string
  ) {
    super(mensagem);
    this.name = "ApiError";
  }
}

export function montarQuery(params: Parametros = {}): string {
  const busca = new URLSearchParams();
  for (const [nome, valor] of Object.entries(params)) {
    if (valor === undefined || valor === null || valor === "") continue;
    busca.set(nome, String(valor));
  }
  const query = busca.toString();
  return query ? `?${query}` : "";
}

async function lerMensagemDeErro(resposta: Response): Promise<string> {
  try {
    const corpo: unknown = await resposta.json();
    if (corpo && typeof corpo === "object" && "erro" in corpo) {
      const { erro } = corpo as { erro: unknown };
      if (typeof erro === "string") return erro;
    }
  } catch {
    // corpo não-JSON (ex.: HTML de gateway)
  }
  return MENSAGEM_GENERICA;
}

export async function apiGet<T>(
  caminho: string,
  params?: Parametros,
  signal?: AbortSignal
): Promise<T> {
  let resposta: Response;
  try {
    resposta = await fetch(`/api/prisma/${caminho}${montarQuery(params)}`, {
      headers: { Accept: "application/json" },
      signal,
    });
  } catch (erro) {
    if (signal?.aborted) throw erro;
    throw new ApiError(0, MENSAGEM_GENERICA);
  }

  if (!resposta.ok) {
    throw new ApiError(resposta.status, await lerMensagemDeErro(resposta));
  }

  try {
    return (await resposta.json()) as T;
  } catch {
    throw new ApiError(resposta.status, MENSAGEM_GENERICA);
  }
}
