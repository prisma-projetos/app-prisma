import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { AnalisePorTemaResponse } from "@/app/lib/api/types";
import { TemasCitados } from "./temas-citados";

const TEMAS = Array.from({ length: 12 }, (_, i) => ({
  tema: `tema ${i + 1}`,
  total: 40 - i * 3,
  percentual: Number(((40 - i * 3) / 4.23).toFixed(2)),
}));

const RESPOSTA: AnalisePorTemaResponse = {
  tipo: "partido",
  nome: "PSD",
  totalMaterias: 423,
  semTema: 4,
  temas: TEMAS,
};

function linhasDoGrafico() {
  return within(screen.getByRole("list", { name: "Temas" })).getAllByRole("listitem");
}

describe("TemasCitados (spec 017)", () => {
  it("mostra no máximo 10 temas, na ordem da API, com nome e número", () => {
    render(<TemasCitados resposta={RESPOSTA} janela="" />);
    const linhas = linhasDoGrafico();
    expect(linhas).toHaveLength(10);
    expect(linhas.map((l) => l.querySelector("[data-tema]")?.textContent)).toEqual(TEMAS.slice(0, 10).map((t) => t.tema));
    expect(within(linhas[0]).getByText("40")).toBeTruthy();
  });

  it("barras proporcionais ao maior total exibido, só com o token grafico", () => {
    const { container } = render(<TemasCitados resposta={RESPOSTA} janela="" />);
    const barras = [...container.querySelectorAll<HTMLElement>("[data-barra]")];
    expect(Number(barras[0].dataset.proporcao)).toBe(1);
    expect(Number(barras[1].dataset.proporcao)).toBeCloseTo(37 / 40, 5);
    for (const barra of barras) {
      expect(barra.className).toContain("bg-grafico");
      expect(barra.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("a tabela tem os mesmos temas, totais e percentuais", () => {
    render(<TemasCitados resposta={RESPOSTA} janela="" />);
    const grafico = screen.getByRole("button", { name: "Gráfico" });
    const tabela = screen.getByRole("button", { name: "Tabela" });
    expect(grafico.getAttribute("aria-pressed")).toBe("true");
    fireEvent.click(tabela);
    expect(tabela.getAttribute("aria-pressed")).toBe("true");
    const linhas = within(screen.getByRole("table")).getAllByRole("row").slice(1);
    expect(linhas).toHaveLength(10);
    expect([...linhas[0].querySelectorAll("th, td")].map((c) => c.textContent)).toEqual(["tema 1", "40", "9,5%"]);
  });

  it("Ver todos mostra os 12 temas e volta para os 10 primeiros", () => {
    render(<TemasCitados resposta={RESPOSTA} janela="" />);
    fireEvent.click(screen.getByRole("button", { name: "Ver todos os 12 temas" }));
    expect(linhasDoGrafico()).toHaveLength(12);
    fireEvent.click(screen.getByRole("button", { name: "Mostrar só os 10 primeiros" }));
    expect(linhasDoGrafico()).toHaveLength(10);
  });

  it("a legenda começa com Fig. 2 e traz base, sem tema e período", () => {
    render(<TemasCitados resposta={RESPOSTA} janela="2026-08" />);
    const legenda = screen.getByText(/Em quantas matérias cada tema aparece/);
    expect(legenda.textContent).toBe(
      "Fig. 2 Em quantas matérias cada tema aparece, em agosto de 2026. Base: 423 matérias; 4 sem tema identificado. Uma matéria pode ter mais de um tema."
    );
  });

  it("sem temas, mostra o estado vazio desenhado com o nome", () => {
    render(<TemasCitados resposta={{ ...RESPOSTA, temas: [] }} janela="" />);
    expect(screen.getByText("Ainda não há temas identificados sobre PSD.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Tabela" })).toBeNull();
  });

  it("com 10 temas ou menos, não oferece Ver todos", () => {
    render(<TemasCitados resposta={{ ...RESPOSTA, temas: TEMAS.slice(0, 3) }} janela="" />);
    expect(screen.queryByRole("button", { name: /Ver todos/ })).toBeNull();
  });
});
