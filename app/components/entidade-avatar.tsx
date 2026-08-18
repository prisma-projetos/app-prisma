interface EntidadeAvatarProps {
  nome: string;
  imagemUrl?: string;
  variante: "partido" | "politico";
  tamanho?: number;
}

export function EntidadeAvatar({
  nome,
  imagemUrl,
  variante,
  tamanho = 96,
}: EntidadeAvatarProps) {
  const circular = variante === "politico";

  return (
    <span
      title={nome}
      className="group relative inline-flex flex-col items-center gap-2"
    >
      <span
        className={`flex items-center justify-center overflow-hidden border border-zinc-100 bg-zinc-200 transition-transform group-hover:scale-105 dark:border-zinc-800 dark:bg-zinc-900 ${
          circular ? "rounded-full" : "rounded-2xl"
        }`}
        style={{ width: tamanho, height: tamanho }}
      >
        {imagemUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagemUrl}
            alt=""
            className={
              circular ? "h-full w-full object-cover" : "h-3/4 w-3/4 object-contain"
            }
          />
        ) : (
          <AvatarFallback circular={circular} nome={nome} />
        )}
      </span>
      <span className="pointer-events-none absolute -bottom-6 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-black/85 px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
        {nome}
      </span>
    </span>
  );
}

function AvatarFallback({ circular, nome }: { circular: boolean; nome: string }) {
  if (circular) {
    return <PersonIcon />;
  }

  return (
    <span className="text-lg font-semibold text-zinc-500">
      {nome.slice(0, 3).toUpperCase()}
    </span>
  );
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-1/2 w-1/2 text-zinc-400"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path
        d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
