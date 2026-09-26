import type { NextRequest } from "next/server";
import {
  avisarSemProxyUmaVez,
  ipDaRequisicao,
  limitadorDoProxy,
  proxiesConfiaveis,
} from "@/app/lib/api/server/limite-requisicoes";
import { encaminhar } from "@/app/lib/api/server/prisma-service";

const SEM_CACHE = { "Cache-Control": "no-store" };

function erro(status: number, mensagem: string, headers?: HeadersInit) {
  return Response.json(
    { erro: mensagem },
    { status, headers: { ...SEM_CACHE, ...headers } }
  );
}

export async function GET(
  request: NextRequest,
  ctx: RouteContext<"/api/prisma/[...path]">
) {
  // Sem proxy confiável não há IP confiável: o limite fica desligado (spec 019).
  const ip = ipDaRequisicao(request.headers, proxiesConfiaveis());
  const limite = ip === null ? undefined : limitadorDoProxy.verificar(ip);
  if (ip === null) avisarSemProxyUmaVez();
  if (limite && !limite.permitido) {
    return erro(429, "Muitas requisições. Tente de novo em instantes.", {
      "Retry-After": String(limite.retryAfterSegundos),
    });
  }

  const { path } = await ctx.params;
  const resultado = await encaminhar(
    path.join("/"),
    request.nextUrl.searchParams
  );

  if (!resultado.ok) return erro(resultado.status, resultado.erro);

  const { resposta } = resultado;
  return new Response(resposta.body, {
    status: resposta.status,
    headers: {
      ...SEM_CACHE,
      "Content-Type":
        resposta.headers.get("Content-Type") ?? "application/json",
    },
  });
}

function metodoNaoPermitido() {
  return erro(405, "Método não permitido", { Allow: "GET" });
}

export {
  metodoNaoPermitido as POST,
  metodoNaoPermitido as PUT,
  metodoNaoPermitido as PATCH,
  metodoNaoPermitido as DELETE,
};
