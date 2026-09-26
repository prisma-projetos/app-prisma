"use client";

import Link from "next/link";
import { Suspense } from "react";
import { AnaliseEntidade } from "@/app/components/analise-entidade";
import { EntidadeAvatar } from "@/app/components/entidade-avatar";
import { ErroCarregamento, GradeSkeleton, Skeleton } from "@/app/components/estados";
import { Pagina } from "@/app/components/pagina";
import { usePartido } from "@/app/lib/api/hooks";
import { nomeProprio } from "@/app/lib/formatacao";
import { naoEncontrado } from "@/app/lib/identificadores";
import { PoliticosDoPartido } from "./politicos-do-partido";

export function PartidoView({ nrPartido }: { nrPartido: number }) {
  const partido = usePartido(nrPartido);

  if (partido.isError && naoEncontrado(partido.error)) {
    return (
      <Pagina>
        <p className="text-corpo text-tinta-2">Partido não encontrado.</p>
        <Link href="/" className="inline-flex min-h-12 items-center text-corpo underline hover:decoration-2">
          Voltar para a lista de partidos
        </Link>
      </Pagina>
    );
  }

  return (
    <Pagina>
      <Link
        href="/"
        className="inline-flex min-h-12 items-center gap-2 self-start text-apoio text-tinta-2 underline hover:decoration-2"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.5">
          <path d="m10 5-7 7 7 7M3 12h18" />
        </svg>
        Partidos
      </Link>

      {partido.isPending && <Skeleton className="h-16 w-72 max-w-full" />}
      {partido.isError && (
        <ErroCarregamento onTentarDeNovo={() => partido.refetch()} />
      )}
      {partido.data && (
        <div className="flex items-center gap-6">
          <EntidadeAvatar
            nome={partido.data.sigla ?? ""}
            imagemUrl={partido.data.urlLogo}
            variante="partido"
            tamanho={64}
          />
          <div className="min-w-0">
            <h1 className="text-titulo-1 font-bold text-tinta sm:text-display">
              {partido.data.sigla}
            </h1>
            <p className="text-corpo text-tinta-2">
              {nomeProprio(partido.data.nome)} <span className="whitespace-nowrap">· nº {partido.data.numero}</span>
            </p>
          </div>
        </div>
      )}

      <AnaliseEntidade entidade={{ nrPartido }} />

      <Suspense fallback={<GradeSkeleton itens={12} circular />}>
        <PoliticosDoPartido nrPartido={nrPartido} />
      </Suspense>
    </Pagina>
  );
}
