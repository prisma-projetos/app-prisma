import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SENTIMENTO_COR } from "@/app/lib/sentimento";
import { sentimentoPT, sentimentoVazio } from "@/test/fixtures/dados";
import { SentimentoResumo } from "./sentimento-resumo";

describe("SentimentoResumo", () => {
  it("exibe Negativo, Neutro, Positivo nessa ordem, independentemente da ordem da API", () => {
    const { container } = render(<SentimentoResumo resumo={sentimentoPT} />);
    const legenda = [...container.querySelectorAll("tr[data-sentimento]")];
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
    expect(screen.getByRole("rowheader", { name: "Negativo (critica)" })).toBeTruthy();
    expect(screen.getByText("931 parágrafos")).toBeTruthy();
    expect(screen.getByText("13.432 parágrafos")).toBeTruthy();
    expect(screen.getByText("1.524 parágrafos")).toBeTruthy();
  });

  it("calcula a largura da barra pelos totais, fechando 100%", () => {
    const { container } = render(<SentimentoResumo resumo={sentimentoPT} />);
    const larguras = [...container.querySelectorAll<HTMLElement>("span[data-sentimento]")].map(
      (s) => parseFloat(s.style.width)
    );
    expect(larguras.reduce((a, b) => a + b, 0)).toBeCloseTo(100, 5);
  });

  it("explica a base e identifica a figura sem expor detalhes técnicos fora de Saiba mais", () => {
    const { container } = render(<SentimentoResumo resumo={sentimentoPT} />);
    expect(screen.getByText(/Análise automática de 15\.887 parágrafos/)).toBeTruthy();
    expect(container.querySelector("figcaption")?.textContent).toBe("Fig. 1 Parágrafos sobre PT por sentimento, em todo o período. Base: 15.887 parágrafos de matérias que citam PT.");
    expect(screen.getByRole("img").getAttribute("aria-label")).toBe("Negativo 5,9%, Neutro 84,6%, Positivo 9,6%");
    const details = container.querySelector("details")!;
    expect(details.open).toBe(false);
    expect(details.textContent).toContain("Detalhes técnicos: método lexicon-baseline-v1, versão v1.");
    expect(details.textContent).toContain("todos recebem a mesma classificação");
    expect(details.textContent).toContain("não mede opinião pública");
    expect(container.textContent).not.toMatch(/IA|modelo/);
  });

  it("mantém todas as proveniências consultáveis apenas dentro de Saiba mais", () => {
    const proveniencia = [
      { metodo: "lexicon-baseline-v1", pipelineVersion: "pipeline-2026-01", total: 100 },
      { metodo: "lexicon-baseline-v2", pipelineVersion: "pipeline-2026-02", total: 200 },
    ];
    const { container } = render(
      <SentimentoResumo resumo={{ ...sentimentoPT, proveniencia }} />
    );
    const resumo = screen.getByText("Saiba mais: como esta análise funciona");
    const detalhes = resumo.closest("details")!;
    expect(detalhes.open).toBe(false);

    const foraDosDetalhes = container.cloneNode(true) as HTMLElement;
    foraDosDetalhes.querySelectorAll("details").forEach((elemento) => elemento.remove());
    for (const origem of proveniencia) {
      expect(foraDosDetalhes.textContent).not.toContain(origem.metodo);
      expect(foraDosDetalhes.textContent).not.toContain(origem.pipelineVersion);
    }

    fireEvent.click(resumo);
    expect(detalhes.open).toBe(true);
    for (const origem of proveniencia) {
      expect(within(detalhes).getByText(
        `Detalhes técnicos: método ${origem.metodo}, versão ${origem.pipelineVersion}.`
      )).toBeTruthy();
    }
  });

  it("mostra o estado vazio com nome e orientação", () => {
    render(<SentimentoResumo resumo={sentimentoVazio} />);
    expect(screen.getByText("Ainda não há parágrafos analisados sobre AGIR.")).toBeTruthy();
    expect(screen.getByText(/Quando o PRISMA encontrar e analisar matérias que citam AGIR/)).toBeTruthy();
  });

  it("preenche sentimentos ausentes e proveniência ausente", () => {
    const { container } = render(<SentimentoResumo resumo={{ totalParagrafos: 1, porSentimento: [{ sentimento: "neutro", total: 1, percentual: 100 }] }} />);
    expect(screen.getAllByText("0 parágrafos")).toHaveLength(2);
    expect(screen.getAllByText("0,0%")).toHaveLength(2);
    expect(container.querySelector("figcaption")?.textContent).toContain("esta entidade");
    expect(screen.getByText("Detalhes técnicos: método não informado.")).toBeTruthy();
  });

  it("não usa verde nem vermelho nas cores dos sentimentos", () => {
    for (const classes of Object.values(SENTIMENTO_COR)) {
      expect(classes).not.toMatch(/(green|emerald|lime|red|rose)-/);
    }
  });
});

describe("SentimentoResumo: nome da entidade (spec 014)", () => {
  it("formata o nome de pessoa e preserva a sigla de partido", () => {
    const { unmount } = render(
      <SentimentoResumo resumo={{ ...sentimentoVazio, tipoEntidade: "politico", nome: "MARIA DA SILVA" }} />
    );
    expect(screen.getByText("Ainda não há parágrafos analisados sobre Maria da Silva.")).toBeTruthy();
    unmount();
    render(<SentimentoResumo resumo={{ ...sentimentoVazio, tipoEntidade: "partido", nome: "AGIR" }} />);
    expect(screen.getByText("Ainda não há parágrafos analisados sobre AGIR.")).toBeTruthy();
  });
});
