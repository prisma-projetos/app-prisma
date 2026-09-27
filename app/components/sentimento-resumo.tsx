import type { ContagemSentimento, SentimentoResumoResponse } from "@/app/lib/api/types";
import { formatarNumero, formatarPercentual, nomeProprio } from "@/app/lib/formatacao";
import { periodoPorExtenso } from "@/app/lib/janela";
import { SENTIMENTO_COR, SENTIMENTO_LABEL, SENTIMENTOS } from "@/app/lib/sentimento";

const EXPLICACAO = { negativo: "critica", neutro: "só informa", positivo: "elogia" };

export function SentimentoResumo({ resumo, janela = "" }: { resumo: SentimentoResumoResponse; janela?: string }) {
  const periodo = periodoPorExtenso(janela);
  // Para partido, a API manda a sigla como nome: só nomes de pessoas são reformatados.
  const nome =
    (resumo.tipoEntidade === "politico" ? nomeProprio(resumo.nome) : resumo.nome?.trim()) || "esta entidade";
  const total = formatarNumero(resumo.totalParagrafos);
  const contagens = new Map<string, ContagemSentimento>(
    (resumo.porSentimento ?? []).map((c) => [c.sentimento ?? "", c])
  );
  const somaTotais = SENTIMENTOS.reduce((soma, s) => soma + (contagens.get(s)?.total ?? 0), 0);

  if (!resumo.totalParagrafos || somaTotais === 0) {
    return (
      <figure className="border border-dashed border-tinta p-6">
        <p className="font-semibold">Ainda não há parágrafos analisados sobre {nome}{janela && ` ${periodo}`}.</p>
        <p className="mt-2 text-tinta-2">Quando o PRISMA encontrar e analisar matérias que citam {nome}, o sentimento da cobertura aparece aqui.</p>
      </figure>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <p className="max-w-[65ch] text-[21px] leading-8">Análise automática de {total} parágrafos{janela && ` publicados ${periodo}`}, baseada em palavras positivas e negativas. O resultado pode conter erros.</p>
      <figure>
        <div role="img" aria-label={SENTIMENTOS.map(s => `${SENTIMENTO_LABEL[s]} ${formatarPercentual(contagens.get(s)?.percentual)}`).join(", ")} className="flex h-8 w-full overflow-hidden border border-tinta">
          {SENTIMENTOS.map(s => {
            const contagem = contagens.get(s)?.total ?? 0;
            return contagem > 0 ? <span key={s} data-sentimento={s} className={SENTIMENTO_COR[s]} style={{ width: `${contagem / somaTotais * 100}%` }} /> : null;
          })}
        </div>
        <table className="mt-4 w-full tabular-nums text-base">
          <caption className="sr-only">Parágrafos por sentimento</caption>
          <thead className="sr-only"><tr><th>Sentimento</th><th>Parágrafos</th><th>Percentual</th></tr></thead>
          <tbody>
            {SENTIMENTOS.map(s => <tr key={s} data-sentimento={s} className="grid grid-cols-[1fr_auto] gap-x-3 border-b border-fio py-3 sm:table-row sm:py-0">
              <th scope="row" className="text-left font-normal sm:py-4 sm:pr-2">
                <span aria-hidden="true" className={`mr-2 inline-block h-3 w-3 border border-tinta ${SENTIMENTO_COR[s]}`} />
                <span className="font-semibold">{SENTIMENTO_LABEL[s]}</span>{" "}<span className="text-tinta-2">({EXPLICACAO[s]})</span>
              </th>
              <td className="col-start-1 row-start-2 whitespace-nowrap pl-5 text-left text-tinta-2 sm:py-4 sm:pl-0 sm:pr-3 sm:text-right">{formatarNumero(contagens.get(s)?.total)} parágrafos</td>
              <td className="col-start-2 row-span-2 row-start-1 self-center whitespace-nowrap text-right sm:py-4">{formatarPercentual(contagens.get(s)?.percentual)}</td>
            </tr>)}
          </tbody>
        </table>
        <figcaption className="mt-4 text-[15px] font-semibold leading-[22px] text-tinta-2"><span className="mr-1 text-tinta [font-variant-caps:all-small-caps] tracking-[0.06em]">Fig. 1</span> Parágrafos sobre {nome} por sentimento, {periodo}. Base: {total} parágrafos de matérias que citam {nome}.</figcaption>
      </figure>
      <details className="max-w-[760px] border-l border-tinta bg-papel-2 px-8 py-6">
        <summary className="min-h-12 text-[21px] font-bold">Saiba mais: como esta análise funciona</summary>
        <div className="mt-4 flex max-w-[70ch] flex-col gap-4">
          <p>O sistema compara a quantidade de palavras positivas e negativas em cada parágrafo que cita o partido ou o candidato. Quando as contagens empatam, ou quando nenhuma palavra da lista aparece, o parágrafo conta como neutro.</p>
          <p>A classificação vale para o parágrafo inteiro. Se um parágrafo cita mais de um partido ou candidato, todos recebem a mesma classificação.</p>
          <p>Positivo não quer dizer que o partido ou o candidato é bom, e negativo não quer dizer que é ruim. Isso também não mede opinião pública nem imparcialidade da imprensa: mostra só o tom das palavras no texto.</p>
          <p>O método é experimental: a lista de palavras não foi validada cientificamente e pode errar com ironia, negação ou citações.</p>
          {(resumo.proveniencia ?? []).length ? resumo.proveniencia!.map((p, i) => <p key={i} className="text-base text-tinta-2">Detalhes técnicos: método {p.metodo || "não informado"}, versão {p.pipelineVersion || "não informada"}.</p>) : <p className="text-base text-tinta-2">Detalhes técnicos: método não informado.</p>}
        </div>
      </details>
    </div>
  );
}
