"use client";

import { useState } from "react";
import type { Fonte, PanoramaEixo, PanoramaResponse, Sentimento } from "@/app/lib/api/types";
import { dataCurta, dominio, formatarNumero, janelaPorExtenso } from "@/app/lib/formatacao";
import { SENTIMENTO_LABEL, SENTIMENTOS } from "@/app/lib/sentimento";
import { MensagemVazia } from "./estados";

export function PanoramaAbas({ panorama }: { panorama: PanoramaResponse }) {
  const [aba, setAba] = useState<Sentimento>("neutro");
  const eixos = panorama.eixos ?? [];

  if (eixos.length === 0) {
    return <MensagemVazia>Ainda não há panorama para esta entidade.</MensagemVazia>;
  }

  const eixo = eixos.find((e) => e.eixo === aba);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Sentimento"
        className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800"
      >
        {SENTIMENTOS.map((s) => (
          <button
            key={s}
            id={`aba-${s}`}
            type="button"
            role="tab"
            aria-selected={aba === s}
            aria-controls="painel-panorama"
            onClick={() => setAba(s)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              aba === s
                ? "border-black text-black dark:border-white dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            {SENTIMENTO_LABEL[s]}
          </button>
        ))}
      </div>
      <div
        id="painel-panorama"
        role="tabpanel"
        aria-labelledby={`aba-${aba}`}
        className="py-6"
      >
        {eixo && (eixo.fontes ?? []).length > 0 ? (
          <EixoPanorama eixo={eixo} janela={panorama.janela} />
        ) : (
          <MensagemVazia>
            Não há panorama {SENTIMENTO_LABEL[aba].toLowerCase()} para este período.
          </MensagemVazia>
        )}
      </div>
    </div>
  );
}

function EixoPanorama({ eixo, janela }: { eixo: PanoramaEixo; janela?: string }) {
  const temas = eixo.temas ?? [];
  const avisos = eixo.avisos ?? [];
  const fontes = eixo.fontes ?? [];

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {janela && <>Panorama de {janelaPorExtenso(janela)} · </>}
        {formatarNumero(eixo.totalItens)} matérias
      </p>

      <figure className="rounded-lg border border-dashed border-zinc-400 bg-zinc-100 p-4 dark:border-zinc-600 dark:bg-zinc-900">
        <figcaption className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-600 dark:text-zinc-400">
          Gerado por IA · {eixo.modelo ?? "modelo não informado"}
        </figcaption>
        <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
          {eixo.texto}
        </p>
      </figure>

      {avisos.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
          <p className="mb-1 font-semibold">
            Divergências registradas na verificação automática
          </p>
          <ul className="list-disc pl-4">
            {avisos.map((aviso, i) => (
              <li key={i}>{aviso}</li>
            ))}
          </ul>
        </div>
      )}

      {temas.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-black dark:text-white">Temas</h3>
          <ul className="flex flex-col gap-2">
            {temas.map((tema, i) => (
              <li key={`${tema.tema}-${i}`}>
                <details className="rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
                  <summary className="cursor-pointer text-sm text-zinc-800 dark:text-zinc-200">
                    {tema.tema} · {formatarNumero(tema.ocorrencias)} ocorrências
                  </summary>
                  <ListaFontes fontes={tema.fontes ?? []} />
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold text-black dark:text-white">
          Fontes ({formatarNumero(fontes.length)})
        </h3>
        <ListaFontes fontes={fontes} />
      </section>
    </div>
  );
}

function ListaFontes({ fontes }: { fontes: Fonte[] }) {
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {fontes.map((fonte, i) => (
        <li key={`${fonte.itemId ?? fonte.url}-${i}`} className="text-xs">
          <a
            href={fonte.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-zinc-700 underline hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            {fonte.veiculo ?? dominio(fonte.url) ?? "Fonte"}
          </a>
          {dataCurta(fonte.dataPublicacao) && (
            <span className="text-zinc-500"> · {dataCurta(fonte.dataPublicacao)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
