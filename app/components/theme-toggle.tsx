"use client";

import { useSyncExternalStore } from "react";

import { CHAVE_TEMA } from "@/app/lib/tema";

type Tema = "light" | "dark";
const CONSULTA_ESCURO = "(prefers-color-scheme: dark)";

function escolhaDaSessao(): Tema | null {
  try {
    const valor = sessionStorage.getItem(CHAVE_TEMA);
    return valor === "dark" || valor === "light" ? valor : null;
  } catch {
    return null;
  }
}

function aplicar(tema: Tema) {
  document.documentElement.setAttribute("data-theme", tema);
  window.dispatchEvent(new Event("prisma-theme-change"));
}

function temaAtual(): Tema {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function observarTema(notificar: () => void) {
  window.addEventListener("prisma-theme-change", notificar);
  // O sistema manda enquanto não houver escolha nesta sessão (spec 020).
  const sistema = window.matchMedia?.(CONSULTA_ESCURO);
  const aoMudarSistema = (evento: { matches: boolean }) => {
    if (!escolhaDaSessao()) aplicar(evento.matches ? "dark" : "light");
  };
  sistema?.addEventListener?.("change", aoMudarSistema);
  return () => {
    window.removeEventListener("prisma-theme-change", notificar);
    sistema?.removeEventListener?.("change", aoMudarSistema);
  };
}

function temaServidor(): Tema {
  return "light";
}

export function ThemeToggle() {
  // A primeira árvore hidratada é igual à do servidor. O snapshot do navegador
  // lê em seguida o tema que o script já aplicou antes da primeira pintura.
  const tema = useSyncExternalStore(observarTema, temaAtual, temaServidor);

  const rotulo = tema === "dark" ? "Modo claro" : "Modo escuro";

  function alternar() {
    const proximo: Tema = tema === "dark" ? "light" : "dark";
    aplicar(proximo);
    try {
      sessionStorage.setItem(CHAVE_TEMA, proximo);
    } catch {
      // sessionStorage indisponível: a escolha vale até recarregar a página.
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      aria-label={rotulo}
      className="flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-full border-2 border-tinta bg-papel px-3 text-apoio text-tinta hover:bg-papel-2 sm:px-4"
    >
      {tema === "dark" ? <SolIcon /> : <LuaIcon />}
      {/* No celular, só o ícone; o nome acessível continua no aria-label. */}
      <span className="hidden sm:inline">{rotulo}</span>
    </button>
  );
}

function SolIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 2v2" />
        <path d="M12 20v2" />
        <path d="M4.93 4.93l1.41 1.41" />
        <path d="M17.66 17.66l1.41 1.41" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
        <path d="M4.93 19.07l1.41-1.41" />
        <path d="M17.66 6.34l1.41-1.41" />
      </g>
    </svg>
  );
}

function LuaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
      <path
        d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5Z"
        fill="currentColor"
      />
    </svg>
  );
}
