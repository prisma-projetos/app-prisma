import type { ComponentProps } from "react";

/** Select com a seta desenhada do sistema no lugar da seta nativa do navegador. */
export function CampoSelect({ className = "", ...props }: ComponentProps<"select">) {
  return (
    <span className="relative block">
      <select {...props} className={`${className} w-full appearance-none pr-12`} />
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="pointer-events-none absolute top-1/2 right-4 h-3 w-3 -translate-y-1/2 text-tinta"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 4l4 4 4-4" />
      </svg>
    </span>
  );
}
