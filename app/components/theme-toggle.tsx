"use client";

import { useLayoutEffect, useState } from "react";

const STORAGE_KEY = "prisma-theme";
type Tema = "light" | "dark";

function temaAtual(): Tema {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

export function ThemeToggle() {
  const [tema, setTema] = useState<Tema>(temaAtual);

  // Reaplica o atributo após o remount do React Strict Mode em desenvolvimento,
  // que limpa atributos definidos pelo script inline fora do controle do React.
  useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
  }, [tema]);

  function alternar() {
    const proximo: Tema = tema === "dark" ? "light" : "dark";
    setTema(proximo);
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
      aria-label={
        tema === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro"
      }
      title={tema === "dark" ? "Alternar para modo claro" : "Alternar para modo escuro"}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      {tema === "dark" ? <SolIcon /> : <LuaIcon />}
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
