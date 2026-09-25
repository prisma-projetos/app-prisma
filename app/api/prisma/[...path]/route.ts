import type { NextRequest } from "next/server";
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
