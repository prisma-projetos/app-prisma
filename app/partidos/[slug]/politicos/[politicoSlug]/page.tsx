import Link from "next/link";
import { notFound } from "next/navigation";
import { Disclaimer } from "@/app/components/disclaimer";
import { EntidadeAvatar } from "@/app/components/entidade-avatar";
import { SinteseTabs } from "@/app/components/sintese-tabs";
import { getPoliticoBySlug } from "@/app/lib/mock-data";
import { CARGO_LABELS } from "@/app/lib/types";

export default async function PoliticoPage({
  params,
}: {
  params: Promise<{ slug: string; politicoSlug: string }>;
}) {
  const { slug, politicoSlug } = await params;
  const resultado = getPoliticoBySlug(slug, politicoSlug);

  if (!resultado) {
    notFound();
  }

  const { partido, politico } = resultado;
  const vice = politico.viceRef
    ? getPoliticoBySlug(politico.viceRef.partidoSlug, politico.viceRef.politicoSlug)?.politico
    : undefined;

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="flex w-full max-w-3xl flex-col gap-10">
        <Link
          href={`/partidos/${partido.slug}`}
          className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
        >
          ← {partido.nome}
        </Link>

        <div className="flex items-center gap-4">
          <EntidadeAvatar
            nome={politico.nome}
            imagemUrl={politico.imagemUrl}
            variante="politico"
            tamanho={64}
          />
          <div>
            <h1 className="text-2xl font-bold text-black dark:text-white">
              {politico.nome}
            </h1>
            <p className="text-sm text-zinc-500">
              {CARGO_LABELS[politico.cargo]} · {partido.sigla}
              {politico.viceNome && ` · vice: ${politico.viceNome}`}
              {politico.viceRef && (
                <>
                  {" "}
                  · vice:{" "}
                  <Link
                    href={`/partidos/${politico.viceRef.partidoSlug}/politicos/${politico.viceRef.politicoSlug}`}
                    className="underline hover:text-zinc-800 dark:hover:text-zinc-300"
                  >
                    {vice?.nome ?? politico.viceRef.politicoSlug}
                  </Link>
                </>
              )}
            </p>
          </div>
        </div>

        <Disclaimer />

        <SinteseTabs sintese={politico.sintese} />
      </div>
    </div>
  );
}
