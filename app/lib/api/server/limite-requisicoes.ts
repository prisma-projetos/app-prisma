import "server-only";

// Limite de requisições do proxy /api/prisma (spec 019). Fica em memória: vale
// por instância do servidor, o que basta para o container único de hoje. Com
// várias instâncias, o limite precisa ir para o proxy reverso ou um store
// compartilhado.

export interface Verificacao {
  permitido: boolean;
  /** Segundos até a requisição mais antiga da janela sair (só quando bloqueado). */
  retryAfterSegundos: number;
}

export function criarLimitador({ limite, janelaMs }: { limite: number; janelaMs: number }) {
  const acessos = new Map<string, number[]>();
  let ultimaLimpeza = Number.NEGATIVE_INFINITY;

  // Varre o mapa no máximo uma vez por janela, e não a cada requisição.
  function limparVencidos(agora: number) {
    if (agora - ultimaLimpeza < janelaMs) return;
    ultimaLimpeza = agora;
    for (const [chave, instantes] of acessos) {
      if (instantes[instantes.length - 1] <= agora - janelaMs) acessos.delete(chave);
    }
  }

  return {
    verificar(chave: string, agora: number = Date.now()): Verificacao {
      limparVencidos(agora);
      const recentes = (acessos.get(chave) ?? []).filter((t) => t > agora - janelaMs);
      if (recentes.length >= limite) {
        acessos.set(chave, recentes);
        return { permitido: false, retryAfterSegundos: Math.max(1, Math.ceil((recentes[0] + janelaMs - agora) / 1000)) };
      }
      recentes.push(agora);
      acessos.set(chave, recentes);
      return { permitido: true, retryAfterSegundos: 0 };
    },
    tamanho: () => acessos.size,
    limpar: () => {
      acessos.clear();
      ultimaLimpeza = Number.NEGATIVE_INFINITY;
    },
  };
}

/**
 * IP do visitante segundo os proxies confiáveis. O início de x-forwarded-for é
 * escrito pelo próprio cliente; cada proxy confiável acrescenta um valor no fim.
 * Com N proxies, o IP do visitante é o N-ésimo valor contado da direita.
 * Sem proxy confiável (N = 0), não há IP em que confiar: devolve null.
 */
export function ipDaRequisicao(cabecalhos: Headers, proxiesConfiaveis: number): string | null {
  if (proxiesConfiaveis < 1) return null;
  const valores = (cabecalhos.get("x-forwarded-for") ?? "")
    .split(",")
    .map((valor) => valor.trim())
    .filter(Boolean);
  return valores[valores.length - proxiesConfiaveis] ?? "desconhecido";
}

export const limitadorDoProxy = criarLimitador({ limite: 60, janelaMs: 60_000 });

let avisouSemProxy = false;

/** Lê PROXIES_CONFIAVEIS a cada requisição (runtime, não build). */
export function proxiesConfiaveis(): number {
  const valor = Number(process.env.PROXIES_CONFIAVEIS ?? 0);
  return Number.isInteger(valor) && valor > 0 ? valor : 0;
}

/** Sem proxy confiável o limite fica desligado; isso é dito uma vez no log. */
export function avisarSemProxyUmaVez() {
  if (avisouSemProxy) return;
  avisouSemProxy = true;
  console.warn(
    "[prisma] Limite de requisições desligado: defina PROXIES_CONFIAVEIS com o número de proxies " +
      "reversos que acrescentam o IP do visitante em X-Forwarded-For (spec 019)."
  );
}

/** Só para testes: volta o aviso ao estado inicial. */
export function reiniciarAvisoSemProxy() {
  avisouSemProxy = false;
}
