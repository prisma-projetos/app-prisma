export function MensagemVazia({ children }: { children: React.ReactNode }) {
  return <p className="border border-dashed border-tinta p-6 text-apoio text-tinta-2">{children}</p>;
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
      className="flex flex-wrap items-center gap-4 border border-tinta p-5 text-apoio text-tinta-2"
    >
      <span>{mensagem}</span>
      <button
        type="button"
        onClick={onTentarDeNovo}
        className="min-h-12 border-2 border-tinta px-5 py-2 font-semibold text-tinta hover:bg-papel-2"
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
      className={`block bg-papel-2 ${className}`}
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
          className={`h-24 w-24 ${circular ? "rounded-full" : ""}`}
        />
      ))}
    </div>
  );
}
