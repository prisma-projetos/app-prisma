"use client";

import { useAnalisePorTema, usePanorama, useSentimento } from "@/app/lib/api/hooks";
import type { ConsultaRequest } from "@/app/lib/api/types";
import { Disclaimer } from "./disclaimer";
import { Secao } from "./secao";
import { ErroCarregamento, Skeleton } from "./estados";
import { PanoramaAbas } from "./panorama-abas";
import { SentimentoResumo } from "./sentimento-resumo";
import { TemasCitados } from "./temas-citados";

/** Disclaimer + sentimento da cobertura + temas + panorama, comuns a partido e político. */
export function AnaliseEntidade({ entidade }: { entidade: ConsultaRequest }) {
  const sentimento = useSentimento(entidade);
  const temas = useAnalisePorTema(entidade);
  const panorama = usePanorama(entidade);

  return (
    <>
      <Disclaimer />

      <Secao id="titulo-sentimento" titulo="Sentimento da cobertura">
        {sentimento.isPending && <Skeleton className="h-16 w-full" />}
        {sentimento.isError && (
          <ErroCarregamento onTentarDeNovo={() => sentimento.refetch()} />
        )}
        {sentimento.data && <SentimentoResumo resumo={sentimento.data} />}
      </Secao>

      <Secao id="titulo-temas" titulo="Temas mais citados">
        {temas.isPending && (
          <div role="status" aria-label="Carregando temas" className="flex flex-col gap-3">
            {["w-full", "w-4/5", "w-2/3", "w-1/2"].map((largura) => (
              <Skeleton key={largura} className={`h-6 ${largura}`} />
            ))}
          </div>
        )}
        {temas.isError && (
          <ErroCarregamento mensagem="Não foi possível carregar os temas." onTentarDeNovo={() => temas.refetch()} />
        )}
        {temas.data && <TemasCitados resposta={temas.data} periodo="em todo o período" />}
      </Secao>

      <Secao id="titulo-panorama" titulo="Panorama">
        {panorama.isPending && <Skeleton className="h-40 w-full" />}
        {panorama.isError && (
          <ErroCarregamento onTentarDeNovo={() => panorama.refetch()} />
        )}
        {panorama.data && <PanoramaAbas panorama={panorama.data} />}
      </Secao>
    </>
  );
}
