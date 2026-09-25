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
    expect(abas.map((a) => a.textContent)).toEqual(["Negativo", "Neutro", "Positivo"]);
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

  it("lista as fontes com link seguro, veículo ou domínio e data", () => {
    render(<PanoramaAbas panorama={panoramaPT} />);
    const fontes = within(painel()).getByText("Fontes (2)").closest("section")!;
    const links = within(fontes as HTMLElement).getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual(["G1", "cartacapital.com.br"]);
    for (const link of links) {
      expect(link.getAttribute("target")).toBe("_blank");
      expect(link.getAttribute("rel")).toBe("noopener noreferrer");
    }
    expect(links[0].getAttribute("href")).toBe("https://g1.globo.com/materia-1");
    // 02:34 UTC ainda é dia 01 em Brasília
    expect(fontes.textContent).toContain("01/09/2026");
  });

  it("não exibe o texto de um eixo sem fontes", () => {
    render(<PanoramaAbas panorama={panoramaPT} />);
    fireEvent.click(screen.getByRole("tab", { name: "Negativo" }));
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
    fireEvent.click(screen.getByRole("tab", { name: "Positivo" }));
    expect(
      within(painel()).getByText("Não há panorama positivo para este período.")
    ).toBeTruthy();
  });

  it("troca de aba ao clicar", () => {
    render(<PanoramaAbas panorama={panoramaPT} />);
    fireEvent.click(screen.getByRole("tab", { name: "Positivo" }));
    expect(within(painel()).getByText("Texto do panorama positivo.")).toBeTruthy();
  });

  it("mostra mensagem quando não há eixos", () => {
    render(<PanoramaAbas panorama={panoramaVazio} />);
    expect(screen.getByText("Ainda não há panorama para esta entidade.")).toBeTruthy();
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
  });
});
