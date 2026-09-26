import type { Metadata } from "next";
import { Suspense } from "react";
import { CandidatosView } from "./candidatos-view";

export const metadata: Metadata = { title: "Candidatos · PRISMA" };

export default function CandidatosPage() {
  // useSearchParams (filtros na URL) exige Suspense na renderização estática.
  return (
    <Suspense>
      <CandidatosView />
    </Suspense>
  );
}
