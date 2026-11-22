"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAnalisePorTema, usePanorama, useSentimento } from "@/app/lib/api/hooks";
import type { ConsultaRequest } from "@/app/lib/api/types";
import { janelaPorExtenso } from "@/app/lib/formatacao";
import { intervaloDaJanela, lerJanela, mesesDisponiveis } from "@/app/lib/janela";
import { Disclaimer } from "./disclaimer";
import { CampoSelect } from "./campo-select";
import { ErroCarregamento, Skeleton } from "./estados";
import { PanoramaAbas } from "./panorama-abas";
import { Secao } from "./secao";
import { SentimentoResumo } from "./sentimento-resumo";
import { TemasCitados } from "./temas-citados";

/** Seletor de janela + disclaimer + sentimento + temas + panorama, comuns a partido e político. */
export function AnaliseEntidade({ entidade }: { entidade: ConsultaRequest }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const meses = mesesDisponiveis();
  const janela = lerJanela(searchParams.get("janela"), meses);
  // Mês antigo vindo de link compartilhado entra como opção extra no fim.
  const opcoes = janela && !meses.includes(janela) ? [...meses, janela] : meses;

  // A API filtra sentimento e temas por datas; `janela` só vale para o panorama (spec 018).
  const porDatas: ConsultaRequest = janela ? { ...entidade, ...intervaloDaJanela(janela) } : entidade;
  const sentimento = useSentimento(porDatas);
  const temas = useAnalisePorTema(porDatas);
  const panorama = usePanorama(janela ? { ...entidade, janela } : entidade);

  function escolher(valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set("janela", valor);
    else params.delete("janela");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <>
      <label className="flex max-w-[420px] flex-col gap-2 text-corpo font-semibold">
        Janela (mês das matérias)
        <CampoSelect
          value={janela}
          onChange={(evento) => escolher(evento.target.value)}
          className="min-h-14 border-2 border-tinta bg-papel px-4 py-3 text-corpo font-normal text-tinta"
        >
          <option value="">Todo o período</option>
          {opcoes.map((mes) => (
            <option key={mes} value={mes}>
              {janelaPorExtenso(mes)}
            </option>
          ))}
        </CampoSelect>
      </label>

      {/* Grade de livro (DESIGN.md): texto de até 792px, medianiz de 96px e margem de 360px. */}
      <div className="grid gap-16 lg:grid-cols-[minmax(0,792px)_360px] lg:gap-24">
        <div className="flex min-w-0 flex-col gap-16">
      <Disclaimer />

      <Secao id="titulo-sentimento" titulo="Sentimento da cobertura">
        {sentimento.isPending && <Skeleton className="h-16 w-full" />}
        {sentimento.isError && (
          <ErroCarregamento onTentarDeNovo={() => sentimento.refetch()} />
        )}
        {sentimento.data && <SentimentoResumo resumo={sentimento.data} janela={janela} />}
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
        {temas.data && <TemasCitados resposta={temas.data} janela={janela} />}
      </Secao>

      <Secao id="titulo-panorama" titulo="Panorama">
        {panorama.isPending && <Skeleton className="h-40 w-full" />}
        {panorama.isError && (
          <ErroCarregamento onTentarDeNovo={() => panorama.refetch()} />
        )}
        {panorama.data && <PanoramaAbas panorama={panorama.data} janelaEscolhida={janela} />}
      </Secao>
        </div>
        <Glossario />
      </div>
    </>
  );
}

const TERMOS: [string, string][] = [
  ["Parágrafo", "Parte de uma matéria que cita o partido ou o candidato. É o que se conta no sentimento."],
  ["Sentimento", "Negativo se o parágrafo critica, neutro se só informa, positivo se elogia."],
  ["Tema", "Assunto identificado na matéria. Uma matéria pode ter vários."],
  ["Janela", "O mês das matérias consideradas."],
  ["Panorama", "Resumo, gerado por IA, do que as matérias de cada sentimento dizem."],
  ["Fonte", "A matéria de um veículo que sustenta um panorama."],
];

/** Margem de glossário (spec 024): acompanha a leitura no desktop e vem depois da análise no celular. */
function Glossario() {
  return (
    <aside aria-labelledby="titulo-glossario" className="self-start border-t-[3px] border-tinta pt-6 lg:sticky lg:top-8">
      <h2 id="titulo-glossario" className="mb-4 text-titulo-3 text-tinta">
        Palavras desta página
      </h2>
      <dl className="flex flex-col">
        {TERMOS.map(([termo, definicao]) => (
          <div key={termo} className="border-b border-fio py-3">
            <dt className="text-corpo font-semibold text-tinta">{termo}</dt>
            <dd className="text-apoio text-tinta-2">{definicao}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
