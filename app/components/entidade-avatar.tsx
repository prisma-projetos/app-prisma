"use client";

import { useState } from "react";

interface EntidadeAvatarProps {
  nome: string;
  rotulo?: string;
  imagemUrl?: string | null;
  variante: "partido" | "politico";
  tamanho?: number;
  /** Exibe o rótulo abaixo da imagem quando ele não está no conteúdo adjacente. */
  mostrarNome?: boolean;
}

export function EntidadeAvatar({
  nome,
  rotulo = nome,
  imagemUrl,
  variante,
  tamanho = 64,
  mostrarNome = false,
}: EntidadeAvatarProps) {
  const circular = variante === "politico";
  // Guarda a URL que falhou: se a imagem mudar, uma nova tentativa é feita.
  const [urlComFalha, setUrlComFalha] = useState<string | null>(null);
  const exibirImagem = Boolean(imagemUrl) && imagemUrl !== urlComFalha;

  return (
    <span
      title={rotulo}
      className="relative inline-flex min-w-0 max-w-full flex-col items-center gap-2"
    >
      <span
        className={`flex shrink-0 items-center justify-center overflow-hidden ${
          circular ? "rounded-full bg-papel-2" : "bg-placa-logo"
        }`}
        style={{ width: tamanho, height: tamanho }}
      >
        {exibirImagem ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imagemUrl ?? undefined}
            alt=""
            onError={() => setUrlComFalha(imagemUrl ?? null)}
            className={
              circular ? "h-full w-full object-cover" : "h-3/4 w-3/4 object-contain"
            }
          />
        ) : (
          <AvatarFallback circular={circular} nome={nome} />
        )}
      </span>
      {mostrarNome ? (
        <span
          className="w-full max-w-[18ch] break-words text-center text-apoio text-tinta-2"
        >
          {rotulo}
        </span>
      ) : null}
    </span>
  );
}

function AvatarFallback({ circular, nome }: { circular: boolean; nome: string }) {
  if (circular) {
    return <PersonIcon />;
  }

  return (
    <span className={`max-w-full px-1 text-center font-semibold text-[#474747] ${nome.length > 5 ? "break-all text-[12px] leading-4" : "text-lg"}`}>
      {nome.toUpperCase()}
    </span>
  );
}

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className="h-1/2 w-1/2 text-tinta-3"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path
        d="M4 20c0-4.418 3.582-7 8-7s8 2.582 8 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
