import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Cabecalho } from "@/app/components/cabecalho";
import type { PartidoResponse } from "@/app/lib/api/types";
import Home from "@/app/page";
import { paginaDeCandidatos, partidos } from "@/test/fixtures/dados";
import { navegacao } from "@/test/navegacao";
import { chamadasPara, erroApi, mockApi, renderComQuery } from "@/test/utils";
import { CandidatosView } from "./candidatos-view";

vi.mock("next/navigation", async () => (await import("@/test/navegacao")).mockNextNavigation());

const PSD: PartidoResponse = { numero: 55, sigla: "PSD", nome: "PARTIDO SOCIAL DEMOCRÁTICO" };
const LISTA_PARTIDOS = [...partidos, PSD];

/** Resposta de /politicos: sem filtros, 20.608 no total; com filtros, a página pedida. */
function rotas({ vazio = false, erro = false } = {}) {
  return mockApi({
    partidos: LISTA_PARTIDOS,
    politicos: erro
      ? erroApi(500)
      : (params: URLSearchParams) => {
          if (params.get("tamanho") === "1") return Response.json({ ...paginaDeCandidatos(0, 1, 1), totalElements: 20608 });
          const pagina = Number(params.get("pagina") ?? 0);
          const resposta = vazio ? paginaDeCandidatos(0, 0, 0) : paginaDeCandidatos(pagina, 3, 2);
          return Response.json({
            ...resposta,
            content: resposta.content.map((c) => ({ ...c, cargo: "SENADOR" })),
          });
        },
  });
}

function pedidosDaLista(fetchMock: ReturnType<typeof mockApi>) {
  return chamadasPara(fetchMock, "politicos").filter((p) => p.get("tamanho") === "48");
}

describe("Página de candidatos (spec 016)", () => {
  beforeEach(() => navegacao.reset("/candidatos"));

  it("mostra o título, o total sem filtros e pede a primeira página", async () => {
    const fetchMock = rotas();
    renderComQuery(<CandidatosView />);
    expect(screen.getByRole("heading", { level: 1, name: "Candidatos em 2026" })).toBeTruthy();
    expect(await screen.findByText("20.608 candidaturas registradas na eleição de 2026, em ordem alfabética.")).toBeTruthy();
    await waitFor(() => expect(pedidosDaLista(fetchMock)).toHaveLength(1));
    expect(Object.fromEntries(pedidosDaLista(fetchMock)[0])).toEqual({ anoEleicao: "2026", pagina: "0", tamanho: "48" });
  });

  it("cada linha tem foto, nome formatado com link e cargo", async () => {
    rotas();
    renderComQuery(<CandidatosView />);
    const link = await screen.findByRole("link", { name: "Candidato 0-0" });
    expect(link.getAttribute("href")).toBe("/politicos/0000");
    const linha = link.closest("li")!;
    expect(within(linha).getByText("Senador")).toBeTruthy();
    expect(linha.querySelector("img")?.getAttribute("src")).toBe("https://minio.test/0-0.jpg");
  });

  it("nome com 2+ letras filtra depois de 300ms e volta à página 1; 1 letra não filtra", async () => {
    navegacao.reset("/candidatos", "pagina=2");
    rotas();
    renderComQuery(<CandidatosView />);
    const campo = screen.getByRole("searchbox", { name: "Nome" });
    fireEvent.change(campo, { target: { value: "m" } });
    await new Promise((r) => setTimeout(r, 400));
    expect(navegacao.replace).not.toHaveBeenCalled();
    fireEvent.change(campo, { target: { value: "maria" } });
    await waitFor(() => expect(navegacao.replace).toHaveBeenCalledWith("/candidatos?q=maria", { scroll: false }));
  });

  it("cargo e partido vão para a URL e se combinam na requisição", async () => {
    const fetchMock = rotas();
    const { rerender } = renderComQuery(<CandidatosView />);
    const partido = screen.getByRole("combobox", { name: "Partido" }) as HTMLSelectElement;
    await waitFor(() => expect(partido.disabled).toBe(false));
    expect([...partido.options].map((o) => o.textContent)).toContain("PSD · Partido Social Democrático");

    fireEvent.change(screen.getByRole("combobox", { name: "Cargo" }), { target: { value: "SENADOR" } });
    expect(navegacao.replace).toHaveBeenLastCalledWith("/candidatos?cargo=SENADOR", { scroll: false });
    rerender(<CandidatosView />);
    fireEvent.change(partido, { target: { value: "55" } });
    expect(navegacao.replace).toHaveBeenLastCalledWith("/candidatos?cargo=SENADOR&partido=55", { scroll: false });
    await waitFor(() => expect(pedidosDaLista(fetchMock).length).toBeGreaterThan(0));
  });

  it("restaura os filtros da URL e converte a página para a API", async () => {
    navegacao.reset("/candidatos", "q=maria&cargo=SENADOR&partido=55&pagina=2");
    const fetchMock = rotas();
    renderComQuery(<CandidatosView />);
    expect((screen.getByRole("searchbox", { name: "Nome" }) as HTMLInputElement).value).toBe("maria");
    expect((screen.getByRole("combobox", { name: "Cargo" }) as HTMLSelectElement).value).toBe("SENADOR");
    await waitFor(() => expect((screen.getByRole("combobox", { name: "Partido" }) as HTMLSelectElement).value).toBe("55"));
    await waitFor(() => expect(pedidosDaLista(fetchMock).length).toBeGreaterThan(0));
    expect(Object.fromEntries(pedidosDaLista(fetchMock).at(-1)!)).toEqual({
      anoEleicao: "2026", q: "maria", cargo: "SENADOR", nrPartido: "55", pagina: "1", tamanho: "48",
    });
    expect(await screen.findByText("6 candidaturas com Nome: \"maria\", Cargo: Senador, Partido: PSD")).toBeTruthy();
  });

  it("ignora cargo e partido inválidos na URL", async () => {
    navegacao.reset("/candidatos", "cargo=INVALIDO&partido=abc");
    const fetchMock = rotas();
    renderComQuery(<CandidatosView />);
    await waitFor(() => expect(pedidosDaLista(fetchMock).length).toBeGreaterThan(0));
    const pedido = pedidosDaLista(fetchMock).at(-1)!;
    expect(pedido.has("cargo")).toBe(false);
    expect(pedido.has("nrPartido")).toBe(false);
    expect(await screen.findByText("6 candidaturas")).toBeTruthy();
  });

  it("pagina com Anterior/Próxima e leva o foco para a contagem", async () => {
    navegacao.reset("/candidatos", "pagina=2");
    rotas();
    const { rerender } = renderComQuery(<CandidatosView />);
    await screen.findByText("Página 2 de 3");
    fireEvent.click(screen.getByRole("button", { name: "Próxima" }));
    expect(navegacao.replace).toHaveBeenLastCalledWith("/candidatos?pagina=3", { scroll: false });
    rerender(<CandidatosView />);
    await screen.findByText("Página 3 de 3");
    expect((screen.getByRole("button", { name: "Próxima" }) as HTMLButtonElement).disabled).toBe(true);
    await waitFor(() => expect(document.activeElement?.textContent).toMatch(/^6 candidaturas/));
  });

  it("na página 1, Anterior fica desabilitado", async () => {
    rotas();
    renderComQuery(<CandidatosView />);
    await screen.findByText("Página 1 de 3");
    expect((screen.getByRole("button", { name: "Anterior" }) as HTMLButtonElement).disabled).toBe(true);
  });

  it("sem resultado, mostra a mensagem e Limpar filtros zera a URL", async () => {
    navegacao.reset("/candidatos", "q=zzzz&cargo=SENADOR");
    rotas({ vazio: true });
    renderComQuery(<CandidatosView />);
    expect(await screen.findByText("Nenhuma candidatura encontrada com esses filtros.")).toBeTruthy();
    const botoes = screen.getAllByRole("button", { name: "Limpar filtros" });
    fireEvent.click(botoes[botoes.length - 1]);
    expect(navegacao.replace).toHaveBeenLastCalledWith("/candidatos", { scroll: false });
  });

  it("erro mostra Tentar de novo", async () => {
    rotas({ erro: true });
    renderComQuery(<CandidatosView />);
    expect(await screen.findByText("Não foi possível carregar os candidatos.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Tentar de novo" })).toBeTruthy();
  });
});

describe("Navegação para candidatos (spec 016)", () => {
  it("o cabeçalho tem Candidatos, ativo em /candidatos", () => {
    navegacao.reset("/candidatos");
    renderComQuery(<Cabecalho />);
    const link = screen.getByRole("link", { name: "Candidatos" });
    expect(link.getAttribute("href")).toBe("/candidatos");
    expect(link.getAttribute("aria-current")).toBe("page");
    expect(screen.getByRole("link", { name: "Partidos" }).getAttribute("aria-current")).toBeNull();
  });

  it("a home tem Ver todos os candidatos", () => {
    navegacao.reset("/");
    mockApi({ partidos });
    renderComQuery(<Home />);
    expect(screen.getByRole("link", { name: "Ver todos os candidatos" }).getAttribute("href")).toBe("/candidatos");
  });
});
