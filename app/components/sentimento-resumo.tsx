import type { ContagemSentimento, SentimentoResumoResponse } from "@/app/lib/api/types";
import { formatarNumero, formatarPercentual } from "@/app/lib/formatacao";
import { SENTIMENTO_COR, SENTIMENTO_LABEL, SENTIMENTOS } from "@/app/lib/sentimento";
import { MensagemVazia } from "./estados";

export function SentimentoResumo({ resumo }: { resumo: SentimentoResumoResponse }) {
  const contagens = new Map<string, ContagemSentimento>(
    (resumo.porSentimento ?? []).map((c) => [c.sentimento ?? "", c])
  );
  const somaTotais = SENTIMENTOS.reduce(
    (soma, s) => soma + (contagens.get(s)?.total ?? 0),
    0
  );

  if (!resumo.totalParagrafos || somaTotais === 0) {
    return (
      <MensagemVazia>Ainda não há parágrafos analisados sobre esta entidade.</MensagemVazia>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="flex h-4 w-full gap-0.5 overflow-hidden rounded-full"
        aria-hidden="true"
      >
        {SENTIMENTOS.map((s) => {
          const total = contagens.get(s)?.total ?? 0;
          if (total === 0) return null;
          return (
            <span
              key={s}
              data-sentimento={s}
              className={SENTIMENTO_COR[s]}
              style={{ width: `${(total / somaTotais) * 100}%` }}
            />
          );
        })}
      </div>

      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
        {SENTIMENTOS.map((s) => {
          const contagem = contagens.get(s);
          return (
            <li key={s} data-sentimento={s} className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`inline-block h-3 w-3 rounded-sm ${SENTIMENTO_COR[s]}`}
              />
              <span className="font-medium text-zinc-800 dark:text-zinc-200">
                {SENTIMENTO_LABEL[s]}
              </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {formatarPercentual(contagem?.percentual)} ·{" "}
                {formatarNumero(contagem?.total)} parágrafos
              </span>
            </li>
          );
        })}
      </ul>

      <p className="text-xs text-zinc-500">
        Baseado em {formatarNumero(resumo.totalParagrafos)} parágrafos
        {(resumo.proveniencia ?? []).map((p, i) => (
          <span key={i}>
            {" "}
            · método {p.metodo ?? "desconhecido"}
            {p.pipelineVersion && ` (versão ${p.pipelineVersion})`}
          </span>
        ))}
      </p>
    </div>
  );
}
