"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Secao } from "@/app/components/secao";
import { EntidadeAvatar } from "@/app/components/entidade-avatar";
import { ErroCarregamento, GradeSkeleton, MensagemVazia } from "@/app/components/estados";
import { usePoliticos } from "@/app/lib/api/hooks";
import { CARGOS, lerCargo } from "@/app/lib/cargos";
import { ANO_ELEICAO, POLITICOS_POR_PAGINA } from "@/app/lib/config";
import { formatarNumero, nomeProprio } from "@/app/lib/formatacao";
import { lerPagina } from "@/app/lib/identificadores";

const DEBOUNCE_BUSCA_MS = 300;

interface Filtros {
  q: string;
  cargo: string;
  pagina: number;
}

export function PoliticosDoPartido({ nrPartido }: { nrPartido: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const cargo = lerCargo(searchParams.get("cargo"));
  const pagina = lerPagina(searchParams.get("pagina"));
  const [busca, setBusca] = useState(q);

  const politicos = usePoliticos({
    nrPartido,
    anoEleicao: ANO_ELEICAO,
    cargo: cargo || undefined,
    q: q || undefined,
    pagina,
    tamanho: POLITICOS_POR_PAGINA,
  });

  /** Atualiza a URL mantendo os filtros não informados; mudar filtro volta à página 0. */
  function navegar(mudancas: Partial<Filtros>) {
    const filtros: Filtros = { q, cargo, pagina: 0, ...mudancas };
    const params = new URLSearchParams(searchParams.toString());
    definir(params, "q", filtros.q);
    definir(params, "cargo", filtros.cargo);
    definir(params, "pagina", filtros.pagina > 0 ? String(filtros.pagina) : "");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  useEffect(() => {
    const termo = busca.trim();
    if (termo === q) return;
    const timer = setTimeout(() => navegar({ q: termo }), DEBOUNCE_BUSCA_MS);
    return () => clearTimeout(timer);
    // navegar só depende de valores já listados aqui
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, q, cargo]);

  const dados = politicos.data;
  const candidatos = dados?.content ?? [];
  const totalPaginas = dados?.totalPages ?? 0;
  // Enquanto a página nova carrega, first/last ainda são da anterior.
  const carregandoPagina = politicos.isPlaceholderData;
  const paginaForaDoTotal =
    !carregandoPagina && pagina > 0 && pagina >= totalPaginas && dados !== undefined;

  // ?pagina= além do total (link antigo ou editado à mão) volta para a primeira página.
  useEffect(() => {
    if (paginaForaDoTotal) navegar({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginaForaDoTotal, q, cargo]);

  return (
    <Secao id="titulo-politicos" titulo={`Candidatos em ${ANO_ELEICAO}`}>
      {dados && (
        <span className="text-apoio text-tinta-2">
          {formatarNumero(dados.totalElements)} candidatos
        </span>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar por nome"
          aria-label="Buscar candidato por nome"
          className="min-h-14 min-w-0 flex-1 border-2 border-tinta bg-papel px-4 py-3 text-corpo text-tinta placeholder:text-tinta-3"
        />
        <label className="flex min-w-0 flex-col gap-2 text-apoio text-tinta-2">
          Cargo
          <select
            value={cargo}
            onChange={(e) => navegar({ cargo: e.target.value })}
            className="min-h-14 min-w-0 border-2 border-tinta bg-papel px-4 py-3 text-corpo text-tinta"
          >
            <option value="">Todos os cargos</option>
            {CARGOS.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.rotulo}
              </option>
            ))}
          </select>
        </label>
      </div>

      {politicos.isPending && <GradeSkeleton itens={12} circular />}
      {politicos.isError && (
        <ErroCarregamento onTentarDeNovo={() => politicos.refetch()} />
      )}
      {dados && candidatos.length === 0 && (
        <MensagemVazia>Nenhum político encontrado.</MensagemVazia>
      )}
      {candidatos.length > 0 && (
        <ul
          className={`grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 ${
            carregandoPagina ? "opacity-60" : ""
          }`}
        >
          {candidatos.map((candidato) => (
            <li key={candidato.tituloEleitoral}>
              <Link href={`/politicos/${candidato.tituloEleitoral}`} aria-label={nomeProprio(candidato.nome)} className="flex min-h-12 justify-center py-4 text-tinta underline hover:bg-papel-2 hover:decoration-2">
                <EntidadeAvatar
                  nome={nomeProprio(candidato.nome)}
                  imagemUrl={candidato.urlFoto}
                  variante="politico"
                  mostrarNome
                />
              </Link>
            </li>
          ))}
        </ul>
      )}

      {dados && totalPaginas > 1 && (
        <nav aria-label="Paginação" className="flex flex-wrap items-center justify-between gap-3 text-apoio">
          <button
            type="button"
            onClick={() => navegar({ pagina: pagina - 1 })}
            disabled={carregandoPagina || (dados.first ?? pagina === 0)}
            className="min-h-12 border-2 border-tinta px-4 py-2 text-corpo font-semibold hover:bg-papel-2 disabled:cursor-default disabled:border-fio disabled:text-tinta-3 disabled:hover:bg-transparent"
          >
            Anterior
          </button>
          <span className="text-tinta-2">
            Página {pagina + 1} de {totalPaginas}
          </span>
          <button
            type="button"
            onClick={() => navegar({ pagina: pagina + 1 })}
            disabled={carregandoPagina || (dados.last ?? pagina >= totalPaginas - 1)}
            className="min-h-12 border-2 border-tinta px-4 py-2 text-corpo font-semibold hover:bg-papel-2 disabled:cursor-default disabled:border-fio disabled:text-tinta-3 disabled:hover:bg-transparent"
          >
            Próxima
          </button>
        </nav>
      )}
    </Secao>
  );
}

function definir(params: URLSearchParams, nome: string, valor: string) {
  if (valor) params.set(nome, valor);
  else params.delete(nome);
}
