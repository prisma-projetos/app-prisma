"use client";

import Link from "next/link";
import { AnaliseEntidade } from "@/app/components/analise-entidade";
import { EntidadeAvatar } from "@/app/components/entidade-avatar";
import { ErroCarregamento, MensagemVazia, Skeleton } from "@/app/components/estados";
import { Secao } from "@/app/components/secao";
import { Pagina } from "@/app/components/pagina";
import { usePolitico } from "@/app/lib/api/hooks";
import type { CandidaturaResponse } from "@/app/lib/api/types";
import { candidaturaMaisRecente, nomeProprio, ordenarCandidaturas } from "@/app/lib/formatacao";
import { rotuloDoCargo } from "@/app/lib/cargos";
import { naoEncontrado } from "@/app/lib/identificadores";

const VAZIO = "—";

export function PoliticoView({ tituloEleitoral }: { tituloEleitoral: string }) {
  const detalhe = usePolitico(tituloEleitoral);

  if (detalhe.isError && naoEncontrado(detalhe.error)) {
    return (
      <Pagina>
        <p className="text-tinta-2">Político não encontrado.</p>
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
        className="inline-flex min-h-12 items-center gap-2 self-start text-base text-tinta-2 underline hover:text-tinta"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-5" stroke="currentColor" strokeWidth="1.5">
          <path d="m10 5-7 7 7 7M3 12h18" />
        </svg>
        {recente?.siglaPartido ?? "Partidos"}
      </Link>

      {detalhe.isPending && <Skeleton className="h-16 w-72" />}
      {detalhe.isError && (
        <ErroCarregamento onTentarDeNovo={() => detalhe.refetch()} />
      )}
      {detalhe.data && (
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
          <span className="shrink-0">
            <EntidadeAvatar
              nome={nomeProprio(politico?.nomeSocial || politico?.nome)}
              imagemUrl={recente?.urlFoto}
              variante="politico"
              tamanho={96}
            />
          </span>
          <div className="min-w-0">
            <h1 className="break-words text-titulo-1 font-bold text-tinta sm:text-display">
              {nomeProprio(politico?.nomeSocial || politico?.nome)}
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
  const partes = [rotuloDoCargo(candidatura.cargo), candidatura.uf].filter(Boolean).join(" · ");
  return (
    <p className="text-base text-tinta-2">
      {partes}
      {partes && candidatura.siglaPartido && " · "}
      {candidatura.siglaPartido && candidatura.nrPartido && (
        <Link
          href={`/partidos/${candidatura.nrPartido}`}
          className="underline hover:text-tinta"
        >
          {candidatura.siglaPartido}
        </Link>
      )}
    </p>
  );
}

function TabelaCandidaturas({ candidaturas }: { candidaturas: CandidaturaResponse[] }) {
  const temResultadoAusente = candidaturas.some((c) => !c.resultado?.trim());
  return (
    <Secao id="candidaturas" titulo="Candidaturas">
      {candidaturas.length === 0 ? (
        <MensagemVazia>Nenhuma candidatura registrada.</MensagemVazia>
      ) : (
        <div className="overflow-x-auto" role="region" aria-label="Tabela de candidaturas" tabIndex={0}>
          <table className="w-full text-left text-base max-sm:block sm:min-w-[640px]">
            <thead className="border-b border-tinta text-base text-tinta-2 max-sm:sr-only">
              <tr>
                <th scope="col" className="py-4 pr-4">Ano</th>
                <th scope="col" className="py-4 pr-4">Cargo</th>
                <th scope="col" className="py-4 pr-4">Estado</th>
                <th scope="col" className="py-4 pr-4">Partido</th>
                <th scope="col" className="py-4 pr-4">Nº de urna</th>
                <th scope="col" className="py-4">Resultado</th>
              </tr>
            </thead>
            <tbody className="text-tinta max-sm:block">
              {ordenarCandidaturas(candidaturas).map((c, i) => (
                <tr
                  key={c.sequencial ?? i}
                  className="border-b border-fio max-sm:block max-sm:py-3"
                >
                  <td data-rotulo="Ano" className="max-sm:grid max-sm:grid-cols-[8.5rem_1fr] max-sm:gap-3 max-sm:py-1 max-sm:before:text-tinta-2 max-sm:before:content-[attr(data-rotulo)] py-4 pr-4">{c.anoEleicao ?? VAZIO}</td>
                  <td data-rotulo="Cargo" className="max-sm:grid max-sm:grid-cols-[8.5rem_1fr] max-sm:gap-3 max-sm:py-1 max-sm:before:text-tinta-2 max-sm:before:content-[attr(data-rotulo)] py-4 pr-4">{rotuloDoCargo(c.cargo) ?? VAZIO}</td>
                  <td data-rotulo="Estado" className="max-sm:grid max-sm:grid-cols-[8.5rem_1fr] max-sm:gap-3 max-sm:py-1 max-sm:before:text-tinta-2 max-sm:before:content-[attr(data-rotulo)] py-4 pr-4">{c.uf ?? VAZIO}</td>
                  <td data-rotulo="Partido" className="max-sm:grid max-sm:grid-cols-[8.5rem_1fr] max-sm:gap-3 max-sm:py-1 max-sm:before:text-tinta-2 max-sm:before:content-[attr(data-rotulo)] py-4 pr-4">
                    {c.siglaPartido && c.nrPartido ? (
                      <Link href={`/partidos/${c.nrPartido}`} className="underline">
                        {c.siglaPartido}
                      </Link>
                    ) : (
                      (c.siglaPartido ?? VAZIO)
                    )}
                  </td>
                  <td data-rotulo="Nº de urna" className="max-sm:grid max-sm:grid-cols-[8.5rem_1fr] max-sm:gap-3 max-sm:py-1 max-sm:before:text-tinta-2 max-sm:before:content-[attr(data-rotulo)] py-4 pr-4">{c.numeroUrna ?? VAZIO}</td>
                  <td data-rotulo="Resultado" className="max-sm:grid max-sm:grid-cols-[8.5rem_1fr] max-sm:gap-3 max-sm:py-1 max-sm:before:text-tinta-2 max-sm:before:content-[attr(data-rotulo)] py-4" aria-describedby={!c.resultado?.trim() ? "nota-resultado" : undefined}>
                    {c.resultado?.trim() ? c.resultado : <span>Não informado<span>¹</span></span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {temResultadoAusente && (
        <p id="nota-resultado" className="mt-4 max-w-prose text-base text-tinta-2">
          ¹ A base de dados ainda não traz o resultado desta candidatura. Quando ele for registrado, aparece aqui.
        </p>
      )}
    </Secao>
  );
}
