import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
function rotas({ vazio = false, erro = false, comPartido = false } = {}) {
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
            content: resposta.content.map((c) => ({
              ...c,
              cargo: "SENADOR",
              ...(comPartido && { nrPartido: 55, siglaPartido: "PSD" }),
            })),
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

describe("Filtro de nome acompanha a URL (code-review)", () => {
  it("navegar para /candidatos sem q limpa o campo e não devolve o filtro antigo", async () => {
    navegacao.reset("/candidatos", "q=maria");
    rotas();
    const { rerender } = renderComQuery(<CandidatosView />);
    expect((screen.getByRole("searchbox", { name: "Nome" }) as HTMLInputElement).value).toBe("maria");
    navegacao.reset("/candidatos");
    rerender(<CandidatosView />);
    expect((screen.getByRole("searchbox", { name: "Nome" }) as HTMLInputElement).value).toBe("");
    await new Promise((r) => setTimeout(r, 400));
    expect(navegacao.replace).not.toHaveBeenCalled();
  });
});

describe("Partido na lista de candidatos (spec 026)", () => {
  beforeEach(() => navegacao.reset("/candidatos"));
  afterEach(() => vi.unstubAllEnvs());

  it("a lista paginada mostra a sigla com link para o partido e o cabeçalho Nome / Partido / Cargo", async () => {
    rotas({ comPartido: true });
    const { container } = renderComQuery(<CandidatosView />);
    const nome = await screen.findByRole("link", { name: "Candidato 0-0" });
    const linha = nome.closest("li")!;
    expect(within(linha).getByRole("link", { name: "PSD" }).getAttribute("href")).toBe("/partidos/55");
    expect(within(linha).getByText("Senador")).toBeTruthy();
    expect(nome.getAttribute("href")).toBe("/politicos/0000");
    const cabecalho = container.querySelector("ul")!.previousElementSibling!;
    expect(cabecalho.textContent).toBe("NomePartidoCargo");
  });

  it("sem o partido na resposta da API, a coluna não aparece", async () => {
    rotas();
    const { container } = renderComQuery(<CandidatosView />);
    await screen.findByRole("link", { name: "Candidato 0-0" });
    expect(screen.queryByText("Partido não informado")).toBeNull();
    expect(container.querySelector("ul")!.previousElementSibling!.textContent).toBe("NomeCargo");
  });

  it("com uf e cargo, a lista paginada mostra o partido", async () => {
    vi.stubEnv("NEXT_PUBLIC_FILTRO_UF", "1");
    navegacao.reset("/candidatos", "uf=RO&cargo=SENADOR");
    rotas({ comPartido: true });
    renderComQuery(<CandidatosView />);
    const nome = await screen.findByRole("link", { name: "Candidato 0-0" });
    expect(within(nome.closest("li")!).getByRole("link", { name: "PSD" })).toBeTruthy();
  });

  it("com uf e sem cargo, as seções por cargo mostram o partido, sem a coluna Cargo", async () => {
    vi.stubEnv("NEXT_PUBLIC_FILTRO_UF", "1");
    navegacao.reset("/candidatos", "uf=RO");
    mockApi({
      partidos: LISTA_PARTIDOS,
      politicos: (params: URLSearchParams) => {
        const cargo = params.get("cargo");
        const total = !cargo || cargo === "SENADOR" ? 2 : 0;
        const base = paginaDeCandidatos(0, 1, total);
        return Response.json({
          ...base,
          content: base.content.map((c) => ({ ...c, cargo: "SENADOR", nrPartido: 55, siglaPartido: "PSD" })),
        });
      },
    });
    renderComQuery(<CandidatosView />);
    const senador = await screen.findByRole("region", { name: "Senador (2)" });
    const [primeira] = within(senador).getAllByRole("listitem");
    expect(within(primeira).getByRole("link", { name: "PSD" }).getAttribute("href")).toBe("/partidos/55");
    expect(within(primeira).queryByText("Senador")).toBeNull();
    expect(senador.querySelector("ul")!.previousElementSibling!.textContent).toBe("NomePartido");
  });
});

describe("Candidatos de um estado (spec 023)", () => {
  function rotasPorCargo() {
    return mockApi({
      partidos: LISTA_PARTIDOS,
      politicos: (params: URLSearchParams) => {
        if (params.get("tamanho") === "1") return Response.json({ ...paginaDeCandidatos(0, 1, 1), totalElements: 20608 });
        const cargo = params.get("cargo");
        const totais: Record<string, number> = { GOVERNADOR: 3, SENADOR: 8 };
        const total = cargo ? (totais[cargo] ?? 0) : 11;
        const quantidade = Math.min(total, Number(params.get("tamanho")));
        const base = paginaDeCandidatos(0, 1, quantidade);
        return Response.json({ ...base, totalElements: total, content: base.content.map((c) => ({ ...c, cargo: cargo ?? "SENADOR" })) });
      },
    });
  }

  afterEach(() => vi.unstubAllEnvs());

  it("com uf e sem cargo, divide por cargo com contagem, até 6 nomes e o link de ver todos", async () => {
    vi.stubEnv("NEXT_PUBLIC_FILTRO_UF", "1");
    navegacao.reset("/candidatos", "uf=RO");
    const fetchMock = rotasPorCargo();
    renderComQuery(<CandidatosView />);
    const governador = await screen.findByRole("region", { name: "Governador (3)" });
    expect(within(governador).getAllByRole("listitem")).toHaveLength(3);
    const senador = await screen.findByRole("region", { name: "Senador (8)" });
    expect(within(senador).getAllByRole("listitem")).toHaveLength(6);
    expect(within(senador).getByRole("link", { name: "Ver os 8 candidatos a senador em RO" }).getAttribute("href")).toBe(
      "/candidatos?uf=RO&cargo=SENADOR"
    );
    expect(screen.queryByRole("region", { name: /Vice-governador/ })).toBeNull();
    const pedido = chamadasPara(fetchMock, "politicos").find((p) => p.get("cargo") === "GOVERNADOR")!;
    expect(Object.fromEntries(pedido)).toEqual({ anoEleicao: "2026", uf: "RO", cargo: "GOVERNADOR", pagina: "0", tamanho: "6" });
    expect(await screen.findByText("11 candidaturas com Estado: Rondônia")).toBeTruthy();
    expect(screen.queryByRole("navigation", { name: "Paginação" })).toBeNull();
  });

  it("com uf e cargo, volta a lista paginada com o filtro de estado", async () => {
    vi.stubEnv("NEXT_PUBLIC_FILTRO_UF", "1");
    navegacao.reset("/candidatos", "uf=RO&cargo=SENADOR");
    const fetchMock = rotasPorCargo();
    renderComQuery(<CandidatosView />);
    await waitFor(() => expect(pedidosDaLista(fetchMock).length).toBeGreaterThan(0));
    expect(pedidosDaLista(fetchMock).at(-1)!.get("uf")).toBe("RO");
    expect(screen.queryByRole("region", { name: /Senador \(/ })).toBeNull();
  });

  it("o select Estado grava ?uf= e se combina com os outros filtros", async () => {
    vi.stubEnv("NEXT_PUBLIC_FILTRO_UF", "1");
    navegacao.reset("/candidatos", "cargo=SENADOR");
    rotasPorCargo();
    renderComQuery(<CandidatosView />);
    fireEvent.change(screen.getByRole("combobox", { name: "Estado" }), { target: { value: "RO" } });
    expect(navegacao.replace).toHaveBeenLastCalledWith("/candidatos?cargo=SENADOR&uf=RO", { scroll: false });
  });

  it("com o recurso desligado, não há filtro Estado e uf é ignorado", async () => {
    navegacao.reset("/candidatos", "uf=RO");
    const fetchMock = rotas();
    renderComQuery(<CandidatosView />);
    expect(screen.queryByRole("combobox", { name: "Estado" })).toBeNull();
    await waitFor(() => expect(pedidosDaLista(fetchMock).length).toBeGreaterThan(0));
    expect(pedidosDaLista(fetchMock).at(-1)!.has("uf")).toBe(false);
  });
});
