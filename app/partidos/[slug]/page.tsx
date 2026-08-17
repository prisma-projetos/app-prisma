import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/app/components/disclaimer";
import { EntidadeAvatar } from "@/app/components/entidade-avatar";
import { SinteseTabs } from "@/app/components/sintese-tabs";
import { getPartidoBySlug } from "@/app/lib/mock-data";
import { CARGO_GRUPOS } from "@/app/lib/types";

export default async function PartidoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partido = getPartidoBySlug(slug);

  if (!partido) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex w-full max-w-3xl flex-col gap-10">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
        >
          ← Partidos
        </Link>

        <div className="flex items-center gap-4">
          <EntidadeAvatar
            nome={partido.nome}
            imagemUrl={partido.logoUrl}
            variante="partido"
            tamanho={64}
          />
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {partido.nome}
            </h1>
            <p className="text-sm text-zinc-500">{partido.sigla}</p>
          </div>
        </div>

        <Disclaimer />

        <SinteseTabs sintese={partido.sintese} />

        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-black dark:text-white">
            Políticos
          </h2>
          {partido.politicos.length === 0 ? (
            <p className="text-sm text-zinc-500">
              Nenhum político cadastrado para este partido.
            </p>
          ) : (
            CARGO_GRUPOS.map((grupo) => {
              const politicosDoGrupo = partido.politicos.filter((politico) =>
                grupo.cargos.includes(politico.cargo)
              );

              if (politicosDoGrupo.length === 0) return null;

              return (
                <div key={grupo.chave} className="flex flex-col gap-3">
                  <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                    {grupo.titulo}
                  </h3>
                  <div className="flex flex-wrap gap-8">
                    {politicosDoGrupo.map((politico) => (
                      <Link
                        key={politico.slug}
                        href={`/partidos/${partido.slug}/politicos/${politico.slug}`}
                      >
                        <EntidadeAvatar
                          nome={politico.nome}
                          imagemUrl={politico.imagemUrl}
                          variante="politico"
                        />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
