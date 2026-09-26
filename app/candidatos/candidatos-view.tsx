"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { EntidadeAvatar } from "@/app/components/entidade-avatar";
import { ErroCarregamento, Skeleton } from "@/app/components/estados";
import { usePartidos, usePoliticos } from "@/app/lib/api/hooks";
import { CARGOS, lerCargo } from "@/app/lib/cargos";
import { ANO_ELEICAO, POLITICOS_POR_PAGINA } from "@/app/lib/config";
import { formatarNumero, nomeProprio } from "@/app/lib/formatacao";

const DEBOUNCE_MS = 300;
const MINIMO = 2;

interface Filtros {
  q: string;
  cargo: string;
  partido: string;
  /** Página exibida, a partir de 1 (na API, a partir de 0). */
  pagina: number;
}

function lerPaginaDaUrl(valor: string | null): number {
  return valor && /^\d+$/.test(valor) && Number(valor) > 0 ? Number(valor) : 1;
}

function rotuloCargo(cargo?: string | null): string | undefined {
  if (!cargo) return undefined;
  return CARGOS.find((c) => c.valor === cargo.toLocaleUpperCase("pt-BR"))?.rotulo ?? nomeProprio(cargo);
}

const CAMPO =
  "min-h-14 w-full min-w-0 border-2 border-tinta bg-papel px-4 py-3 text-corpo text-tinta placeholder:text-tinta-3 disabled:border-fio disabled:text-tinta-3";
const BOTAO =
  "min-h-12 border-2 border-tinta px-5 py-2 text-corpo font-semibold hover:bg-papel-2 disabled:cursor-default disabled:border-fio disabled:text-tinta-3 disabled:hover:bg-transparent";

/** Lista de todas as candidaturas da eleição configurada, com filtros na URL (spec 016). */
export function CandidatosView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const partidosQuery = usePartidos();
  const listaPartidos = [...(partidosQuery.data ?? [])].sort((a, b) =>
    (a.sigla ?? "").localeCompare(b.sigla ?? "", "pt-BR")
  );

  const q = (searchParams.get("q") ?? "").trim();
  const cargo = lerCargo(searchParams.get("cargo"));
  const partidoBruto = searchParams.get("partido") ?? "";
  const partido = /^\d+$/.test(partidoBruto) ? partidoBruto : "";
  const partidoSelecionado = listaPartidos.find((p) => String(p.numero) === partido);
  const pagina = lerPaginaDaUrl(searchParams.get("pagina"));
  const [busca, setBusca] = useState(q);
  // O campo acompanha a URL quando ela muda por fora (link, cabeçalho, voltar),
  // mas não desfaz o que a própria busca acabou de gravar.
  const [qSincronizado, setQSincronizado] = useState(q);
  const [qEnviado, setQEnviado] = useState(q);
  if (q !== qSincronizado) {
    setQSincronizado(q);
    if (q !== qEnviado) setBusca(q);
  }

  const total = usePoliticos({ anoEleicao: ANO_ELEICAO, tamanho: 1 });
  const lista = usePoliticos({
    anoEleicao: ANO_ELEICAO,
    q: q.length >= MINIMO ? q : undefined,
    cargo: cargo || undefined,
    nrPartido: partido ? Number(partido) : undefined,
    pagina: pagina - 1,
    tamanho: POLITICOS_POR_PAGINA,
  });

  function navegar(mudancas: Partial<Filtros>) {
    const filtros: Filtros = { q, cargo, partido, pagina: 1, ...mudancas };
    const params = new URLSearchParams();
    if (filtros.q) params.set("q", filtros.q);
    if (filtros.cargo) params.set("cargo", filtros.cargo);
    if (filtros.partido) params.set("partido", filtros.partido);
    if (filtros.pagina > 1) params.set("pagina", String(filtros.pagina));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function limpar() {
    setBusca("");
    setQEnviado("");
    navegar({ q: "", cargo: "", partido: "" });
  }

  useEffect(() => {
    const termo = busca.trim();
    const alvo = termo.length >= MINIMO ? termo : "";
    if (alvo === (q.length >= MINIMO ? q : "")) return;
    const timer = setTimeout(() => {
      setQEnviado(alvo);
      navegar({ q: alvo });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
    // navegar só depende de valores já listados aqui
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busca, q, cargo, partido]);

  // Ao trocar de página, o foco vai para a contagem (quem usa teclado não volta ao topo).
  const contagemRef = useRef<HTMLParagraphElement>(null);
  const paginaAnterior = useRef(pagina);
  const carregandoPagina = lista.isPlaceholderData;
  useEffect(() => {
    if (paginaAnterior.current !== pagina && !carregandoPagina) {
      paginaAnterior.current = pagina;
      contagemRef.current?.focus();
    }
  }, [pagina, carregandoPagina]);

  const dados = lista.data;
  const candidatos = (dados?.content ?? []).filter((c) => c.nome);
  const totalPaginas = dados?.totalPages ?? 0;
  const temFiltro = Boolean(q || cargo || partido);
  const descricaoFiltros = [
    q.length >= MINIMO && `Nome: "${q}"`,
    cargo && `Cargo: ${rotuloCargo(cargo)}`,
    partidoSelecionado && `Partido: ${partidoSelecionado.sigla}`,
  ].filter(Boolean);

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-5 py-12 sm:px-8 lg:px-24 lg:py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-titulo-1 font-extrabold text-tinta sm:text-display">Candidatos em {ANO_ELEICAO}</h1>
        {total.data && (
          <p className="text-corpo-grande text-tinta-2">
            {formatarNumero(total.data.totalElements)} candidaturas registradas na eleição de {ANO_ELEICAO}, em ordem
            alfabética.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto] lg:items-end">
        <label className="flex flex-col gap-2 text-corpo font-semibold sm:col-span-2 lg:col-span-1">
          Nome
          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder="Digite um nome"
            className={`${CAMPO} font-normal`}
          />
        </label>
        <label className="flex flex-col gap-2 text-corpo font-semibold">
          Cargo
          <select value={cargo} onChange={(evento) => navegar({ cargo: evento.target.value })} className={`${CAMPO} font-normal`}>
            <option value="">Todos os cargos</option>
            {CARGOS.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.rotulo}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-corpo font-semibold">
          Partido
          <select
            value={partidoSelecionado ? partido : ""}
            onChange={(evento) => navegar({ partido: evento.target.value })}
            disabled={!partidosQuery.data}
            className={`${CAMPO} font-normal`}
          >
            <option value="">Todos os partidos</option>
            {listaPartidos.map((p) => (
              <option key={p.numero} value={String(p.numero)}>
                {[p.sigla, nomeProprio(p.nome)].filter(Boolean).join(" · ")}
              </option>
            ))}
          </select>
        </label>
        {temFiltro && (
          <button type="button" onClick={limpar} className="min-h-14 text-left text-corpo font-semibold text-tinta underline underline-offset-4">
            Limpar filtros
          </button>
        )}
      </div>

      <section aria-labelledby="titulo-resultados" className="border-t-[3px] border-tinta pt-6">
        <h2 id="titulo-resultados" className="sr-only">
          Resultados
        </h2>
        <p ref={contagemRef} tabIndex={-1} aria-live="polite" className="mb-6 text-corpo font-semibold text-tinta">
          {dados &&
            `${formatarNumero(dados.totalElements)} candidaturas${
              descricaoFiltros.length ? ` com ${descricaoFiltros.join(", ")}` : ""
            }`}
        </p>

        {lista.isPending && (
          <div role="status" aria-label="Carregando" className="flex flex-col gap-4">
            {Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        )}
        {lista.isError && (
          <ErroCarregamento mensagem="Não foi possível carregar os candidatos." onTentarDeNovo={() => lista.refetch()} />
        )}
        {dados && candidatos.length === 0 && (
          <div className="flex flex-col items-start gap-4 border border-dashed border-tinta p-6">
            <p className="font-semibold">Nenhuma candidatura encontrada com esses filtros.</p>
            {pagina > 1 && totalPaginas > 0 ? (
              <button type="button" onClick={() => navegar({ pagina: 1 })} className={BOTAO}>
                Voltar para a página 1
              </button>
            ) : (
              <button type="button" onClick={limpar} className={BOTAO}>
                Limpar filtros
              </button>
            )}
          </div>
        )}

        {candidatos.length > 0 && (
          <>
            <div aria-hidden="true" className="hidden grid-cols-[88px_1fr_minmax(0,320px)] gap-6 border-b border-tinta pb-3 text-apoio text-tinta-2 sm:grid">
              <span />
              <span>Nome</span>
              <span>Cargo</span>
            </div>
            <ul className={carregandoPagina ? "opacity-60" : ""}>
              {candidatos.map((c) => (
                <li
                  key={c.tituloEleitoral}
                  className="grid grid-cols-[64px_1fr] items-center gap-x-4 border-b border-fio py-3 hover:bg-papel-2 sm:grid-cols-[88px_1fr_minmax(0,320px)] sm:gap-x-6"
                >
                  <span className="row-span-2 sm:row-span-1">
                    <EntidadeAvatar nome={nomeProprio(c.nome)} imagemUrl={c.urlFoto} variante="politico" tamanho={64} />
                  </span>
                  <Link
                    href={`/politicos/${c.tituloEleitoral}`}
                    className="text-corpo font-semibold text-tinta underline underline-offset-4 hover:decoration-2"
                  >
                    {nomeProprio(c.nome)}
                  </Link>
                  <span className="text-apoio text-tinta-2 sm:text-corpo sm:text-tinta">{rotuloCargo(c.cargo)}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {dados && totalPaginas > 1 && candidatos.length > 0 && (
          <nav aria-label="Paginação" className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navegar({ pagina: pagina - 1 })}
              disabled={carregandoPagina || pagina <= 1}
              className={BOTAO}
            >
              Anterior
            </button>
            <span className="text-apoio text-tinta-2">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              type="button"
              onClick={() => navegar({ pagina: pagina + 1 })}
              disabled={carregandoPagina || pagina >= totalPaginas}
              className={BOTAO}
            >
              Próxima
            </button>
          </nav>
        )}
      </section>
    </div>
  );
}
