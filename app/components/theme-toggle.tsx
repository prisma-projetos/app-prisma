"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "prisma-theme";
type Tema = "light" | "dark";

function temaAtual(): Tema {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

function observarTema(notificar: () => void) {
  window.addEventListener("prisma-theme-change", notificar);
  return () => window.removeEventListener("prisma-theme-change", notificar);
}

function temaServidor(): Tema {
  return "light";
}

export function ThemeToggle() {
  // A primeira árvore hidratada é igual à do servidor. O snapshot do navegador
  // lê em seguida o tema que o script já aplicou antes da primeira pintura.
  const tema = useSyncExternalStore(observarTema, temaAtual, temaServidor);

  function alternar() {
    const proximo: Tema = tema === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", proximo);
    window.dispatchEvent(new Event("prisma-theme-change"));
    try {
      localStorage.setItem(STORAGE_KEY, proximo);
    } catch {
      // localStorage indisponível: a escolha vale apenas para a sessão atual.
    }
  }

  return (
    <button
      type="button"
      onClick={alternar}
      className="flex min-h-12 items-center justify-center gap-2 rounded-full border-2 border-tinta bg-papel px-4 text-apoio text-tinta hover:bg-papel-2"
    >
      {tema === "dark" ? <SolIcon /> : <LuaIcon />}
      <span>{tema === "dark" ? "Modo claro" : "Modo escuro"}</span>
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
