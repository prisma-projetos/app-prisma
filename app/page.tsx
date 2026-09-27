import Link from "next/link";
import { BuscaHome } from "@/app/components/busca-home";
import { FiguraFeixe } from "@/app/components/figura-feixe";
import { ListaPartidos } from "@/app/components/lista-partidos";
import { Secao } from "@/app/components/secao";

const CONTAINER = "mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-16";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <section aria-labelledby="titulo-home" className={`${CONTAINER} flex flex-col gap-6 pt-12 pb-10 lg:pt-24`}>
        <h1 id="titulo-home" className="max-w-[980px] text-titulo-1 font-extrabold text-tinta sm:text-display">
          Sobre quem você quer saber?
        </h1>
        <p className="max-w-[760px] text-corpo-grande text-tinta-2">
          O PRISMA reúne o que a imprensa publica sobre partidos e candidatos e mostra o sentimento de cada parágrafo:
          se critica, se só informa ou se elogia. Toda informação leva à matéria original.
        </p>
        <BuscaHome />
      </section>
      <FiguraFeixe />
      <div className={`${CONTAINER} py-16 lg:py-24`}>
        <Secao id="partidos" titulo="Partidos, de A a Z">
          <ListaPartidos />
          <Link
            href="/candidatos"
            className="mt-10 inline-flex min-h-14 items-center border-2 border-tinta px-6 text-corpo font-semibold text-tinta hover:bg-papel-2"
          >
            Ver todos os candidatos
          </Link>
        </Secao>
      </div>
    </div>
  );
}
