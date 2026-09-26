import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { navegacao } from "@/test/navegacao";
import { Cabecalho } from "./cabecalho";
import { Rodape } from "./rodape";
import { TEXTO_DISCLAIMER } from "./disclaimer";

vi.mock("next/navigation", async () => (await import("@/test/navegacao")).mockNextNavigation());

describe("Cabecalho (spec 009)", () => {
  beforeEach(() => {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.clear();
  });

  it("tem a marca com link para a home e a navegação", () => {
    navegacao.reset("/");
    render(<Cabecalho />);
    const banner = screen.getByRole("banner");
    expect(within(banner).getByRole("link", { name: "PRISMA, página inicial" }).getAttribute("href")).toBe("/");
    const nav = within(banner).getByRole("navigation", { name: "Principal" });
    expect(within(nav).getByRole("link", { name: "Partidos" }).getAttribute("href")).toBe("/");
  });

  it.each([
    ["/", "page"],
    ["/partidos/13", "page"],
    ["/politicos/123", null],
  ])("em %s, 'Partidos' tem aria-current=%s", (pathname, esperado) => {
    navegacao.reset(pathname);
    render(<Cabecalho />);
    expect(screen.getByRole("link", { name: "Partidos" }).getAttribute("aria-current")).toBe(esperado);
  });

  it("reflete o modo escuro já aplicado e permite voltar ao claro", () => {
    document.documentElement.setAttribute("data-theme", "dark");
    render(<Cabecalho />);
    fireEvent.click(screen.getByRole("button", { name: "Modo claro" }));
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(localStorage.getItem("prisma-theme")).toBe("light");
    expect(screen.getByRole("button", { name: "Modo escuro" })).toBeTruthy();
  });

  it("o botão de tema mostra o texto do próximo modo e alterna o tema", () => {
    navegacao.reset("/");
    render(<Cabecalho />);
    const botao = screen.getByRole("button", { name: "Modo escuro" });
    fireEvent.click(botao);
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(localStorage.getItem("prisma-theme")).toBe("dark");
    expect(screen.getByRole("button", { name: "Modo claro" })).toBeTruthy();
  });
});

describe("Rodape (spec 009)", () => {
  it("mostra o aviso de IA com o texto exato", () => {
    render(<Rodape />);
    expect(within(screen.getByRole("contentinfo")).getByText(TEXTO_DISCLAIMER)).toBeTruthy();
  });
});
