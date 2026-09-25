import { ListaPartidos } from "@/app/components/lista-partidos";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex w-full max-w-4xl flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-7xl font-bold tracking-tight text-black dark:text-white">
            PRISMA
          </h1>
          <p className="max-w-xl text-zinc-600 dark:text-zinc-400">
            O que a imprensa publica sobre partidos e políticos, organizado por
            sentimento — com rastreabilidade completa até as matérias de origem.
          </p>
        </div>
        <ListaPartidos />
      </div>
    </div>
  );
}
