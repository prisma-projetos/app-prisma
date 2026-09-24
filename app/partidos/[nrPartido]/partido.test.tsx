import { act, fireEvent, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TEXTO_DISCLAIMER } from "@/app/components/disclaimer";
import {
  panoramaPT,
  paginaDeCandidatos,
  partidoPT,
  sentimentoPT,
} from "@/test/fixtures/dados";
import { navegacao, NotFoundError } from "@/test/navegacao";
import { chamadasPara, erroApi, mockApi, renderComQuery } from "@/test/utils";
import PartidoPage from "./page";
import { PartidoView } from "./partido-view";

vi.mock("next/navigation", async () => (await import("@/test/navegacao")).mockNextNavigation());

function rotasPT(extra: Record<string, unknown> = {}) {
  return mockApi({
    "partidos/detalhe": partidoPT,
    "analise/sentimento": sentimentoPT,
    "analise/panorama": panoramaPT,
    politicos: (p: URLSearchParams) =>
      Response.json(paginaDeCandidatos(Number(p.get("pagina") ?? 0), 3)),
    ...extra,
  });
}

beforeEach(() => navegacao.reset("/partidos/13"));

describe("Página de partido: rota", () => {
  it.each(["abc", "0", "-1", "13.5", "013"])(
    "/partidos/%s → notFound sem chamar a API",
    async (nr) => {
      const fetchMock = mockApi({});
      await expect(
        PartidoPage({ params: Promise.resolve({ nrPartido: nr }) } as never)
      ).rejects.toBeInstanceOf(NotFoundError);
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it("/partidos/13 renderiza a view com o número", async () => {
    const elemento = await PartidoPage({ params: Promise.resolve({ nrPartido: "13" }) } as never);
    expect(elemento.props).toEqual({ nrPartido: 13 });
  });
});

describe("Página de partido: conteúdo", () => {
  it("mostra sigla, nome, número e logo", async () => {
    rotasPT();
    const { container } = renderComQuery(<PartidoView nrPartido={13} />);
    expect(await screen.findByRole("heading", { level: 1, name: "PT" })).toBeTruthy();
    expect(screen.getByText("PARTIDO DOS TRABALHADORES · nº 13")).toBeTruthy();
    expect(container.querySelector('img[src="https://minio.test/PT.svg"]')).not.toBeNull();
  });

  it("mostra 'Partido não encontrado' quando a API responde 404", async () => {
    rotasPT({ "partidos/detalhe": erroApi(404) });
    renderComQuery(<PartidoView nrPartido={99} />);
    expect(await screen.findByText("Partido não encontrado.")).toBeTruthy();
    expect(screen.getByRole("link", { name: /Voltar/ }).getAttribute("href")).toBe("/");
  });

  it("exibe o disclaimer, o sentimento e o panorama consultando por nrPartido", async () => {
    const fetchMock = rotasPT();
    renderComQuery(<PartidoView nrPartido={13} />);
    expect(screen.getByText(TEXTO_DISCLAIMER)).toBeTruthy();
    expect(await screen.findByText(/Baseado em 15\.887 parágrafos/)).toBeTruthy();
    expect(await screen.findByText("Texto do panorama neutro.")).toBeTruthy();
    expect(chamadasPara(fetchMock, "analise/sentimento")[0].get("nrPartido")).toBe("13");
    expect(chamadasPara(fetchMock, "analise/panorama")[0].get("nrPartido")).toBe("13");
  });

  it("o erro de uma seção não esconde as outras", async () => {
    rotasPT({ "analise/sentimento": erroApi(500) });
    renderComQuery(<PartidoView nrPartido={13} />);
    expect(await screen.findByRole("button", { name: "Tentar de novo" })).toBeTruthy();
    expect(await screen.findByText("Texto do panorama neutro.")).toBeTruthy();
    expect(await screen.findByRole("heading", { level: 1, name: "PT" })).toBeTruthy();
    expect(await screen.findByText("CANDIDATO 0-0")).toBeTruthy();
  });
});

describe("Página de partido: políticos", () => {
  it("lista com nrPartido, anoEleicao=2026 e tamanho=48, com foto e link", async () => {
    const fetchMock = rotasPT();
    const { container } = renderComQuery(<PartidoView nrPartido={13} />);

    const link = await screen.findByRole("link", { name: "CANDIDATO 0-0" });
    expect(link.getAttribute("href")).toBe("/politicos/0000");
    expect(container.querySelector('img[src="https://minio.test/0-0.jpg"]')).not.toBeNull();

    const params = chamadasPara(fetchMock, "politicos")[0];
    expect(params.get("nrPartido")).toBe("13");
    expect(params.get("anoEleicao")).toBe("2026");
    expect(params.get("tamanho")).toBe("48");
    expect(params.get("pagina")).toBe("0");
  });

  it("desabilita Anterior/Próxima enquanto a página nova carrega", async () => {
    let liberar: () => void = () => {};
    rotasPT({
      politicos: async (p: URLSearchParams) => {
        if (p.get("pagina") === "1") await new Promise<void>((r) => (liberar = r));
        return Response.json(paginaDeCandidatos(Number(p.get("pagina") ?? 0), 3));
      },
    });
    const { rerender } = renderComQuery(<PartidoView nrPartido={13} />);
    await screen.findByText("CANDIDATO 0-0");

    navegacao.reset("/partidos/13", "pagina=1");
    rerender(<PartidoView nrPartido={13} />);
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Próxima" }).disabled).toBe(true);
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Anterior" }).disabled).toBe(true);

    await act(async () => liberar());
    await screen.findByText("CANDIDATO 1-0");
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Próxima" }).disabled).toBe(false);
  });

  it("pagina pela URL, com Anterior/Próxima desabilitados nas pontas", async () => {
    const fetchMock = rotasPT();
    const { rerender } = renderComQuery(<PartidoView nrPartido={13} />);

    await screen.findByText("Página 1 de 3");
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Anterior" }).disabled).toBe(true);

    fireEvent.click(screen.getByRole("button", { name: "Próxima" }));
    expect(navegacao.replace).toHaveBeenLastCalledWith("/partidos/13?pagina=1", { scroll: false });

    navegacao.reset("/partidos/13", "pagina=2");
    rerender(<PartidoView nrPartido={13} />);
    await screen.findByText("CANDIDATO 2-0");
    expect(screen.getByText("Página 3 de 3")).toBeTruthy();
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Próxima" }).disabled).toBe(true);
    expect(screen.getByRole<HTMLButtonElement>("button", { name: "Anterior" }).disabled).toBe(false);
    expect(chamadasPara(fetchMock, "politicos").at(-1)?.get("pagina")).toBe("2");
  });

  it("busca com debounce de 300 ms, voltando para a página 0", async () => {
    navegacao.reset("/partidos/13", "pagina=1");
    rotasPT();
    renderComQuery(<PartidoView nrPartido={13} />);
    await screen.findByText("Página 2 de 3");

    vi.useFakeTimers();
    try {
      fireEvent.change(screen.getByRole("searchbox"), { target: { value: "joao" } });
      act(() => vi.advanceTimersByTime(299));
      expect(navegacao.replace).not.toHaveBeenCalled();
      act(() => vi.advanceTimersByTime(1));
      expect(navegacao.replace).toHaveBeenCalledWith("/partidos/13?q=joao", { scroll: false });
    } finally {
      vi.useRealTimers();
    }
  });

  it("restaura busca e página a partir da URL", async () => {
    navegacao.reset("/partidos/13", "q=joao&pagina=2");
    const fetchMock = rotasPT();
    renderComQuery(<PartidoView nrPartido={13} />);

    await screen.findByText("Página 3 de 3");
    expect(screen.getByRole<HTMLInputElement>("searchbox").value).toBe("joao");
    const params = chamadasPara(fetchMock, "politicos")[0];
    expect(params.get("q")).toBe("joao");
    expect(params.get("pagina")).toBe("2");
  });

  it.each(["-1", "abc"])("trata ?pagina=%s como página 0", async (pagina) => {
    navegacao.reset("/partidos/13", `pagina=${pagina}`);
    const fetchMock = rotasPT();
    renderComQuery(<PartidoView nrPartido={13} />);
    await screen.findByText("Página 1 de 3");
    expect(chamadasPara(fetchMock, "politicos")[0].get("pagina")).toBe("0");
  });

  it("volta para a página 0 quando ?pagina= passa do total", async () => {
    navegacao.reset("/partidos/13", "pagina=9");
    rotasPT({
      politicos: (p: URLSearchParams) =>
        Response.json(
          Number(p.get("pagina")) >= 3
            ? { ...paginaDeCandidatos(9, 3, 0), last: true }
            : paginaDeCandidatos(Number(p.get("pagina")), 3)
        ),
    });
    renderComQuery(<PartidoView nrPartido={13} />);
    await waitFor(() =>
      expect(navegacao.replace).toHaveBeenCalledWith("/partidos/13", { scroll: false })
    );
  });

  it("mostra 'Nenhum político encontrado.' para lista vazia", async () => {
    rotasPT({ politicos: paginaDeCandidatos(0, 0, 0) });
    renderComQuery(<PartidoView nrPartido={13} />);
    const secao = (await screen.findByRole("heading", { name: /Candidatos em 2026/ })).closest(
      "section"
    )!;
    await waitFor(() =>
      expect(within(secao).getByText("Nenhum político encontrado.")).toBeTruthy()
    );
  });
});
