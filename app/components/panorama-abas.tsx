"use client";

import { useId, useState } from "react";
import type { Fonte, PanoramaEixo, PanoramaResponse, Sentimento } from "@/app/lib/api/types";
import { dataCurta, dominio, formatarNumero, janelaPorExtenso } from "@/app/lib/formatacao";
import { SENTIMENTO_LABEL, SENTIMENTOS } from "@/app/lib/sentimento";
import { MensagemVazia } from "./estados";

export function PanoramaAbas({ panorama }: { panorama: PanoramaResponse }) {
  const id = useId();
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
        className="flex border-b border-fio"
      >
        {SENTIMENTOS.map((s) => (
          <button
            key={s}
            id={`${id}-aba-${s}`}
            type="button"
            role="tab"
            aria-selected={aba === s}
            aria-controls={`${id}-painel-panorama`}
            tabIndex={aba === s ? 0 : -1}
            onKeyDown={(event) => {
              const index = SENTIMENTOS.indexOf(s);
              const destinos: Record<string, number> = { ArrowRight: (index + 1) % 3, ArrowLeft: (index + 2) % 3, Home: 0, End: 2 };
              const next = destinos[event.key];
              if (next === undefined) return;
              event.preventDefault();
              setAba(SENTIMENTOS[next]);
              document.getElementById(`${id}-aba-${SENTIMENTOS[next]}`)?.focus();
            }}
            onClick={() => setAba(s)}
            className={`relative min-h-12 flex-1 px-2 py-3 text-base ${
              aba === s
                ? "nav-ativo font-bold text-tinta"
                : "text-tinta-2 hover:bg-papel-2"
            }`}
          >
            {SENTIMENTO_LABEL[s]}<span className="block text-base font-normal"> ({formatarNumero(eixos.find(e => e.eixo === s)?.totalItens)} matérias)</span>
          </button>
        ))}
      </div>
      <div
        id={`${id}-painel-panorama`}
        role="tabpanel"
        aria-labelledby={`${id}-aba-${aba}`}
        className="py-6"
      >
        {eixo && (eixo.fontes ?? []).length > 0 ? (
          // key por aba: cada aba abre com fontes e temas recolhidos
          <EixoPanorama key={aba} eixo={eixo} janela={panorama.janela} />
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
      <p className="text-base text-tinta-2">
        {janela && <>Panorama de {janelaPorExtenso(janela)} · </>}
        {formatarNumero(eixo.totalItens)} matérias
      </p>

      <figure className="border-l border-tinta bg-papel-2 p-6">
        <figcaption className="mb-4 text-[15px] font-semibold text-tinta-2">
          Gerado por IA · {eixo.modelo ?? "modelo não informado"}
        </figcaption>
        <p className="max-w-[70ch] leading-7 text-tinta">
          {eixo.texto}
        </p>
      </figure>

      {avisos.length > 0 && (
        <div className="border border-tinta p-4 text-base text-tinta-2">
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
          <h3 className="text-[21px] font-bold text-tinta">Temas</h3>
          <ul className="flex flex-col gap-2">
            {temas.map((tema, i) => (
              <li key={`${tema.tema}-${i}`}>
                <details className="border-b border-fio py-2">
                  <summary className="min-h-12 cursor-pointer py-3 text-tinta">
                    {tema.tema} · {formatarNumero(tema.ocorrencias)} ocorrências
                  </summary>
                  <ListaFontes fontes={tema.fontes ?? []} />
                </details>
              </li>
            ))}
          </ul>
        </section>
      )}

      <details className="border-b border-fio py-2">
        <summary className="min-h-12 cursor-pointer py-3 font-semibold text-tinta">
          Fontes ({formatarNumero(fontes.length)})
        </summary>
        <ListaFontes fontes={fontes} agrupadas />
      </details>
    </div>
  );
}

function urlSegura(url?: string): URL | undefined {
  try {
    const parsed = new URL(url ?? "");
    return ["http:", "https:"].includes(parsed.protocol) ? parsed : undefined;
  } catch { return undefined; }
}

function LinkExterno({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-12 items-center gap-2 py-2 text-tinta underline underline-offset-4 hover:decoration-2">
    <span>{children}<span className="sr-only"> (abre em nova aba)</span></span>
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 shrink-0"><path d="M6 18 18 6M6 6h12v12" /></svg>
  </a>;
}

function Materia({ fonte }: { fonte: Fonte }) {
  const url = urlSegura(fonte.url);
  const veiculo = fonte.veiculo?.trim() || dominio(fonte.url);
  const data = dataCurta(fonte.dataPublicacao);
  return <li className="border-b border-fio py-2 text-base">
    {url ? <LinkExterno href={fonte.url!}>Ler matéria publicada por {veiculo}</LinkExterno> : <span>Ler matéria</span>}
    {data && <span className="block text-tinta-2">{data}</span>}
  </li>;
}

function ListaFontes({ fontes, agrupadas = false }: { fontes: Fonte[]; agrupadas?: boolean }) {
  if (!agrupadas) return <ul className="mt-2">{fontes.map((fonte, i) => <Materia key={`${fonte.itemId ?? fonte.url}-${i}`} fonte={fonte} />)}</ul>;
  const grupos = new Map<string, { origem?: string; fontes: Fonte[] }>();
  for (const fonte of fontes) {
    const url = urlSegura(fonte.url);
    const nome = url ? fonte.veiculo?.trim() || dominio(fonte.url)! : "Outros";
    const grupo = grupos.get(nome) ?? { origem: url ? `${url.origin}/` : undefined, fontes: [] };
    grupo.fontes.push(fonte);
    grupos.set(nome, grupo);
  }
  const data = (fonte: Fonte) => Date.parse(fonte.dataPublicacao ?? "") || 0;
  return <div className="mt-4 space-y-6">{[...grupos].sort(([a], [b]) => a.localeCompare(b, "pt-BR")).map(([nome, grupo]) => <section key={nome}>
    <h4 className="font-semibold">{grupo.origem ? <><LinkExterno href={grupo.origem}>{nome}<span className="font-normal text-tinta-2"> · página inicial</span></LinkExterno></> : nome}</h4>
    <ul>{grupo.fontes.sort((a, b) => data(b) - data(a)).map((fonte, i) => <Materia key={`${fonte.itemId ?? fonte.url}-${i}`} fonte={fonte} />)}</ul>
  </section>)}</div>;
}
