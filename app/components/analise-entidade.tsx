"use client";

import { usePanorama, useSentimento } from "@/app/lib/api/hooks";
import type { ConsultaRequest } from "@/app/lib/api/types";
import { Disclaimer } from "./disclaimer";
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

      <section className="flex flex-col gap-4" aria-labelledby="titulo-sentimento">
        <h2 id="titulo-sentimento" className="text-lg font-semibold text-black dark:text-white">
          Sentimento da cobertura
        </h2>
        {sentimento.isPending && <Skeleton className="h-16 w-full" />}
        {sentimento.isError && (
          <ErroCarregamento onTentarDeNovo={() => sentimento.refetch()} />
        )}
        {sentimento.data && <SentimentoResumo resumo={sentimento.data} />}
      </section>

      <section className="flex flex-col gap-2" aria-labelledby="titulo-panorama">
        <h2 id="titulo-panorama" className="text-lg font-semibold text-black dark:text-white">
          Panorama
        </h2>
        {panorama.isPending && <Skeleton className="h-40 w-full" />}
        {panorama.isError && (
          <ErroCarregamento onTentarDeNovo={() => panorama.refetch()} />
        )}
        {panorama.data && <PanoramaAbas panorama={panorama.data} />}
      </section>
    </>
  );
}
