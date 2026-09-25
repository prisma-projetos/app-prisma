"use client";

import Link from "next/link";
import { AnaliseEntidade } from "@/app/components/analise-entidade";
import { EntidadeAvatar } from "@/app/components/entidade-avatar";
import { ErroCarregamento, MensagemVazia, Skeleton } from "@/app/components/estados";
import { Pagina } from "@/app/components/pagina";
import { usePolitico } from "@/app/lib/api/hooks";
import type { CandidaturaResponse } from "@/app/lib/api/types";
import { candidaturaMaisRecente, ordenarCandidaturas } from "@/app/lib/formatacao";
import { naoEncontrado } from "@/app/lib/identificadores";

const VAZIO = "—";

export function PoliticoView({ tituloEleitoral }: { tituloEleitoral: string }) {
  const detalhe = usePolitico(tituloEleitoral);

  if (detalhe.isError && naoEncontrado(detalhe.error)) {
    return (
      <Pagina>
        <p className="text-zinc-700 dark:text-zinc-300">Político não encontrado.</p>
        <Link href="/" className="text-sm underline">
          Voltar para a lista de partidos
        </Link>
      </Pagina>
    );
  }

  const politico = detalhe.data?.politico;
  const candidaturas = detalhe.data?.candidaturas ?? [];
  const recente = candidaturaMaisRecente(candidaturas);

  return (
    <Pagina>
      <Link
        href={recente?.nrPartido ? `/partidos/${recente.nrPartido}` : "/"}
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
      >
        ← {recente?.siglaPartido ?? "Partidos"}
      </Link>

      {detalhe.isPending && <Skeleton className="h-16 w-72" />}
      {detalhe.isError && (
        <ErroCarregamento onTentarDeNovo={() => detalhe.refetch()} />
      )}
      {detalhe.data && (
        <div className="flex items-center gap-4">
          <EntidadeAvatar
            nome={politico?.nomeSocial || politico?.nome || ""}
            imagemUrl={recente?.urlFoto}
            variante="politico"
            tamanho={64}
          />
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {politico?.nomeSocial || politico?.nome}
            </h1>
            {recente && <ResumoCandidatura candidatura={recente} />}
          </div>
        </div>
      )}

      <AnaliseEntidade entidade={{ tituloEleitoral }} />

      {detalhe.data && <TabelaCandidaturas candidaturas={candidaturas} />}
    </Pagina>
  );
}

function ResumoCandidatura({ candidatura }: { candidatura: CandidaturaResponse }) {
  const partes = [candidatura.cargo, candidatura.uf].filter(Boolean).join(" · ");
  return (
    <p className="text-sm text-zinc-500">
      {partes}
      {partes && candidatura.siglaPartido && " · "}
      {candidatura.siglaPartido && candidatura.nrPartido && (
        <Link
          href={`/partidos/${candidatura.nrPartido}`}
          className="underline hover:text-zinc-800 dark:hover:text-zinc-300"
        >
          {candidatura.siglaPartido}
        </Link>
      )}
    </p>
  );
}

function TabelaCandidaturas({ candidaturas }: { candidaturas: CandidaturaResponse[] }) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="titulo-candidaturas">
      <h2 id="titulo-candidaturas" className="text-lg font-semibold text-black dark:text-white">
        Candidaturas
      </h2>
      {candidaturas.length === 0 ? (
        <MensagemVazia>Nenhuma candidatura registrada.</MensagemVazia>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase text-zinc-500">
              <tr>
                <th className="py-2 pr-4">Ano</th>
                <th className="py-2 pr-4">Cargo</th>
                <th className="py-2 pr-4">UF</th>
                <th className="py-2 pr-4">Partido</th>
                <th className="py-2 pr-4">Nº de urna</th>
                <th className="py-2">Resultado</th>
              </tr>
            </thead>
            <tbody className="text-zinc-800 dark:text-zinc-200">
              {ordenarCandidaturas(candidaturas).map((c, i) => (
                <tr
                  key={c.sequencial ?? i}
                  className="border-t border-zinc-200 dark:border-zinc-800"
                >
                  <td className="py-2 pr-4">{c.anoEleicao ?? VAZIO}</td>
                  <td className="py-2 pr-4">{c.cargo ?? VAZIO}</td>
                  <td className="py-2 pr-4">{c.uf ?? VAZIO}</td>
                  <td className="py-2 pr-4">
                    {c.siglaPartido && c.nrPartido ? (
                      <Link href={`/partidos/${c.nrPartido}`} className="underline">
                        {c.siglaPartido}
                      </Link>
                    ) : (
                      (c.siglaPartido ?? VAZIO)
                    )}
                  </td>
                  <td className="py-2 pr-4">{c.numeroUrna ?? VAZIO}</td>
                  <td className="py-2">{c.resultado ?? VAZIO}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
