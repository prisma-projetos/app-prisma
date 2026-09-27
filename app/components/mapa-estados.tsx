"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ESTADOS } from "@/app/lib/estados";
import { CONTORNOS_UF, VIEWBOX_BRASIL } from "@/app/lib/mapa-brasil";

// Paradas do espectro, iguais às de --espectro em globals.css (DESIGN.md).
const PARADAS: [string, number][] = [
  ["#ff3b30", 0],
  ["#ff9f0a", 17],
  ["#ffd60a", 33],
  ["#30d158", 50],
  ["#64d2ff", 66],
  ["#0a84ff", 80],
  ["#bf5af2", 100],
];

/**
 * Mapa do Brasil em que cada estado é um link para /candidatos?uf= (spec 023).
 * Sem cor por estado. Ao passar o mouse ou focar, o contorno do estado ganha o
 * espectro; ele é redesenhado por último para não ficar sob a borda dos vizinhos.
 */
export function MapaEstados() {
  const gradiente = useId();
  const [destaque, setDestaque] = useState<string | null>(null);

  return (
    <svg
      role="group"
      aria-label="Mapa do Brasil"
      viewBox={VIEWBOX_BRASIL}
      className="mapa-estados block h-auto w-full max-w-[640px]"
    >
      <defs>
        <linearGradient id={gradiente} x1="0" y1="0" x2="1" y2="0">
          {PARADAS.map(([cor, posicao]) => (
            <stop key={posicao} offset={`${posicao}%`} stopColor={cor} />
          ))}
        </linearGradient>
      </defs>
      <g transform="scale(0.0001,-0.0001)">
        {ESTADOS.map(({ uf, nome }) => (
          <Link
            key={uf}
            href={`/candidatos?uf=${uf}`}
            aria-label={`${nome} (${uf})`}
            onMouseEnter={() => setDestaque(uf)}
            onMouseLeave={() => setDestaque((atual) => (atual === uf ? null : atual))}
            onFocus={() => setDestaque(uf)}
            onBlur={() => setDestaque((atual) => (atual === uf ? null : atual))}
          >
            <path d={CONTORNOS_UF[uf]} vectorEffect="non-scaling-stroke">
              <title>{nome}</title>
            </path>
          </Link>
        ))}
        {destaque && (
          <path
            data-destaque={destaque}
            className="mapa-destaque"
            d={CONTORNOS_UF[destaque]}
            fill="none"
            stroke={`url(#${gradiente})`}
            // Inline para vencer a regra geral dos contornos em globals.css.
            style={{ fill: "none", stroke: `url(#${gradiente})` }}
            vectorEffect="non-scaling-stroke"
            aria-hidden="true"
          />
        )}
      </g>
    </svg>
  );
}
