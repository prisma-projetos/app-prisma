"use client";

import Link from "next/link";
import { Suspense } from "react";
import { AnaliseEntidade } from "@/app/components/analise-entidade";
import { EntidadeAvatar } from "@/app/components/entidade-avatar";
import { ErroCarregamento, GradeSkeleton, Skeleton } from "@/app/components/estados";
import { Pagina } from "@/app/components/pagina";
import { usePartido } from "@/app/lib/api/hooks";
import { naoEncontrado } from "@/app/lib/identificadores";
import { PoliticosDoPartido } from "./politicos-do-partido";

export function PartidoView({ nrPartido }: { nrPartido: number }) {
  const partido = usePartido(nrPartido);

  if (partido.isError && naoEncontrado(partido.error)) {
    return (
      <Pagina>
        <p className="text-zinc-700 dark:text-zinc-300">Partido não encontrado.</p>
        <Link href="/" className="text-sm underline">
          Voltar para a lista de partidos
        </Link>
      </Pagina>
    );
  }

  return (
    <Pagina>
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
      >
        ← Partidos
      </Link>

      {partido.isPending && <Skeleton className="h-16 w-72" />}
      {partido.isError && (
        <ErroCarregamento onTentarDeNovo={() => partido.refetch()} />
      )}
      {partido.data && (
        <div className="flex items-center gap-4">
          <EntidadeAvatar
            nome={partido.data.sigla ?? ""}
            imagemUrl={partido.data.urlLogo}
            variante="partido"
            tamanho={64}
          />
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {partido.data.sigla}
            </h1>
            <p className="text-sm text-zinc-500">
              {partido.data.nome} · nº {partido.data.numero}
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
