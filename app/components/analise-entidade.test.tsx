import { fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { panoramaPT, sentimentoPT, sentimentoVazio, temasPT } from "@/test/fixtures/dados";
import { navegacao } from "@/test/navegacao";
import { chamadasPara, mockApi, renderComQuery } from "@/test/utils";
import { AnaliseEntidade } from "./analise-entidade";

vi.mock("next/navigation", async () => (await import("@/test/navegacao")).mockNextNavigation());

function rotas(extra: Record<string, unknown> = {}) {
  return mockApi({
    "analise/sentimento": sentimentoPT,
    "analise/por-tema": temasPT,
    "analise/panorama": panoramaPT,
    ...extra,
  });
}

describe("Seletor de janela (spec 018)", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-09-26T12:00:00Z"));
  });
  afterEach(() => vi.useRealTimers());

  it("oferece Todo o período e os 12 últimos meses", () => {
    navegacao.reset("/partidos/13");
    rotas();
    renderComQuery(<AnaliseEntidade entidade={{ nrPartido: 13 }} />);
    const seletor = screen.getByRole("combobox", { name: "Janela (mês das matérias)" }) as HTMLSelectElement;
    const opcoes = [...seletor.options].map((o) => o.textContent);
    expect(opcoes).toHaveLength(13);
    expect(opcoes.slice(0, 3)).toEqual(["Todo o período", "setembro de 2026", "agosto de 2026"]);
    expect(opcoes.at(-1)).toBe("outubro de 2025");
  });

  it("sem janela, nenhuma análise recebe de, ate ou janela", async () => {
    navegacao.reset("/partidos/13");
    const fetchMock = rotas();
    renderComQuery(<AnaliseEntidade entidade={{ nrPartido: 13 }} />);
    await waitFor(() => expect(chamadasPara(fetchMock, "analise/panorama")).toHaveLength(1));
    for (const caminho of ["analise/sentimento", "analise/por-tema", "analise/panorama"]) {
      const [params] = chamadasPara(fetchMock, caminho);
      expect([params.has("de"), params.has("ate"), params.has("janela")]).toEqual([false, false, false]);
    }
    expect(await screen.findByText("Janela: setembro de 2026 (a mais recente)")).toBeTruthy();
  });

  it("com ?janela=2026-08, filtra por datas e o panorama por janela", async () => {
    navegacao.reset("/partidos/13", "janela=2026-08");
    const fetchMock = rotas({ "analise/panorama": { ...panoramaPT, janela: "2026-08" } });
    renderComQuery(<AnaliseEntidade entidade={{ nrPartido: 13 }} />);
    await waitFor(() => expect(chamadasPara(fetchMock, "analise/panorama")).toHaveLength(1));
    for (const caminho of ["analise/sentimento", "analise/por-tema"]) {
      const [params] = chamadasPara(fetchMock, caminho);
      expect(Object.fromEntries(params)).toEqual({ nrPartido: "13", de: "2026-08-01", ate: "2026-08-31" });
    }
    expect(Object.fromEntries(chamadasPara(fetchMock, "analise/panorama")[0])).toEqual({ nrPartido: "13", janela: "2026-08" });
    expect(await screen.findByText(/Parágrafos sobre PT por sentimento, em agosto de 2026\./)).toBeTruthy();
    expect(await screen.findByText(/Em quantas matérias cada tema aparece, em agosto de 2026\./)).toBeTruthy();
    expect(screen.getByText(/Análise automática de 15\.887 parágrafos publicados em agosto de 2026/)).toBeTruthy();
    expect(await screen.findByText("Janela: agosto de 2026")).toBeTruthy();
  });

  it("janela inválida é ignorada", async () => {
    navegacao.reset("/partidos/13", "janela=2026-13");
    const fetchMock = rotas();
    renderComQuery(<AnaliseEntidade entidade={{ nrPartido: 13 }} />);
    await waitFor(() => expect(chamadasPara(fetchMock, "analise/sentimento")).toHaveLength(1));
    expect(chamadasPara(fetchMock, "analise/sentimento")[0].has("de")).toBe(false);
    expect((screen.getByRole("combobox", { name: "Janela (mês das matérias)" }) as HTMLSelectElement).value).toBe("");
  });

  it("escolher um mês grava ?janela= e preserva os outros parâmetros", () => {
    navegacao.reset("/partidos/13", "q=maria&cargo=SENADOR&pagina=2");
    rotas();
    renderComQuery(<AnaliseEntidade entidade={{ nrPartido: 13 }} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Janela (mês das matérias)" }), { target: { value: "2026-08" } });
    expect(navegacao.replace).toHaveBeenLastCalledWith("/partidos/13?q=maria&cargo=SENADOR&pagina=2&janela=2026-08", { scroll: false });
  });

  it("voltar para Todo o período remove janela da URL", () => {
    navegacao.reset("/partidos/13", "janela=2026-08&q=maria");
    rotas();
    renderComQuery(<AnaliseEntidade entidade={{ nrPartido: 13 }} />);
    fireEvent.change(screen.getByRole("combobox", { name: "Janela (mês das matérias)" }), { target: { value: "" } });
    expect(navegacao.replace).toHaveBeenLastCalledWith("/partidos/13?q=maria", { scroll: false });
  });

  it("estados vazios citam o mês", async () => {
    navegacao.reset("/partidos/13", "janela=2026-09");
    rotas({
      "analise/sentimento": { ...sentimentoVazio, nome: "PT" },
      "analise/por-tema": { ...temasPT, temas: [] },
      "analise/panorama": { ...panoramaPT, janela: "2026-09", eixos: [] },
    });
    renderComQuery(<AnaliseEntidade entidade={{ nrPartido: 13 }} />);
    expect(await screen.findByText("Ainda não há parágrafos analisados sobre PT em setembro de 2026.")).toBeTruthy();
    expect(await screen.findByText("Ainda não há temas identificados sobre PT em setembro de 2026.")).toBeTruthy();
    expect(await screen.findByText("Ainda não há panorama sobre PT em setembro de 2026.")).toBeTruthy();
  });
});
