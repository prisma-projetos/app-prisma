"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Marca } from "./marca";
import { ThemeToggle } from "./theme-toggle";

export function Cabecalho() {
  const caminho = usePathname();
  const partidosAtivo = caminho === "/" || caminho.startsWith("/partidos/");
  return (
    <header className="border-b border-fio bg-papel px-5 lg:px-24">
      <div className="mx-auto flex max-w-[1248px] flex-wrap items-center justify-between gap-x-4 gap-y-2 py-4 sm:py-5">
        <Link href="/" aria-label="PRISMA, página inicial"><Marca /></Link>
        <div className="flex items-center gap-4 sm:gap-8">
          <nav aria-label="Principal">
            <Link href="/" aria-current={partidosAtivo ? "page" : undefined}
              className={`relative inline-flex min-h-12 items-center text-apoio hover:underline ${partidosAtivo ? "nav-ativo font-bold" : ""}`}>
              Partidos
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
