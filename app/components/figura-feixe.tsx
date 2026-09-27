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
 * Fig. 1 da home: a luz branca entra no prisma e sai decomposta (spec 015).
 * O leque se abre uma vez ao carregar; com prefers-reduced-motion, já aparece aberto.
 */
export function FiguraFeixe() {
  return (
    <figure className="flex flex-col gap-4">
      {/* Mesmo desenho, com enquadramentos diferentes: no celular, o recorte centra o prisma. */}
      <Desenho id="feixe-espectro-celular" viewBox="600 0 520 160" alinhamento="xMinYMid slice" className="block h-[120px] w-full sm:hidden" />
      <Desenho id="feixe-espectro" viewBox="0 0 1440 160" alinhamento="xMidYMid slice" className="hidden h-[160px] w-full sm:block" />
      <figcaption className="mx-auto w-full max-w-[1440px] px-5 text-legenda text-tinta-2 sm:px-8 lg:px-16">
        <span className="block max-w-[760px]">
          <span className="mr-1 text-tinta [font-variant-caps:all-small-caps] tracking-[0.06em]">Fig. 1</span>{" "}
          A luz branca atravessa o prisma e se separa em cores. O PRISMA faz o mesmo com a cobertura da imprensa: separa o
          que foi publicado pelo sentimento de cada parágrafo.
        </span>
      </figcaption>
    </figure>
  );
}

function Desenho({ id, viewBox, alinhamento, className }: {
  id: string;
  viewBox: string;
  alinhamento: string;
  className: string;
}) {
  return (
    <svg aria-hidden="true" viewBox={viewBox} preserveAspectRatio={alinhamento} className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          {PARADAS.map(([cor, posicao]) => (
            <stop key={posicao} offset={`${posicao}%`} stopColor={cor} />
          ))}
        </linearGradient>
      </defs>
      <rect x="0" y="88" width="742" height="3" fill="var(--tinta)" />
      <polygon className="feixe-leque" points="790,89 1440,4 1440,156" fill={`url(#${id})`} />
      <polygon
        points="760,28 820,132 700,132"
        fill="var(--papel)"
        stroke="var(--tinta)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
