import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { partidos } from "@/test/fixtures/dados";
import type { PartidoResponse } from "@/app/lib/api/types";
import { navegacao } from "@/test/navegacao";
import { mockApi, renderComQuery } from "@/test/utils";
import Home from "./page";

vi.mock("next/navigation", async () => (await import("@/test/navegacao")).mockNextNavigation());

describe("Home (spec 015)", () => {
  beforeEach(() => navegacao.reset("/"));

  it("abre com a pergunta, a busca e a Fig. 1; o índice vira h2", async () => {
    mockApi({ partidos });
    renderComQuery(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: "Sobre quem você quer saber?" })).toBeTruthy();
    expect(screen.getByText(/mostra o sentimento de cada parágrafo: se critica, se só informa ou se elogia/)).toBeTruthy();
    expect(screen.getByRole("combobox", { name: "Nome do partido ou do candidato" })).toBeTruthy();
    expect(screen.getByText(/A luz branca atravessa o prisma e se separa em cores\./).textContent).toMatch(/^Fig\. 1/);
    expect(screen.getByRole("heading", { level: 2, name: "Partidos, de A a Z" })).toBeTruthy();
    expect(await screen.findByRole("link", { name: /^PT,/ })).toBeTruthy();
  });
});

describe("Índice por letra (spec 024)", () => {
  it("oferece uma letra por inicial de sigla, com âncora na primeira ficha", async () => {
    navegacao.reset("/");
    const lista: PartidoResponse[] = [
      { numero: 13, sigla: "PT", nome: "PARTIDO DOS TRABALHADORES" },
      { numero: 36, sigla: "AGIR", nome: "AGIR" },
      { numero: 70, sigla: "AVANTE", nome: "AVANTE" },
      { numero: 55, sigla: "PSD", nome: "PARTIDO SOCIAL DEMOCRÁTICO" },
    ];
    mockApi({ partidos: lista });
    const { container } = renderComQuery(<Home />);
    const nav = await screen.findByRole("navigation", { name: "Ir para a letra" });
    const letras = [...nav.querySelectorAll("a")];
    expect(letras.map((a) => a.textContent)).toEqual(["A", "P"]);
    expect(letras.map((a) => a.getAttribute("href"))).toEqual(["#letra-A", "#letra-P"]);
    expect(container.querySelector("#letra-A")?.textContent).toContain("AGIR");
    expect(container.querySelector("#letra-P")?.textContent).toContain("PSD");
  });
});
