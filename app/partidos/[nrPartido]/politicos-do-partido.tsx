"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { EntidadeAvatar } from "@/app/components/entidade-avatar";
import { ErroCarregamento, GradeSkeleton, MensagemVazia } from "@/app/components/estados";
import { usePoliticos } from "@/app/lib/api/hooks";
import { ANO_ELEICAO, POLITICOS_POR_PAGINA } from "@/app/lib/config";
import { formatarNumero } from "@/app/lib/formatacao";
import { lerPagina } from "@/app/lib/identificadores";

const DEBOUNCE_BUSCA_MS = 300;

export function PoliticosDoPartido({ nrPartido }: { nrPartido: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const pagina = lerPagina(searchParams.get("pagina"));
  const [busca, setBusca] = useState(q);

  const politicos = usePoliticos({
    nrPartido,
    anoEleicao: ANO_ELEICAO,
    q: q || undefined,
    pagina,
    tamanho: POLITICOS_POR_PAGINA,
  });

  function navegar(novoQ: string, novaPagina: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (novoQ) params.set("q", novoQ);
    else params.delete("q");
    if (novaPagina > 0) params.set("pagina", String(novaPagina));
    else params.delete("pagina");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  useEffect(() => {
    const termo = busca.trim();
    if (termo === q) return;
    const timer = setTimeout(() => navegar(termo, 0), DEBOUNCE_BUSCA_MS);
    return () => clearTimeout(timer);
    // navegar só depende de valores já listados aqui
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, q]);

  const dados = politicos.data;
  const candidatos = dados?.content ?? [];
  const totalPaginas = dados?.totalPages ?? 0;
  // Enquanto a página nova carrega, first/last ainda são da anterior.
  const carregandoPagina = politicos.isPlaceholderData;
  const paginaForaDoTotal =
    !carregandoPagina && pagina > 0 && pagina >= totalPaginas && dados !== undefined;

  // ?pagina= além do total (link antigo ou editado à mão) volta para a primeira página.
  useEffect(() => {
    if (paginaForaDoTotal) navegar(q, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaForaDoTotal, q]);

  return (
    <section className="flex flex-col gap-4" aria-labelledby="titulo-politicos">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="titulo-politicos" className="text-lg font-semibold text-black dark:text-white">
          Candidatos em {ANO_ELEICAO}
        </h2>
        {dados && (
          <span className="text-sm text-zinc-500">
            {formatarNumero(dados.totalElements)} candidatos
          </span>
        )}
      </div>

      <input
        type="search"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar por nome"
        aria-label="Buscar candidato por nome"
        className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950"
      />

      {politicos.isPending && <GradeSkeleton itens={12} circular />}
      {politicos.isError && (
        <ErroCarregamento onTentarDeNovo={() => politicos.refetch()} />
      )}
      {dados && candidatos.length === 0 && (
        <MensagemVazia>Nenhum político encontrado.</MensagemVazia>
      )}
      {candidatos.length > 0 && (
        <ul
          className={`flex flex-wrap gap-8 transition-opacity ${
            carregandoPagina ? "opacity-60" : ""
          }`}
        >
          {candidatos.map((candidato) => (
            <li key={candidato.tituloEleitoral}>
              <Link href={`/politicos/${candidato.tituloEleitoral}`} aria-label={candidato.nome}>
                <EntidadeAvatar
                  nome={candidato.nome ?? ""}
                  imagemUrl={candidato.urlFoto}
                  variante="politico"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {dados && totalPaginas > 1 && (
        <nav aria-label="Paginação" className="flex items-center justify-between gap-4 text-sm">
          <button
            type="button"
            onClick={() => navegar(q, pagina - 1)}
            disabled={carregandoPagina || (dados.first ?? pagina === 0)}
            className="rounded-md border border-zinc-300 px-3 py-1 disabled:opacity-40 dark:border-zinc-700"
          >
            Anterior
          </button>
          <span className="text-zinc-600 dark:text-zinc-400">
            Página {pagina + 1} de {totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => navegar(q, pagina + 1)}
            disabled={carregandoPagina || (dados.last ?? pagina >= totalPaginas - 1)}
            className="rounded-md border border-zinc-300 px-3 py-1 disabled:opacity-40 dark:border-zinc-700"
          >
            Próxima
          </button>
        </nav>
      )}
    </section>
  );
}
