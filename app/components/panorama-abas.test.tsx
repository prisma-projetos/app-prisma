import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { panoramaPT, panoramaVazio } from "@/test/fixtures/dados";
import { PanoramaAbas } from "./panorama-abas";

function painel() {
  return screen.getByRole("tabpanel");
}

describe("PanoramaAbas", () => {
  it("renderiza as abas Negativo, Neutro, Positivo com Neutro selecionada", () => {
    render(<PanoramaAbas panorama={panoramaPT} />);
    const abas = screen.getAllByRole("tab");
    expect(abas.map((a) => a.textContent?.split(" (")[0])).toEqual(["Negativo", "Neutro", "Positivo"]);
    expect(abas[1].getAttribute("aria-selected")).toBe("true");
    expect(within(painel()).getByText("Texto do panorama neutro.")).toBeTruthy();
  });

  it("identifica o texto como gerado por IA, com o modelo", () => {
    render(<PanoramaAbas panorama={panoramaPT} />);
    expect(within(painel()).getByText("Gerado por IA · qwen2.5:3b")).toBeTruthy();
  });

  it("exibe janela por extenso, total de matérias, temas e avisos", () => {
    render(<PanoramaAbas panorama={panoramaPT} />);
    const p = within(painel());
    expect(p.getByText(/Panorama de setembro de 2026/).textContent).toContain("151 matérias");
    expect(p.getByText("Lula · 34 ocorrências")).toBeTruthy();
    expect(p.getByText("Divergências registradas na verificação automática")).toBeTruthy();
    expect(p.getByText(/declarou 12 ocorrências/)).toBeTruthy();
  });

  it("deixa as fontes recolhidas por padrão e abre ao clicar no título", () => {
    render(<PanoramaAbas panorama={panoramaPT} />);
    const titulo = within(painel()).getByText("Fontes (2)");
    const bloco = titulo.closest("details")!;
    expect(titulo.tagName).toBe("SUMMARY");
    expect(bloco.open).toBe(false);

    fireEvent.click(titulo);
    expect(bloco.open).toBe(true);
    expect(within(bloco).getAllByRole("link")).toHaveLength(4);
  });

  it("recolhe as fontes de novo ao trocar de aba", () => {
    render(<PanoramaAbas panorama={panoramaPT} />);
    fireEvent.click(within(painel()).getByText("Fontes (2)"));
    fireEvent.click(screen.getByRole("tab", { name: /^Positivo/ }));
    expect(within(painel()).getByText("Fontes (1)").closest("details")!.open).toBe(false);
  });

  it("lista as fontes com link seguro, veículo ou domínio e data", () => {
    render(<PanoramaAbas panorama={panoramaPT} />);
    const fontes = within(painel()).getByText("Fontes (2)").closest("details")!;
    const links = within(fontes as HTMLElement).getAllByRole("link", { hidden: true });
    expect(links.filter((l) => l.textContent?.startsWith("Ler matéria")).map((l) => l.getAttribute("href"))).toEqual(["https://www.cartacapital.com.br/materia-2", "https://g1.globo.com/materia-1"]);
    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
    expect(links.every((l) => l.textContent?.includes("(abre em nova aba)"))).toBe(true);
    // 02:34 UTC ainda é dia 01 em Brasília
    expect(fontes.textContent).toContain("01/09/2026");
  });

  it("não exibe o texto de um eixo sem fontes", () => {
    render(<PanoramaAbas panorama={panoramaPT} />);
    fireEvent.click(screen.getByRole("tab", { name: /^Negativo/ }));
    expect(screen.queryByText("Texto negativo sem fonte.")).toBeNull();
    expect(
      within(painel()).getByText("Não há panorama negativo para este período.")
    ).toBeTruthy();
  });

  it("mostra mensagem para eixo ausente na resposta", () => {
    render(
      <PanoramaAbas
        panorama={{ ...panoramaPT, eixos: panoramaPT.eixos!.filter((e) => e.eixo !== "positivo") }}
      />
    );
    fireEvent.click(screen.getByRole("tab", { name: /^Positivo/ }));
    expect(
      within(painel()).getByText("Não há panorama positivo para este período.")
    ).toBeTruthy();
  });

  it("troca de aba ao clicar", () => {
    render(<PanoramaAbas panorama={panoramaPT} />);
    fireEvent.click(screen.getByRole("tab", { name: /^Positivo/ }));
    expect(within(painel()).getByText("Texto do panorama positivo.")).toBeTruthy();
  });

  it("mostra mensagem quando não há eixos", () => {
    render(<PanoramaAbas panorama={panoramaVazio} />);
    expect(screen.getByText("Ainda não há panorama para esta entidade.")).toBeTruthy();
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
  });
});

it("agrupa alfabeticamente, ordena datas e recusa URLs inseguras", () => {
  render(<PanoramaAbas panorama={{ eixos: [{ eixo: "neutro", texto: "Panorama", fontes: [
    { veiculo: "Zulu", url: "https://z.com/antiga", dataPublicacao: "2026-09-01" },
    { veiculo: "Alfa", url: "https://a.com/materia" },
    { veiculo: "Zulu", url: "https://z.com/nova?x=1", dataPublicacao: "2026-09-20" },
    { veiculo: "Inseguro", url: "javascript:alert(1)" },
    { url: "inválida" },
  ] }] }} />);
  const bloco = screen.getByText("Fontes (5)").closest("details")!;
  fireEvent.click(screen.getByText("Fontes (5)"));
  expect(within(bloco).getAllByRole("heading").map(h => h.textContent?.split(" (abre")[0])).toEqual(["Alfa · página inicial", "Outros", "Zulu · página inicial"]);
  expect(within(bloco).getByRole("link", { name: /^Alfa\s?· página inicial/ }).getAttribute("href")).toBe("https://a.com/");
  const links = within(bloco).getAllByRole("link");
  expect(links.map(l => l.getAttribute("href"))).toEqual(["https://a.com/", "https://a.com/materia", "https://z.com/", "https://z.com/nova?x=1", "https://z.com/antiga"]);
  expect(within(bloco).getAllByText("Ler matéria")).toHaveLength(2);
});

it("navega entre abas pelo teclado e mantém um único ponto de tabulação", () => {
  render(<PanoramaAbas panorama={panoramaPT} />);
  const neutro = screen.getByRole("tab", { name: /^Neutro/ });
  neutro.focus();
  fireEvent.keyDown(neutro, { key: "ArrowRight" });
  const positivo = screen.getByRole("tab", { name: /^Positivo/ });
  expect(document.activeElement).toBe(positivo);
  expect(positivo.getAttribute("aria-selected")).toBe("true");
  expect(screen.getAllByRole("tab").filter(tab => tab.tabIndex === 0)).toHaveLength(1);
  fireEvent.keyDown(positivo, { key: "Home" });
  expect(screen.getByRole("tab", { name: /^Negativo/ }).getAttribute("aria-selected")).toBe("true");
});

it("separa panorama gerado das fontes e mantém links dos temas rastreáveis", () => {
  render(<PanoramaAbas panorama={panoramaPT} />);
  const figura = screen.getByText("Gerado por IA · qwen2.5:3b").closest("figure")!;
  expect(figura.textContent).toContain("Texto do panorama neutro.");
  expect(within(figura).queryByRole("link")).toBeNull();
  const tema = screen.getByText("Lula · 34 ocorrências").closest("details")!;
  fireEvent.click(screen.getByText("Lula · 34 ocorrências"));
  const link = within(tema).getByRole("link", { name: /Ler matéria publicada por G1/ });
  expect(link.getAttribute("href")).toBe("https://g1.globo.com/materia-1");
  expect(link.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
});
