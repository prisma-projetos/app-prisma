import Link from "next/link";
import type { CandidatoResumoResponse } from "@/app/lib/api/types";
import { rotuloDoCargo } from "@/app/lib/cargos";
import { nomeProprio } from "@/app/lib/formatacao";
import { EntidadeAvatar } from "./entidade-avatar";

interface Colunas {
  /** Nas seções por cargo o título já diz o cargo; repetir em cada linha é ruído. */
  mostrarCargo?: boolean;
  /** Na lista do partido todos são do mesmo partido (spec 026). */
  mostrarPartido?: boolean;
}

/** Linha de candidato: foto, nome (link que cobre a linha inteira), partido e cargo. */
// Coluna do nome limitada: partido e cargo ficam perto do nome em vez de irem para a borda.
function grade({ mostrarCargo = true, mostrarPartido = false }: Colunas) {
  if (mostrarPartido && mostrarCargo) return "sm:grid-cols-[88px_minmax(0,520px)_minmax(0,10rem)_1fr]";
  return "sm:grid-cols-[88px_minmax(0,520px)_1fr]";
}

/**
 * A API só passou a mandar o partido na spec 026: se nenhum item da página traz a sigla,
 * a coluna some em vez de ficar vazia.
 */
export function temPartido(candidatos: CandidatoResumoResponse[]): boolean {
  return candidatos.some((c) => c.siglaPartido);
}

/** Cabeçalho "Nome / Partido / Cargo" das listas de candidatos, com fio em tinta. */
export function CabecalhoLista({ className = "", mostrarCargo = true, mostrarPartido = false }: Colunas & { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`hidden gap-6 border-b border-tinta pb-3 text-apoio text-tinta-2 sm:grid ${grade({ mostrarCargo, mostrarPartido })} ${className}`}
    >
      <span />
      <span>Nome</span>
      {mostrarPartido && <span>Partido</span>}
      {mostrarCargo && <span>Cargo</span>}
    </div>
  );
}

function Partido({ candidato: c }: { candidato: CandidatoResumoResponse }) {
  if (!c.siglaPartido) {
    return (
      <span>
        <span aria-hidden="true">—</span>
        <span className="sr-only">Partido não informado</span>
      </span>
    );
  }
  if (c.nrPartido == null) return <span>{c.siglaPartido}</span>;
  return (
    <Link
      href={`/partidos/${c.nrPartido}`}
      // Fica por cima do link do nome, que cobre a linha inteira.
      className="relative z-10 break-words underline underline-offset-4 hover:decoration-2"
    >
      {c.siglaPartido}
    </Link>
  );
}

export function LinhaCandidato({
  candidato: c,
  mostrarCargo = true,
  mostrarPartido = false,
}: Colunas & { candidato: CandidatoResumoResponse }) {
  return (
    <li
      className={`relative grid min-h-[88px] grid-cols-[64px_1fr] items-center gap-x-4 border-b border-fio py-3 hover:bg-papel-2 sm:gap-x-6 ${grade({ mostrarCargo, mostrarPartido })}`}
    >
      <span className="row-span-2 sm:row-span-1">
        <EntidadeAvatar nome={nomeProprio(c.nome)} imagemUrl={c.urlFoto} variante="politico" tamanho={64} />
      </span>
      <Link
        href={`/politicos/${c.tituloEleitoral}`}
        // O link cobre a linha inteira (foto, nome e cargo): alvo de toque grande.
        className="text-corpo font-semibold text-tinta underline underline-offset-4 after:absolute after:inset-0 after:content-[''] hover:decoration-2"
      >
        {nomeProprio(c.nome)}
      </Link>
      {mostrarPartido ? (
        // No celular, partido e cargo dividem a linha de baixo; no desktop, cada um vira uma coluna.
        <span className="flex flex-wrap gap-x-2 text-apoio text-tinta-2 sm:contents sm:text-corpo sm:text-tinta">
          <Partido candidato={c} />
          {mostrarCargo && (
            <>
              <span aria-hidden="true" className="sm:hidden">
                ·
              </span>
              <span>{rotuloDoCargo(c.cargo)}</span>
            </>
          )}
        </span>
      ) : (
        mostrarCargo && <span className="text-apoio text-tinta-2 sm:text-corpo sm:text-tinta">{rotuloDoCargo(c.cargo)}</span>
      )}
    </li>
  );
}
