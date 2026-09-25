import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SENTIMENTO_COR } from "@/app/lib/sentimento";
import { sentimentoPT, sentimentoVazio } from "@/test/fixtures/dados";
import { SentimentoResumo } from "./sentimento-resumo";

describe("SentimentoResumo", () => {
  it("exibe Negativo, Neutro, Positivo nessa ordem, independentemente da ordem da API", () => {
    const { container } = render(<SentimentoResumo resumo={sentimentoPT} />);
    const legenda = [...container.querySelectorAll("li[data-sentimento]")];
    expect(legenda.map((li) => li.getAttribute("data-sentimento"))).toEqual([
      "negativo",
      "neutro",
      "positivo",
    ]);
    const barra = [...container.querySelectorAll("span[data-sentimento]")];
    expect(barra.map((s) => s.getAttribute("data-sentimento"))).toEqual([
      "negativo",
      "neutro",
      "positivo",
    ]);
  });

  it("exibe rótulo, percentual e total de cada sentimento", () => {
    render(<SentimentoResumo resumo={sentimentoPT} />);
    expect(screen.getByText("Negativo")).toBeTruthy();
    expect(screen.getByText(/5,9% · 931 parágrafos/)).toBeTruthy();
    expect(screen.getByText(/84,6% · 13\.432 parágrafos/)).toBeTruthy();
    expect(screen.getByText(/9,6% · 1\.524 parágrafos/)).toBeTruthy();
  });

  it("calcula a largura da barra pelos totais, fechando 100%", () => {
    const { container } = render(<SentimentoResumo resumo={sentimentoPT} />);
    const larguras = [...container.querySelectorAll<HTMLElement>("span[data-sentimento]")].map(
      (s) => parseFloat(s.style.width)
    );
    expect(larguras.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 5);
  });

  it("exibe o rodapé de proveniência", () => {
    render(<SentimentoResumo resumo={sentimentoPT} />);
    expect(
      screen.getByText(/Baseado em 15\.887 parágrafos/).textContent
    ).toContain("método lexicon-baseline-v1 (versão v1)");
  });

  it("mostra a mensagem de vazio quando não há parágrafos", () => {
    render(<SentimentoResumo resumo={sentimentoVazio} />);
    expect(
      screen.getByText("Ainda não há parágrafos analisados sobre esta entidade.")
    ).toBeTruthy();
  });

  it("não usa verde nem vermelho nas cores dos sentimentos", () => {
    for (const classes of Object.values(SENTIMENTO_COR)) {
      expect(classes).not.toMatch(/(green|emerald|lime|red|rose)-/);
    }
  });
});
