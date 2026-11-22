import { notFound } from "next/navigation";
import { lerTituloEleitoral } from "@/app/lib/identificadores";
import { PoliticoView } from "./politico-view";

export default async function PoliticoPage(
  props: PageProps<"/politicos/[tituloEleitoral]">
) {
  const { tituloEleitoral } = await props.params;
  const titulo = lerTituloEleitoral(tituloEleitoral);

  if (titulo === null) {
    notFound();
  }

  return <PoliticoView tituloEleitoral={titulo} />;
}
