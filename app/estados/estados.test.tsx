import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Cabecalho } from "@/app/components/cabecalho";
import { lerUf } from "@/app/lib/estados";
import { navegacao, NotFoundError } from "@/test/navegacao";
import EstadosPage from "./page";

vi.mock("next/navigation", async () => (await import("@/test/navegacao")).mockNextNavigation());

afterEach(() => vi.unstubAllEnvs());

describe("página /estados (spec 023)", () => {
  it("mostra o mapa com 27 estados e a lista alfabética, todos apontando para /candidatos?uf=", () => {
    vi.stubEnv("NEXT_PUBLIC_FILTRO_UF", "1");
    render(<EstadosPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Candidatos por estado" })).toBeTruthy();
    const mapa = screen.getByRole("group", { name: "Mapa do Brasil" });
    const noMapa = within(mapa).getAllByRole("link");
    expect(noMapa).toHaveLength(27);
    const rondonia = within(mapa).getByRole("link", { name: "Rondônia (RO)" });
    expect(rondonia.getAttribute("href")).toBe("/candidatos?uf=RO");
    const lista = within(screen.getByRole("list", { name: "Estados em ordem alfabética" })).getAllByRole("link");
    expect(lista).toHaveLength(27);
    expect(lista[0].textContent).toBe("Acre");
    expect(lista[26].textContent).toBe("Tocantins");
    expect(lista[21].getAttribute("href")).toBe("/candidatos?uf=RO");
  });

  it("passar o mouse ou focar um estado desenha o contorno dele em espectro, por cima dos vizinhos", () => {
    vi.stubEnv("NEXT_PUBLIC_FILTRO_UF", "1");
    const { container } = render(<EstadosPage />);
    const mapa = screen.getByRole("group", { name: "Mapa do Brasil" });
    expect(container.querySelector("[data-destaque]")).toBeNull();
    fireEvent.mouseEnter(within(mapa).getByRole("link", { name: "Rondônia (RO)" }));
    const destaque = container.querySelector<SVGPathElement>("[data-destaque]")!;
    expect(destaque.getAttribute("data-destaque")).toBe("RO");
    expect(destaque.getAttribute("stroke")).toMatch(/^url\(#.+\)$/);
    expect(destaque.parentElement?.lastElementChild).toBe(destaque);
    fireEvent.mouseLeave(within(mapa).getByRole("link", { name: "Rondônia (RO)" }));
    expect(container.querySelector("[data-destaque]")).toBeNull();
    fireEvent.focus(within(mapa).getByRole("link", { name: "Bahia (BA)" }));
    expect(container.querySelector("[data-destaque]")?.getAttribute("data-destaque")).toBe("BA");
  });

  it("com o recurso desligado, responde 404", () => {
    expect(() => render(<EstadosPage />)).toThrow(NotFoundError);
  });

  it("lerUf aceita as 27 UFs sem diferenciar caixa", () => {
    expect(lerUf("ro")).toBe("RO");
    expect(lerUf("BR")).toBe("");
    expect(lerUf("xx")).toBe("");
    expect(lerUf(null)).toBe("");
  });
});

describe("link Estados no cabeçalho (spec 023)", () => {
  it("aparece com o recurso ligado, ativo em /estados", () => {
    vi.stubEnv("NEXT_PUBLIC_FILTRO_UF", "1");
    navegacao.reset("/estados");
    render(<Cabecalho />);
    const link = screen.getByRole("link", { name: "Estados" });
    expect(link.getAttribute("href")).toBe("/estados");
    expect(link.getAttribute("aria-current")).toBe("page");
  });

  it("não aparece com o recurso desligado", () => {
    navegacao.reset("/");
    render(<Cabecalho />);
    expect(screen.queryByRole("link", { name: "Estados" })).toBeNull();
  });
});
