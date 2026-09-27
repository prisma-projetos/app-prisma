"use client";

import Link from "next/link";
import { usePartidos } from "@/app/lib/api/hooks";
import { nomeProprio } from "@/app/lib/formatacao";
import { EntidadeAvatar } from "./entidade-avatar";
import { ErroCarregamento, GradeSkeleton, MensagemVazia } from "./estados";

export function ListaPartidos() {
  const { data, isPending, isError, refetch } = usePartidos();

  if (isPending) return <GradeSkeleton itens={12} circular={false} />;
  if (isError) return <ErroCarregamento onTentarDeNovo={() => refetch()} />;

  const partidos = [...data].sort((a, b) =>
    (a.sigla ?? "").localeCompare(b.sigla ?? "", "pt-BR")
  );

  // Primeira ficha de cada letra inicial recebe a âncora do índice (spec 024).
  const letras: string[] = [];
  const ancoras = new Map<number, string>();
  for (const partido of partidos) {
    const letra = (partido.sigla ?? "").charAt(0).toLocaleUpperCase("pt-BR");
    if (letra && !letras.includes(letra)) {
      letras.push(letra);
      ancoras.set(partido.numero ?? -1, letra);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <p className="text-xl text-tinta-2">
        {partidos.length} partidos, em ordem alfabética pela sigla.
      </p>
      {partidos.length > 0 && <IndicePorLetra letras={letras} />}
      {partidos.length === 0 ? (
        <MensagemVazia>Nenhum partido encontrado.</MensagemVazia>
      ) : (
        <ul className="grid grid-cols-2 gap-px border-y border-fio bg-fio sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {partidos.map((partido) => {
            const sigla = partido.sigla || `Partido nº ${partido.numero}`;
            const nome = nomeProprio(partido.nome);
            return (
              <li
                key={partido.numero}
                id={ancoras.has(partido.numero ?? -1) ? `letra-${ancoras.get(partido.numero ?? -1)}` : undefined}
                className="min-w-0 scroll-mt-8 bg-papel"
              >
                <Link
                  href={`/partidos/${partido.numero}`}
                  aria-label={[sigla, nome, `número ${partido.numero}`].filter(Boolean).join(", ")}
                  className="flex h-full flex-col items-start gap-3 break-words px-3 py-6 hover:bg-papel-2 sm:px-5"
                >
                  <EntidadeAvatar nome={sigla} imagemUrl={partido.urlLogo} variante="partido" tamanho={64} />
                  <span
                    className={`min-w-0 max-w-full font-bold text-tinta ${
                      // Siglas longas (ex.: SOLIDARIEDADE) cabem inteiras na coluna de 390px.
                      sigla.length > 9 ? "text-base leading-6 sm:text-[21px] sm:leading-7" : "text-[21px] leading-7"
                    }`}
                  >
                    {sigla}
                  </span>
                  {nome && <span className="min-w-0 max-w-full [overflow-wrap:anywhere] text-base leading-6 text-tinta-2">{nome}</span>}
                  <span className="mt-auto text-base text-tinta-3">nº {partido.numero}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function IndicePorLetra({ letras }: { letras: string[] }) {
  return (
    <nav aria-label="Ir para a letra" className="flex flex-wrap items-center gap-2">
      <span className="mr-2 text-apoio text-tinta-2" aria-hidden="true">
        Ir para a letra
      </span>
      {letras.map((letra) => (
        <a
          key={letra}
          href={`#letra-${letra}`}
          className="inline-flex min-h-12 min-w-12 items-center justify-center border border-fio text-corpo font-semibold text-tinta hover:bg-papel-2"
        >
          {letra}
        </a>
      ))}
    </nav>
  );
}
