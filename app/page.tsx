import { ListaPartidos } from "@/app/components/lista-partidos";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-6 px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
      <h1 className="text-[40px] leading-[1.1] font-extrabold tracking-tight text-tinta sm:text-[64px]">
        Partidos, de A a Z
      </h1>
      <ListaPartidos />
    </div>
  );
}
