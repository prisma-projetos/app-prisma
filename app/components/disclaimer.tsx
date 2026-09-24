export const TEXTO_DISCLAIMER =
  "As classificações de sentimento e os panoramas são gerados por modelos de IA e podem conter erros. Os panoramas resumem o que as fontes publicaram, não fatos verificados por esta plataforma.";

export function Disclaimer() {
  return (
    <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
      {TEXTO_DISCLAIMER}
    </p>
  );
}
