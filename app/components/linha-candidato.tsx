import Link from "next/link";
import type { CandidatoResumoResponse } from "@/app/lib/api/types";
import { rotuloDoCargo } from "@/app/lib/cargos";
import { nomeProprio } from "@/app/lib/formatacao";
import { EntidadeAvatar } from "./entidade-avatar";

/** Linha de candidato: foto, nome (link que cobre a linha inteira) e cargo. */
export function LinhaCandidato({ candidato: c }: { candidato: CandidatoResumoResponse }) {
  return (
    <li className="relative grid min-h-[88px] grid-cols-[64px_1fr] items-center gap-x-4 border-b border-fio py-3 hover:bg-papel-2 sm:grid-cols-[88px_1fr_minmax(0,320px)] sm:gap-x-6">
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
      <span className="text-apoio text-tinta-2 sm:text-corpo sm:text-tinta">{rotuloDoCargo(c.cargo)}</span>
    </li>
  );
}
