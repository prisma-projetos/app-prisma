export function Secao({ id, titulo, children, className = "" }: {
  id: string;
  titulo: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section aria-labelledby={`${id}-titulo`} className={`border-t-[3px] border-tinta pt-6 ${className}`}>
      <h2 id={`${id}-titulo`} className="mb-6 text-titulo-2">{titulo}</h2>
      {children}
    </section>
  );
}
