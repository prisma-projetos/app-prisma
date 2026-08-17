import Link from "next/link";
import { EntidadeAvatar } from "@/app/components/entidade-avatar";
import { getPartidos } from "@/app/lib/mock-data";

export default function Home() {
  const partidos = getPartidos();

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex w-full max-w-4xl flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-black dark:text-white">
            PRISMA
          </h1>
          <p className="max-w-xl text-zinc-600 dark:text-zinc-400">
            Como diferentes perspectivas do espectro político descrevem,
            elogiam e criticam partidos e políticos — com rastreabilidade
            completa até os artigos de origem.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-10 pt-4">
          {partidos.map((partido) => (
            <Link key={partido.slug} href={`/partidos/${partido.slug}`}>
              <EntidadeAvatar
                nome={partido.nome}
                imagemUrl={partido.logoUrl}
                variante="partido"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
