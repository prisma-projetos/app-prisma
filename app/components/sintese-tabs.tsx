"use client";

import { useState } from "react";
import type { Sintese, Trecho, TrechoInformativo, TrechoTipo } from "@/app/lib/types";

type Aba = "sobre" | "elogios" | "criticas";

const ABAS: { id: Aba; label: string }[] = [
  { id: "sobre", label: "Sobre" },
  { id: "elogios", label: "Elogios" },
  { id: "criticas", label: "Críticas" },
];

const TIPO_LABEL: Record<TrechoTipo, string> = {
  fato: "Fato",
  opiniao_autor: "Opinião do autor",
  inferencia_modelo: "Inferência do modelo",
};

const TIPO_CLASSES: Record<TrechoTipo, string> = {
  fato: "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-100",
  opiniao_autor:
    "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100",
  inferencia_modelo:
    "border-purple-300 bg-purple-50 text-purple-900 dark:border-purple-800 dark:bg-purple-950 dark:text-purple-100",
};

export function SinteseTabs({ sintese }: { sintese: Sintese }) {
  const [aba, setAba] = useState<Aba>("sobre");

  return (
    <div>
      <div
        role="tablist"
        className="flex gap-2 border-b border-zinc-200 dark:border-zinc-800"
      >
        {ABAS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={aba === item.id}
            onClick={() => setAba(item.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors ${
              aba === item.id
                ? "border-black text-black dark:border-white dark:text-white"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="py-6">
        {aba === "sobre" && <SobreLista trechos={sintese.sobre} />}
        {aba === "elogios" && (
          <TrechosLista
            trechos={sintese.elogios}
            vazio="Nenhum trecho de elogio disponível."
          />
        )}
        {aba === "criticas" && (
          <TrechosLista
            trechos={sintese.criticas}
            vazio="Nenhum trecho de crítica disponível."
          />
        )}
      </div>
    </div>
  );
}

function SobreLista({ trechos }: { trechos: TrechoInformativo[] }) {
  if (trechos.length === 0) {
    return (
      <p className="text-sm text-zinc-500">Nenhuma informação disponível.</p>
    );
  }
  return (
    <ul className="flex flex-col gap-4">
      {trechos.map((trecho, i) => (
        <li
          key={i}
          className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
        >
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {trecho.texto}
          </p>
          <a
            href={trecho.fonteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-medium text-zinc-500 underline hover:text-zinc-800 dark:hover:text-zinc-300"
          >
            Fonte: {trecho.fonteTitulo}
          </a>
        </li>
      ))}
    </ul>
  );
}

function TrechosLista({
  trechos,
  vazio,
}: {
  trechos: Trecho[];
  vazio: string;
}) {
  if (trechos.length === 0) {
    return <p className="text-sm text-zinc-500">{vazio}</p>;
  }
  return (
    <ul className="flex flex-col gap-4">
      {trechos.map((trecho, i) => (
        <li key={i} className={`rounded-lg border p-4 ${TIPO_CLASSES[trecho.tipo]}`}>
          <span className="mb-2 inline-block rounded-full bg-white/60 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide dark:bg-black/20">
            {TIPO_LABEL[trecho.tipo]}
          </span>
          <p className="text-sm">{trecho.texto}</p>
          <a
            href={trecho.fonteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-xs font-medium underline opacity-80 hover:opacity-100"
          >
            Fonte: {trecho.fonteTitulo}
          </a>
        </li>
      ))}
    </ul>
  );
}
