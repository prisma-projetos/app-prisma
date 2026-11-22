import { act, fireEvent, render, screen } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";

afterEach(() => {
  document.documentElement.setAttribute("data-theme", "light");
  vi.restoreAllMocks();
});

describe("hidratação do tema", () => {
  it("hidrata o HTML do servidor com o tema escuro aplicado antes da pintura", async () => {
    const erro = vi.spyOn(console, "error").mockImplementation(() => {});
    const recuperavel = vi.fn();
    const container = document.createElement("div");
    container.innerHTML = renderToString(<ThemeToggle />);
    document.body.append(container);
    document.documentElement.setAttribute("data-theme", "dark");
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, <ThemeToggle />, { onRecoverableError: recuperavel });
    });
    expect(container.querySelector("button")?.textContent).toBe("Modo claro");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(recuperavel).not.toHaveBeenCalled();
    expect(erro).not.toHaveBeenCalled();
    await act(async () => root!.unmount());
    container.remove();
  });
});

describe("tema segue o sistema (spec 020)", () => {
  function sistemaControlavel(escuroInicial: boolean) {
    const ouvintes: ((e: { matches: boolean }) => void)[] = [];
    vi.stubGlobal("matchMedia", () => ({
      matches: escuroInicial,
      addEventListener: (_: string, fn: (e: { matches: boolean }) => void) => ouvintes.push(fn),
      removeEventListener: vi.fn(),
    }));
    return (escuro: boolean) => act(() => ouvintes.forEach((fn) => fn({ matches: escuro })));
  }

  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    document.documentElement.setAttribute("data-theme", "light");
  });

  it("muda junto com o sistema quando não há escolha na sessão", async () => {
    const mudarSistema = sistemaControlavel(false);
    render(<ThemeToggle />);
    await mudarSistema(true);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Modo claro" })).toBeTruthy();
  });

  it("o botão grava só na sessão e a escolha vence a mudança do sistema", async () => {
    const mudarSistema = sistemaControlavel(false);
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole("button", { name: "Modo escuro" }));
    expect(sessionStorage.getItem("prisma-theme")).toBe("dark");
    expect(localStorage.getItem("prisma-theme")).toBeNull();
    await mudarSistema(false);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("no celular o texto some, mas o nome acessível fica", () => {
    sistemaControlavel(false);
    render(<ThemeToggle />);
    const botao = screen.getByRole("button", { name: "Modo escuro" });
    expect(botao.querySelector("span")?.className).toContain("hidden sm:inline");
  });
});
