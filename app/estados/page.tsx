import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapaEstados } from "@/app/components/mapa-estados";
import { ESTADOS, filtroUfAtivo } from "@/app/lib/estados";

export const metadata: Metadata = { title: "Candidatos por estado · PRISMA" };

export default function EstadosPage() {
  // Só existe quando a api-prisma filtra por UF (spec 023).
  if (!filtroUfAtivo()) notFound();

  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-8 px-5 py-12 sm:px-8 lg:px-24 lg:py-16">
      <div className="flex flex-col gap-3">
        <h1 className="text-titulo-1 font-extrabold text-tinta sm:text-display">Candidatos por estado</h1>
        <p className="text-corpo-grande text-tinta-2">Escolha um estado no mapa ou na lista.</p>
      </div>
      <div className="grid items-start gap-10 border-t-[3px] border-tinta pt-8 lg:grid-cols-[minmax(0,640px)_1fr]">
        <figure className="flex flex-col gap-4">
          <MapaEstados />
          <figcaption className="max-w-[640px] text-legenda text-tinta-2">
            <span className="mr-1 text-tinta [font-variant-caps:all-small-caps] tracking-[0.06em]">Fig. 1</span>{" "}
            As 27 unidades da federação. Escolha um estado para ver as candidaturas dele, divididas por cargo. Malha: IBGE,
            2026.
          </figcaption>
        </figure>
        {/* Ordem por coluna, como o índice de um atlas: desce a primeira coluna antes da segunda. */}
        <ul
          aria-label="Estados em ordem alfabética"
          className="grid grid-flow-col grid-cols-2 grid-rows-[repeat(14,auto)] gap-x-6 sm:grid-cols-3 sm:grid-rows-[repeat(9,auto)] lg:grid-cols-2 lg:grid-rows-[repeat(14,auto)]"
        >
          {ESTADOS.map(({ uf, nome }) => (
            <li key={uf} className="border-b border-fio">
              <Link
                href={`/candidatos?uf=${uf}`}
                className="flex min-h-12 items-center justify-between gap-3 py-2 text-corpo text-tinta underline underline-offset-4 hover:bg-papel-2"
              >
                <span>{nome}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
