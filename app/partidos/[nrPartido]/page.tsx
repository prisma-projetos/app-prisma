import { notFound } from "next/navigation";
import { lerNrPartido } from "@/app/lib/identificadores";
import { PartidoView } from "./partido-view";

export default async function PartidoPage(props: PageProps<"/partidos/[nrPartido]">) {
  const { nrPartido } = await props.params;
  const numero = lerNrPartido(nrPartido);

  if (numero === null) {
    notFound();
  }

  return <PartidoView nrPartido={numero} />;
}
