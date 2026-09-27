import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SCRIPT_TEMA_INICIAL } from "./tema";

function sistema(escuro: boolean) {
  vi.stubGlobal("matchMedia", (consulta: string) => ({
    matches: consulta.includes("dark") ? escuro : !escuro,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

describe("script de tema inicial (spec 020)", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });
  afterEach(() => vi.unstubAllGlobals());

  it("segue o sistema quando não há escolha na sessão", () => {
    sistema(true);
    new Function(SCRIPT_TEMA_INICIAL)();
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("a escolha da sessão vence o sistema", () => {
    sistema(true);
    sessionStorage.setItem("prisma-theme", "light");
    new Function(SCRIPT_TEMA_INICIAL)();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("apaga e ignora a escolha antiga do localStorage", () => {
    sistema(false);
    localStorage.setItem("prisma-theme", "dark");
    new Function(SCRIPT_TEMA_INICIAL)();
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("prisma-theme")).toBeNull();
  });
});
