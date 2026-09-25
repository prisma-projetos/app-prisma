"use client";

import Link from "next/link";
import { usePartidos } from "@/app/lib/api/hooks";
import { EntidadeAvatar } from "./entidade-avatar";
import { ErroCarregamento, GradeSkeleton, MensagemVazia } from "./estados";

export function ListaPartidos() {
  const { data, isPending, isError, refetch } = usePartidos();

  if (isPending) return <GradeSkeleton itens={12} circular={false} />;
  if (isError) return <ErroCarregamento onTentarDeNovo={() => refetch()} />;

  const partidos = [...data].sort((a, b) =>
    (a.sigla ?? "").localeCompare(b.sigla ?? "", "pt-BR")
  );

  if (partidos.length === 0) {
    return <MensagemVazia>Nenhum partido encontrado.</MensagemVazia>;
  }

  return (
    <ul className="flex flex-wrap justify-center gap-10 pt-4">
      {partidos.map((partido) => (
        <li key={partido.numero}>
          <Link href={`/partidos/${partido.numero}`} aria-label={partido.sigla}>
            <EntidadeAvatar
              nome={partido.sigla ?? ""}
              rotulo={`${partido.sigla} — ${partido.nome}`}
              imagemUrl={partido.urlLogo}
              variante="partido"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
