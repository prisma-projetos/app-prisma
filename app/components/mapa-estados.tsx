import Link from "next/link";
import { ESTADOS } from "@/app/lib/estados";
import { CONTORNOS_UF, VIEWBOX_BRASIL } from "@/app/lib/mapa-brasil";

/**
 * Mapa do Brasil em que cada estado é um link para /candidatos?uf= (spec 023).
 * Sem cor por estado: fio de tinta, hover em papel-2 e o foco do sistema.
 */
export function MapaEstados() {
  return (
    <svg
      role="group"
      aria-label="Mapa do Brasil"
      viewBox={VIEWBOX_BRASIL}
      className="mapa-estados block h-auto w-full max-w-[640px]"
    >
      <g transform="scale(0.0001,-0.0001)">
        {ESTADOS.map(({ uf, nome }) => (
          <Link key={uf} href={`/candidatos?uf=${uf}`} aria-label={`${nome} (${uf})`}>
            <path d={CONTORNOS_UF[uf]} vectorEffect="non-scaling-stroke">
              <title>{nome}</title>
            </path>
          </Link>
        ))}
      </g>
    </svg>
  );
}
