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

  function limparVencidos(agora: number) {
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
    limpar: () => acessos.clear(),
  };
}

/** Primeiro IP de x-forwarded-for; depois x-real-ip; senão, um balde comum. */
export function ipDaRequisicao(cabecalhos: Headers): string {
  const encaminhado = cabecalhos.get("x-forwarded-for")?.split(",")[0]?.trim();
  if (encaminhado) return encaminhado;
  return cabecalhos.get("x-real-ip")?.trim() || "desconhecido";
}

export const limitadorDoProxy = criarLimitador({ limite: 60, janelaMs: 60_000 });
