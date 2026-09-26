export const TEXTO_DISCLAIMER =
  "As classificações de sentimento e os panoramas são gerados por modelos de IA e podem conter erros. Os panoramas resumem o que as fontes publicaram, não fatos verificados por esta plataforma.";

export function Disclaimer() {
  return (
    <p className="flex items-start gap-3 border border-tinta p-5 text-apoio text-tinta-2">
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="mt-0.5 h-5 w-5 shrink-0" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" /><path d="M12 10v7M12 6v2" />
      </svg>
      <span>{TEXTO_DISCLAIMER}</span>
    </p>
  );
}
