"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LinhaCandidato } from "@/app/components/linha-candidato";
import { CampoSelect } from "@/app/components/campo-select";
import { ErroCarregamento, Skeleton } from "@/app/components/estados";
import { usePartidos, usePoliticos } from "@/app/lib/api/hooks";
import { CARGOS, lerCargo, rotuloDoCargo } from "@/app/lib/cargos";
import { CARGOS_ESTADUAIS, ESTADOS, filtroUfAtivo, lerUf, nomeDoEstado } from "@/app/lib/estados";
import { ANO_ELEICAO, POLITICOS_POR_PAGINA } from "@/app/lib/config";
import { formatarNumero, nomeProprio } from "@/app/lib/formatacao";

const DEBOUNCE_MS = 300;
const MINIMO = 2;

interface Filtros {
  q: string;
  cargo: string;
  partido: string;
  uf: string;
  /** Página exibida, a partir de 1 (na API, a partir de 0). */
  pagina: number;
}

function lerPaginaDaUrl(valor: string | null): number {
  return valor && /^\d+$/.test(valor) && Number(valor) > 0 ? Number(valor) : 1;
}

const CAMPO =
  "min-h-14 w-full min-w-0 border-2 border-tinta bg-papel px-4 py-3 text-corpo text-tinta placeholder:text-tinta-3 disabled:border-fio disabled:text-tinta-3";
const BOTAO =
  "min-h-12 border-2 border-tinta px-5 py-2 text-corpo font-semibold hover:bg-papel-2 disabled:border-fio disabled:text-tinta-3 disabled:hover:bg-transparent";

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
  const uf = filtroUfAtivo() ? lerUf(searchParams.get("uf")) : "";
  // Com estado e sem cargo, a lista vira dividida por cargo (spec 023).
  const porCargo = Boolean(uf && !cargo);
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
    uf: uf || undefined,
    nrPartido: partido ? Number(partido) : undefined,
    pagina: pagina - 1,
    tamanho: POLITICOS_POR_PAGINA,
  });

  function navegar(mudancas: Partial<Filtros>) {
    const filtros: Filtros = { q, cargo, partido, uf, pagina: 1, ...mudancas };
    const params = new URLSearchParams();
    if (filtros.q) params.set("q", filtros.q);
    if (filtros.cargo) params.set("cargo", filtros.cargo);
    if (filtros.partido) params.set("partido", filtros.partido);
    if (filtros.uf) params.set("uf", filtros.uf);
    if (filtros.pagina > 1) params.set("pagina", String(filtros.pagina));
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function limpar() {
    setBusca("");
    setQEnviado("");
    navegar({ q: "", cargo: "", partido: "", uf: "" });
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
  const temFiltro = Boolean(q || cargo || partido || uf);
  const descricaoFiltros = [
    q.length >= MINIMO && `Nome: "${q}"`,
    cargo && `Cargo: ${rotuloDoCargo(cargo)}`,
    partidoSelecionado && `Partido: ${partidoSelecionado.sigla}`,
    uf && `Estado: ${nomeDoEstado(uf)}`,
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

      <div
        className={`grid gap-4 sm:grid-cols-2 lg:items-end ${
          filtroUfAtivo() ? "lg:grid-cols-[2fr_1fr_1fr_1fr_auto]" : "lg:grid-cols-[2fr_1fr_1fr_auto]"
        }`}
      >
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
          <CampoSelect value={cargo} onChange={(evento) => navegar({ cargo: evento.target.value })} className={`${CAMPO} font-normal`}>
            <option value="">Todos os cargos</option>
            {CARGOS.map((c) => (
              <option key={c.valor} value={c.valor}>
                {c.rotulo}
              </option>
            ))}
          </CampoSelect>
        </label>
        <label className="flex flex-col gap-2 text-corpo font-semibold">
          Partido
          <CampoSelect
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
          </CampoSelect>
        </label>
        {filtroUfAtivo() && (
          <label className="flex flex-col gap-2 text-corpo font-semibold">
            Estado
            <CampoSelect value={uf} onChange={(evento) => navegar({ uf: evento.target.value })} className={`${CAMPO} font-normal`}>
              <option value="">Todos os estados</option>
              {ESTADOS.map((e) => (
                <option key={e.uf} value={e.uf}>
                  {e.nome}
                </option>
              ))}
            </CampoSelect>
          </label>
        )}
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

        {porCargo && dados && <CandidatosPorCargo uf={uf} />}

        {!porCargo && candidatos.length > 0 && (
          <>
            <div aria-hidden="true" className="hidden grid-cols-[88px_1fr_minmax(0,320px)] gap-6 border-b border-tinta pb-3 text-apoio text-tinta-2 sm:grid">
              <span />
              <span>Nome</span>
              <span>Cargo</span>
            </div>
            <ul className={carregandoPagina ? "opacity-60" : ""}>
              {candidatos.map((c) => (
                <LinhaCandidato key={c.tituloEleitoral} candidato={c} />
              ))}
            </ul>
          </>
        )}

        {!porCargo && dados && totalPaginas > 1 && candidatos.length > 0 && (
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

const POR_CARGO = 6;

/** Candidatos de um estado divididos por cargo estadual (spec 023). */
function CandidatosPorCargo({ uf }: { uf: string }) {
  return (
    <div className="flex flex-col gap-12">
      {CARGOS_ESTADUAIS.map((cargo) => (
        <SecaoCargo key={cargo} uf={uf} cargo={cargo} />
      ))}
    </div>
  );
}

function SecaoCargo({ uf, cargo }: { uf: string; cargo: string }) {
  const consulta = usePoliticos({ anoEleicao: ANO_ELEICAO, uf, cargo, pagina: 0, tamanho: POR_CARGO });
  const total = consulta.data?.totalElements ?? 0;
  const candidatos = (consulta.data?.content ?? []).filter((c) => c.nome);
  // Cargo sem candidatos no estado não aparece.
  if (!consulta.data || total === 0) return null;
  const rotulo = rotuloDoCargo(cargo) ?? cargo;
  const titulo = `${rotulo} (${formatarNumero(total)})`;

  return (
    <section aria-label={titulo} className="flex flex-col gap-2">
      <h3 className="text-titulo-3 text-tinta">{titulo}</h3>
      <ul>
        {candidatos.map((c) => (
          <LinhaCandidato key={c.tituloEleitoral} candidato={c} />
        ))}
      </ul>
      {total > POR_CARGO && (
        <Link
          href={`/candidatos?uf=${uf}&cargo=${encodeURIComponent(cargo)}`}
          className="inline-flex min-h-12 items-center self-start text-corpo font-semibold text-tinta underline underline-offset-4"
        >
          Ver os {formatarNumero(total)} candidatos a {rotulo.toLocaleLowerCase("pt-BR")} em {uf}
        </Link>
      )}
    </section>
  );
}
