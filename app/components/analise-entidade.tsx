"use client";

import { usePanorama, useSentimento } from "@/app/lib/api/hooks";
import type { ConsultaRequest } from "@/app/lib/api/types";
import { Disclaimer } from "./disclaimer";
import { Secao } from "./secao";
import { ErroCarregamento, Skeleton } from "./estados";
import { PanoramaAbas } from "./panorama-abas";
import { SentimentoResumo } from "./sentimento-resumo";

/** Disclaimer + sentimento da cobertura + panorama, comuns a partido e político. */
export function AnaliseEntidade({ entidade }: { entidade: ConsultaRequest }) {
  const sentimento = useSentimento(entidade);
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
