export function MensagemVazia({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-zinc-500">{children}</p>;
}

export function ErroCarregamento({
  mensagem = "Não foi possível carregar os dados.",
  onTentarDeNovo,
}: {
  mensagem?: string;
  onTentarDeNovo: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-wrap items-center gap-3 rounded-lg border border-zinc-200 p-4 text-sm text-zinc-700 dark:border-zinc-800 dark:text-zinc-300"
    >
      <span>{mensagem}</span>
      <button
        type="button"
        onClick={onTentarDeNovo}
        className="rounded-md border border-zinc-300 px-3 py-1 font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-900"
      >
        Tentar de novo
      </button>
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`block animate-pulse rounded-md bg-zinc-200 dark:bg-zinc-800 ${className}`}
    />
  );
}

export function GradeSkeleton({
  itens,
  circular,
}: {
  itens: number;
  circular: boolean;
}) {
  return (
    <div role="status" aria-label="Carregando" className="flex flex-wrap gap-8">
      {Array.from({ length: itens }, (_, i) => (
        <Skeleton
          key={i}
          className={`h-24 w-24 ${circular ? "rounded-full" : "rounded-2xl"}`}
        />
      ))}
    </div>
  );
}
