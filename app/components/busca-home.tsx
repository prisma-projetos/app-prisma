"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { usePartidos, usePoliticos } from "@/app/lib/api/hooks";
import { CARGOS } from "@/app/lib/cargos";
import { ANO_ELEICAO } from "@/app/lib/config";
import { formatarNumero, nomeProprio } from "@/app/lib/formatacao";

const DEBOUNCE_MS = 300;
const MINIMO = 2;
const LIMITE = 5;

interface Item {
  id: string;
  href: string;
  titulo: string;
  detalhe?: string;
}

function rotuloCargo(cargo?: string | null): string | undefined {
  if (!cargo) return undefined;
  return CARGOS.find((c) => c.valor === cargo.toLocaleUpperCase("pt-BR"))?.rotulo ?? nomeProprio(cargo);
}

function plural(n: number, singular: string, pluralizado: string) {
  return `${formatarNumero(n)} ${n === 1 ? singular : pluralizado}`;
}

/** Busca da home: sugere partidos e candidatos enquanto a pessoa digita (spec 015). */
export function BuscaHome() {
  const router = useRouter();
  const id = useId();
  const [termo, setTermo] = useState("");
  const [consulta, setConsulta] = useState("");
  const [aberto, setAberto] = useState(false);
  const [ativo, setAtivo] = useState(-1);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setConsulta(termo.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [termo]);

  const pronto = consulta.length >= MINIMO;
  const partidos = usePartidos({ q: consulta }, { enabled: pronto });
  const candidatos = usePoliticos(
    { q: consulta, anoEleicao: ANO_ELEICAO, tamanho: LIMITE },
    { enabled: pronto }
  );
  // Lista completa (a mesma do índice da home, já em cache) para reconhecer siglas no envio.
  const todosPartidos = usePartidos();

  const itensPartidos: Item[] = (partidos.data ?? []).slice(0, LIMITE).map((p) => ({
    id: `${id}-partido-${p.numero}`,
    href: `/partidos/${p.numero}`,
    titulo: p.sigla || `Partido nº ${p.numero}`,
    detalhe: [nomeProprio(p.nome), `nº ${p.numero}`].filter(Boolean).join(" · "),
  }));
  const totalCandidatos = candidatos.data?.totalElements ?? 0;
  const itensCandidatos: Item[] = (candidatos.data?.content ?? []).slice(0, LIMITE).map((c) => ({
    id: `${id}-candidato-${c.tituloEleitoral}`,
    href: `/politicos/${c.tituloEleitoral}`,
    titulo: nomeProprio(c.nome),
    detalhe: rotuloCargo(c.cargo),
  }));
  if (totalCandidatos > LIMITE) {
    itensCandidatos.push({
      id: `${id}-todos`,
      href: `/candidatos?q=${encodeURIComponent(consulta)}`,
      titulo: `Ver os ${formatarNumero(totalCandidatos)} candidatos com "${consulta}"`,
    });
  }
  const itens = [...itensPartidos, ...itensCandidatos];
  const mostrarPainel = aberto && pronto && termo.trim().length >= MINIMO;
  const itemAtivo = mostrarPainel && ativo >= 0 ? itens[ativo] : undefined;

  // A opção ativa pelas setas precisa ficar visível, inclusive no celular,
  // onde o painel pode abrir abaixo da dobra.
  useEffect(() => {
    if (itemAtivo) document.getElementById(itemAtivo.id)?.scrollIntoView?.({ block: "nearest" });
  }, [itemAtivo]);

  const anuncio =
    pronto && partidos.isSuccess && candidatos.isSuccess && !candidatos.isPlaceholderData
      ? `${plural(partidos.data.length, "partido", "partidos")} e ${plural(totalCandidatos, "candidato", "candidatos")} encontrados`
      : "";

  function abrir(href: string) {
    setAberto(false);
    router.push(href);
  }

  function enviar() {
    const texto = termo.trim();
    if (texto.length < MINIMO) {
      setAviso("Digite pelo menos 2 letras.");
      return;
    }
    const alvo = texto.toLocaleLowerCase("pt-BR");
    const partido = (todosPartidos.data ?? []).find(
      (p) => p.sigla?.toLocaleLowerCase("pt-BR") === alvo
    );
    abrir(partido ? `/partidos/${partido.numero}` : `/candidatos?q=${encodeURIComponent(texto)}`);
  }

  function aoTeclar(evento: React.KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "ArrowDown" || evento.key === "ArrowUp") {
      if (!itens.length) return;
      evento.preventDefault();
      setAberto(true);
      const passo = evento.key === "ArrowDown" ? 1 : -1;
      setAtivo((atual) => (atual + passo + itens.length) % itens.length);
    } else if (evento.key === "Enter" && itemAtivo) {
      evento.preventDefault();
      abrir(itemAtivo.href);
    } else if (evento.key === "Escape") {
      setAberto(false);
      setAtivo(-1);
    }
  }

  return (
    <form
      role="search"
      className="relative flex w-full max-w-[860px] flex-col gap-3"
      onSubmit={(evento) => {
        evento.preventDefault();
        enviar();
      }}
    >
      <label htmlFor={`${id}-campo`} className="text-corpo font-semibold">
        Nome do partido ou do candidato
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-0">
        <div className="relative flex-1">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-5 h-6 w-6 -translate-y-1/2 text-tinta" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round">
            <circle cx="10.5" cy="10.5" r="6.5" />
            <path d="m15.5 15.5 5 5" />
          </svg>
          <input
            id={`${id}-campo`}
            type="text"
            role="combobox"
            autoComplete="off"
            aria-autocomplete="list"
            aria-expanded={mostrarPainel}
            aria-controls={`${id}-lista`}
            aria-activedescendant={itemAtivo?.id}
            aria-describedby={`${id}-dica${aviso ? ` ${id}-aviso` : ""}`}
            value={termo}
            onChange={(evento) => {
              setTermo(evento.target.value);
              setAviso("");
              setAtivo(-1);
              setAberto(evento.target.value.trim().length >= MINIMO);
            }}
            onKeyDown={aoTeclar}
            onBlur={() => setAberto(false)}
            placeholder="Ex.: PSD ou Maria da Silva"
            className="h-16 w-full border-2 border-tinta bg-papel pr-5 pl-14 text-corpo-grande text-tinta placeholder:text-tinta-3"
          />
          {mostrarPainel && (
            <div
              id={`${id}-lista`}
              role="listbox"
              aria-label="Sugestões"
              className="absolute top-full right-0 left-0 z-20 max-h-[70vh] overflow-y-auto border-2 border-t-0 border-tinta bg-papel py-2"
            >
              <Grupo
                id={`${id}-grupo-partidos`}
                titulo="Partidos"
                itens={itensPartidos}
                ativo={itemAtivo?.id}
                carregando={partidos.isPending}
                erro={partidos.isError}
                vazio={`Nenhum partido com "${consulta}".`}
                aoEscolher={abrir}
              />
              <Grupo
                id={`${id}-grupo-candidatos`}
                titulo="Candidatos"
                itens={itensCandidatos}
                ativo={itemAtivo?.id}
                carregando={candidatos.isPending}
                erro={candidatos.isError}
                vazio={`Nenhum candidato com "${consulta}" no nome. Tente o nome completo da pessoa.`}
                aoEscolher={abrir}
              />
            </div>
          )}
        </div>
        <button type="submit" className="h-16 bg-tinta px-8 text-corpo-grande font-bold text-papel hover:opacity-90">
          Buscar
        </button>
      </div>
      {aviso && (
        <p id={`${id}-aviso`} className="text-apoio font-semibold text-tinta">
          {aviso}
        </p>
      )}
      <p id={`${id}-dica`} className="text-apoio text-tinta-2">
        Exemplos: PSD, Partido Verde, Maria da Silva. Para candidatos, use o nome completo, não o nome de urna.
      </p>
      <p role="status" className="sr-only">
        {anuncio}
      </p>
    </form>
  );
}

function Grupo({
  id,
  titulo,
  itens,
  ativo,
  carregando,
  erro,
  vazio,
  aoEscolher,
}: {
  id: string;
  titulo: string;
  itens: Item[];
  ativo?: string;
  carregando: boolean;
  erro: boolean;
  vazio: string;
  aoEscolher: (href: string) => void;
}) {
  let mensagem: string | undefined;
  if (erro) mensagem = "Não foi possível buscar agora. Tente de novo em alguns segundos.";
  else if (carregando) mensagem = "Buscando…";
  else if (itens.length === 0) mensagem = vazio;

  return (
    <div role="group" aria-labelledby={id}>
      <div id={id} className="px-4 pt-3 pb-1 text-apoio font-semibold text-tinta-2">
        {titulo}
      </div>
      {mensagem ? (
        <div role="presentation" className="px-4 pt-1 pb-3 text-apoio text-tinta-2">
          {mensagem}
        </div>
      ) : (
        itens.map((item) => (
          <div
            key={item.id}
            id={item.id}
            role="option"
            aria-selected={item.id === ativo}
            // mousedown evita que o campo perca o foco (e feche o painel) antes do clique.
            onMouseDown={(evento) => evento.preventDefault()}
            onClick={() => aoEscolher(item.href)}
            className={`flex min-h-12 cursor-pointer flex-col justify-center px-4 py-2 hover:bg-papel-2 ${
              item.id === ativo ? "bg-papel-2" : ""
            }`}
          >
            <span className={item.detalhe ? "text-corpo font-semibold text-tinta" : "text-corpo font-semibold text-tinta underline underline-offset-4"}>
              {item.titulo}
            </span>
            {item.detalhe && <span className="text-apoio text-tinta-2">{item.detalhe}</span>}
          </div>
        ))
      )}
    </div>
  );
}
