import { fireEvent, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { partidos } from "@/test/fixtures/dados";
import { chamadasPara, mockApi, renderComQuery } from "@/test/utils";
import { ListaPartidos } from "./lista-partidos";

describe("Home: ListaPartidos", () => {
  it("exibe um avatar por partido, ordenado por sigla, com logo e link", async () => {
    mockApi({ partidos });
    const { container } = renderComQuery(<ListaPartidos />);

    const links = await screen.findAllByRole("link");
    expect(links.map((l) => l.getAttribute("aria-label"))).toEqual(["AGIR", "AVANTE", "PT"]);
    expect(links.map((l) => l.getAttribute("href"))).toEqual([
      "/partidos/36",
      "/partidos/70",
      "/partidos/13",
    ]);
    expect(container.querySelectorAll("img")[2].getAttribute("src")).toBe(
      "https://minio.test/PT.svg"
    );
    expect(container.querySelector('[title="PT — PARTIDO DOS TRABALHADORES"]')).not.toBeNull();
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
