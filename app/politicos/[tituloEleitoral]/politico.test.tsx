import { screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TEXTO_DISCLAIMER } from "@/app/components/disclaimer";
import { panoramaPT, politicoDetalhe, sentimentoPT } from "@/test/fixtures/dados";
import { NotFoundError } from "@/test/navegacao";
import { chamadasPara, erroApi, mockApi, renderComQuery } from "@/test/utils";
import PoliticoPage from "./page";
import { PoliticoView } from "./politico-view";

vi.mock("next/navigation", async () => (await import("@/test/navegacao")).mockNextNavigation());

const TITULO = "016828001937";

function rotas(extra: Record<string, unknown> = {}) {
  return mockApi({
    "politicos/detalhe": politicoDetalhe,
    "analise/sentimento": sentimentoPT,
    "analise/panorama": panoramaPT,
    ...extra,
  });
}

describe("Página de político: rota", () => {
  it.each(["abc", "12a", "-1"])("/politicos/%s → notFound sem chamar a API", async (t) => {
    const fetchMock = mockApi({});
    await expect(
      PoliticoPage({ params: Promise.resolve({ tituloEleitoral: t }) } as never)
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("preserva zeros à esquerda do título eleitoral", async () => {
    const elemento = await PoliticoPage({
      params: Promise.resolve({ tituloEleitoral: TITULO }),
    } as never);
    expect(elemento.props).toEqual({ tituloEleitoral: TITULO });
  });
});

describe("Página de político: conteúdo", () => {
  it("mostra 'Político não encontrado' quando a API responde 404", async () => {
    rotas({ "politicos/detalhe": erroApi(404) });
    renderComQuery(<PoliticoView tituloEleitoral="000" />);
    expect(await screen.findByText("Político não encontrado.")).toBeTruthy();
  });

  it("usa nomeSocial quando presente e nome caso contrário", async () => {
    rotas();
    const { unmount } = renderComQuery(<PoliticoView tituloEleitoral={TITULO} />);
    expect(
      await screen.findByRole("heading", { level: 1, name: "AARON SALLES FERNANDES SILVA TORRES" })
    ).toBeTruthy();
    unmount();

    rotas({
      "politicos/detalhe": {
        ...politicoDetalhe,
        politico: { ...politicoDetalhe.politico, nomeSocial: "AARON TORRES" },
      },
    });
    renderComQuery(<PoliticoView tituloEleitoral={TITULO} />);
    expect(await screen.findByRole("heading", { level: 1, name: "AARON TORRES" })).toBeTruthy();
  });

  it("cabeçalho usa a candidatura mais recente (maior ano, depois maior turno)", async () => {
    rotas();
    const { container } = renderComQuery(<PoliticoView tituloEleitoral={TITULO} />);
    const h1 = await screen.findByRole("heading", { level: 1 });
    const resumo = h1.nextElementSibling as HTMLElement;
    expect(resumo.textContent).toBe("GOVERNADOR · MS · PT");
    expect(within(resumo).getByRole("link", { name: "PT" }).getAttribute("href")).toBe(
      "/partidos/13"
    );
    expect(container.querySelector('img[src="https://minio.test/2026-t2.jpg"]')).not.toBeNull();
  });

  it("lista todas as candidaturas por ano decrescente, com — para nulos", async () => {
    rotas();
    renderComQuery(<PoliticoView tituloEleitoral={TITULO} />);
    await screen.findByRole("heading", { name: "Candidaturas" });
    const linhas = screen.getAllByRole("row").slice(1);
    expect(linhas.map((l) => l.firstElementChild?.textContent)).toEqual(["2026", "2026", "2022"]);
    expect(linhas[0].textContent).toContain("GOVERNADOR");
    expect(linhas[0].lastElementChild?.textContent).toBe("—");
    expect(within(linhas[2]).getByRole("link", { name: "PSB" }).getAttribute("href")).toBe(
      "/partidos/40"
    );
  });

  it("mostra mensagem quando não há candidaturas", async () => {
    rotas({ "politicos/detalhe": { ...politicoDetalhe, candidaturas: [] } });
    renderComQuery(<PoliticoView tituloEleitoral={TITULO} />);
    expect(await screen.findByText("Nenhuma candidatura registrada.")).toBeTruthy();
  });

  it("exibe disclaimer, sentimento e panorama consultando por tituloEleitoral", async () => {
    const fetchMock = rotas();
    renderComQuery(<PoliticoView tituloEleitoral={TITULO} />);
    expect(screen.getByText(TEXTO_DISCLAIMER)).toBeTruthy();
    expect(await screen.findByText(/Baseado em 15\.887 parágrafos/)).toBeTruthy();
    expect(await screen.findByText("Texto do panorama neutro.")).toBeTruthy();
    expect(chamadasPara(fetchMock, "analise/panorama")[0].get("tituloEleitoral")).toBe(TITULO);
    expect(chamadasPara(fetchMock, "analise/sentimento")[0].get("tituloEleitoral")).toBe(TITULO);
  });

  it("o erro do panorama não esconde o cabeçalho nem o sentimento", async () => {
    rotas({ "analise/panorama": erroApi(502) });
    renderComQuery(<PoliticoView tituloEleitoral={TITULO} />);
    expect(await screen.findByRole("button", { name: "Tentar de novo" })).toBeTruthy();
    expect(await screen.findByText(/Baseado em 15\.887 parágrafos/)).toBeTruthy();
    expect(await screen.findByRole("heading", { level: 1 })).toBeTruthy();
  });
});
