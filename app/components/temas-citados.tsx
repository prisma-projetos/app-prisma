"use client";

import { useState } from "react";
import type { AnalisePorTemaResponse } from "@/app/lib/api/types";
import { formatarNumero, formatarPercentual, nomeProprio } from "@/app/lib/formatacao";
import { periodoPorExtenso } from "@/app/lib/janela";

const LIMITE = 10;

const BOTAO_VISAO =
  "min-h-12 px-5 text-apoio font-semibold aria-pressed:bg-tinta aria-pressed:text-papel hover:bg-papel-2 aria-pressed:hover:bg-tinta";

/** Fig. 2: em quantas matérias cada tema aparece, em barras ou tabela (spec 017). */
export function TemasCitados({ resposta, janela = "" }: { resposta: AnalisePorTemaResponse; janela?: string }) {
  const periodo = periodoPorExtenso(janela);
  const [visao, setVisao] = useState<"grafico" | "tabela">("grafico");
  const [todos, setTodos] = useState(false);
  const temas = resposta.temas ?? [];
  // Para partido, a API manda a sigla como nome: só nomes de pessoas são reformatados.
  const nome =
    (resposta.tipo === "politico" ? nomeProprio(resposta.nome) : resposta.nome?.trim()) || "esta entidade";

  if (temas.length === 0) {
    return (
      <div className="border border-dashed border-tinta p-6">
        <p className="font-semibold">Ainda não há temas identificados sobre {nome}{janela && ` ${periodo}`}.</p>
        <p className="mt-2 text-tinta-2">Quando houver matérias analisadas sobre {nome}, os temas mais citados aparecem aqui.</p>
      </div>
    );
  }

  const exibidos = todos ? temas : temas.slice(0, LIMITE);
  const maior = Math.max(...exibidos.map((t) => t.total ?? 0), 1);

  return (
    <figure className="flex flex-col gap-6">
      <div role="group" aria-label="Forma de ver os temas" className="inline-flex self-start border-2 border-tinta">
        <button type="button" aria-pressed={visao === "grafico"} onClick={() => setVisao("grafico")} className={BOTAO_VISAO}>
          Gráfico
        </button>
        <button type="button" aria-pressed={visao === "tabela"} onClick={() => setVisao("tabela")} className={BOTAO_VISAO}>
          Tabela
        </button>
      </div>

      {visao === "grafico" ? (
        <ol aria-label="Temas" className="flex flex-col gap-3">
          {exibidos.map((t, i) => (
            <li key={`${t.tema}-${i}`} className="grid gap-x-4 gap-y-1 sm:grid-cols-[minmax(0,260px)_1fr] sm:items-center">
              <span data-tema className="text-corpo text-tinta [overflow-wrap:anywhere]">
                {t.tema}
              </span>
              <span className="flex items-center gap-3">
                {/* A barra ocupa a proporção da trilha menos o espaço do número, que vem logo depois dela. */}
                <span
                  data-barra
                  data-proporcao={(t.total ?? 0) / maior}
                  aria-hidden="true"
                  className="block h-6 min-w-1 shrink-0 bg-grafico"
                  style={{ width: `calc((100% - 4rem) * ${(t.total ?? 0) / maior})` }}
                />
                <span className="text-corpo tabular-nums text-tinta">{formatarNumero(t.total)}</span>
              </span>
            </li>
          ))}
        </ol>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-corpo tabular-nums">
            <caption className="sr-only">Temas mais citados</caption>
            <thead className="border-b border-tinta text-apoio text-tinta-2">
              <tr>
                <th scope="col" className="py-3 pr-4 font-normal">Tema</th>
                <th scope="col" className="py-3 pr-4 text-right font-normal">Matérias</th>
                <th scope="col" className="py-3 text-right font-normal">% das matérias</th>
              </tr>
            </thead>
            <tbody>
              {exibidos.map((t, i) => (
                <tr key={`${t.tema}-${i}`} className="border-b border-fio">
                  <th scope="row" className="py-3 pr-4 font-normal">{t.tema}</th>
                  <td className="py-3 pr-4 text-right">{formatarNumero(t.total)}</td>
                  <td className="py-3 text-right">{formatarPercentual(t.percentual)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {temas.length > LIMITE && (
        <button
          type="button"
          onClick={() => setTodos((atual) => !atual)}
          className="min-h-12 self-start text-corpo font-semibold text-tinta underline underline-offset-4"
        >
          {todos ? `Mostrar só os ${LIMITE} primeiros` : `Ver todos os ${formatarNumero(temas.length)} temas`}
        </button>
      )}

      <figcaption className="text-legenda text-tinta-2">
        <span className="mr-1 text-tinta [font-variant-caps:all-small-caps] tracking-[0.06em]">Fig. 2</span>{" "}
        Em quantas matérias cada tema aparece, {periodo}. Base: {formatarNumero(resposta.totalMaterias)} matérias;{" "}
        {formatarNumero(resposta.semTema)} sem tema identificado. Uma matéria pode ter mais de um tema.
      </figcaption>
    </figure>
  );
}
