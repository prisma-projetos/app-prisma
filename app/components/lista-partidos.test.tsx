import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { partidos } from "@/test/fixtures/dados";
import { chamadasPara, mockApi, renderComQuery } from "@/test/utils";
import Home from "@/app/page";
import { ListaPartidos } from "./lista-partidos";

vi.mock("next/navigation", async () => (await import("@/test/navegacao")).mockNextNavigation());

describe("Home: ListaPartidos", () => {
  it("mostra título e contagem recebida", async () => {
    mockApi({ partidos });
    renderComQuery(<Home />);
    expect(screen.getByRole("heading", { level: 2, name: "Partidos, de A a Z" })).toBeTruthy();
    expect(await screen.findByText("3 partidos, em ordem alfabética pela sigla.")).toBeTruthy();
  });

  it("preserva identificação sem nome, sigla ou logo e após falha da imagem", async () => {
    mockApi({ partidos: [{ numero: 1 }, { numero: 2, sigla: "XYZ", urlLogo: "https://minio.test/quebrada.svg" }] });
    renderComQuery(<ListaPartidos />);
    const fallback = await screen.findByRole("link", { name: "Partido nº 1, número 1" });
    expect(within(fallback).getByText("nº 1")).toBeTruthy();
    const link = screen.getByRole("link", { name: "XYZ, número 2" });
    fireEvent.error(link.querySelector("img")!);
    expect(link.querySelector("img")).toBeNull();
    expect(within(link).getAllByText("XYZ")).toHaveLength(2);
  });

  it("exibe fichas ordenadas por sigla com nome, número e link acessível", async () => {
    mockApi({ partidos });
    const { container } = renderComQuery(<ListaPartidos />);

    const links = await screen.findAllByRole("link");
    expect(links.map((l) => l.getAttribute("aria-label"))).toEqual(["AGIR, Agir, número 36", "AVANTE, Avante, número 70", "PT, Partido dos Trabalhadores, número 13"]);
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/partidos/36",
      "/partidos/70",
      "/partidos/13",
    ]);
    expect(container.querySelectorAll("img")[2].getAttribute("src")).toBe(
      "https://minio.test/PT.svg"
    );
    expect(within(links[2]).getByText("Partido dos Trabalhadores")).toBeTruthy();
    expect(within(links[2]).getByText("nº 13")).toBeTruthy();
  });

  it("exibe o skeleton durante o carregamento", () => {
    mockApi({ partidos: () => new Promise<Response>(() => {}) });
    renderComQuery(<ListaPartidos />);
    expect(screen.getByRole("status", { name: "Carregando" })).toBeTruthy();
  });

  it("exibe erro com 'Tentar de novo', que refaz a requisição", async () => {
    let falhar = true;
    const fetchMock = mockApi({
      partidos: () =>
        falhar ? Response.json({ erro: "x" }, { status: 500 }) : Response.json(partidos),
    });
    renderComQuery(<ListaPartidos />);

    const botao = await screen.findByRole("button", { name: "Tentar de novo" });
    falhar = false;
    fireEvent.click(botao);

    await screen.findAllByRole("link");
    expect(chamadasPara(fetchMock, "partidos")).toHaveLength(2);
  });

  it("exibe mensagem para lista vazia", async () => {
    mockApi({ partidos: [] });
    renderComQuery(<ListaPartidos />);
    await waitFor(() => expect(screen.getByText("Nenhum partido encontrado.")).toBeTruthy());
  });
});
