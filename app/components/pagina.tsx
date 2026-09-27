export function Pagina({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-1 flex-col items-center bg-papel px-5 py-12 lg:px-24 lg:py-16">
      <div className="flex w-full min-w-0 max-w-[1248px] flex-col gap-16">{children}</div>
    </div>
  );
}
