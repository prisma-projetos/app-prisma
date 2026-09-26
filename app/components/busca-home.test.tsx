import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PartidoResponse } from "@/app/lib/api/types";
import { navegacao } from "@/test/navegacao";
import { chamadasPara, erroApi, mockApi, renderComQuery } from "@/test/utils";
import { BuscaHome } from "./busca-home";

vi.mock("next/navigation", async () => (await import("@/test/navegacao")).mockNextNavigation());

const PSD: PartidoResponse = { numero: 55, sigla: "PSD", nome: "PARTIDO SOCIAL DEMOCRÁTICO" };
const PSDB: PartidoResponse = { numero: 45, sigla: "PSDB", nome: "PARTIDO DA SOCIAL DEMOCRACIA BRASILEIRA" };

function paginaCandidatos(nomes: string[], total = nomes.length) {
  return {
    content: nomes.map((nome, i) => ({ tituloEleitoral: `t${i}`, nome, cargo: "DEPUTADO FEDERAL" })),
    totalElements: total,
    totalPages: 1,
    number: 0,
    size: 5,
  };
}

function rotas(opcoes: { partidos?: PartidoResponse[]; candidatos?: ReturnType<typeof paginaCandidatos>; erroCandidatos?: boolean } = {}) {
  return mockApi({
    partidos: (params: URLSearchParams) =>
      Response.json(params.get("q") ? (opcoes.partidos ?? []) : [PSD, PSDB]),
    politicos: opcoes.erroCandidatos ? erroApi(500) : () => Response.json(opcoes.candidatos ?? paginaCandidatos([])),
  });
}

function campo() {
  return screen.getByRole("combobox", { name: "Nome do partido ou do candidato" });
}

async function digitar(texto: string) {
  fireEvent.change(campo(), { target: { value: texto } });
}

describe("BuscaHome (spec 015)", () => {
  beforeEach(() => navegacao.reset("/"));

  it("tem campo com rótulo visível, botão Buscar e exemplos", () => {
    rotas();
    renderComQuery(<BuscaHome />);
    expect(campo()).toBeTruthy();
    expect(screen.getByText("Nome do partido ou do candidato").tagName).toBe("LABEL");
    expect(screen.getByRole("button", { name: "Buscar" })).toBeTruthy();
    expect(screen.getByText(/Exemplos: PSD, Partido Verde, Maria da Silva\./)).toBeTruthy();
  });

  it("com 1 caractere não busca; com 2 ou mais busca partidos e candidatos de 2026", async () => {
    const fetchMock = rotas();
    renderComQuery(<BuscaHome />);
    await digitar("m");
    await new Promise((r) => setTimeout(r, 400));
    expect(chamadasPara(fetchMock, "politicos")).toHaveLength(0);
    expect(chamadasPara(fetchMock, "partidos").filter((p) => p.get("q"))).toHaveLength(0);

    await digitar("maria");
    await waitFor(() => expect(chamadasPara(fetchMock, "politicos")).toHaveLength(1));
    const [candidatos] = chamadasPara(fetchMock, "politicos");
    expect(Object.fromEntries(candidatos)).toEqual({ q: "maria", anoEleicao: "2026", tamanho: "5" });
    expect(chamadasPara(fetchMock, "partidos").map((p) => p.get("q"))).toContain("maria");
  });

  it("mostra os dois grupos, no máximo 5 itens cada, e o link para ver todos", async () => {
    rotas({
      partidos: [PSD, PSDB],
      candidatos: paginaCandidatos(["MARIA DA SILVA", "ANA MARIA", "MARIA JOSÉ", "MARIA LUIZA", "ROSA MARIA"], 977),
    });
    renderComQuery(<BuscaHome />);
    await digitar("maria");
    await screen.findByText("Partido Social Democrático · nº 55");
    await screen.findByText("Maria da Silva");
    const lista = screen.getByRole("listbox");
    const partidos = within(lista).getByRole("group", { name: "Partidos" });
    const candidatos = within(lista).getByRole("group", { name: "Candidatos" });
    expect(within(partidos).getAllByRole("option")).toHaveLength(2);
    expect(within(partidos).getByText("Partido Social Democrático · nº 55")).toBeTruthy();
    expect(within(candidatos).getAllByRole("option")).toHaveLength(6);
    expect(within(candidatos).getByText("Maria da Silva")).toBeTruthy();
    expect(within(candidatos).getAllByText("Deputado federal")).toHaveLength(5);
    expect(within(candidatos).getByRole("option", { name: 'Ver os 977 candidatos com "maria"' })).toBeTruthy();
  });

  it("orienta quando um grupo não tem resultado", async () => {
    rotas({ partidos: [], candidatos: paginaCandidatos([]) });
    renderComQuery(<BuscaHome />);
    await digitar("furia");
    expect(await screen.findByText('Nenhum partido com "furia".')).toBeTruthy();
    expect(screen.getByText('Nenhum candidato com "furia" no nome. Tente o nome completo da pessoa.')).toBeTruthy();
  });

  it("anuncia as quantidades encontradas", async () => {
    rotas({ partidos: [PSD], candidatos: paginaCandidatos(["MARIA DA SILVA"]) });
    renderComQuery(<BuscaHome />);
    await digitar("maria");
    await waitFor(() =>
      expect(screen.getByRole("status").textContent).toBe("1 partido e 1 candidato encontrados")
    );
  });

  it("setas percorrem os itens, Enter abre o ativo e Esc fecha sem apagar", async () => {
    rotas({ partidos: [PSD], candidatos: paginaCandidatos(["MARIA DA SILVA"]) });
    renderComQuery(<BuscaHome />);
    await digitar("maria");
    await screen.findByRole("listbox");
    await screen.findByText("Maria da Silva");

    fireEvent.keyDown(campo(), { key: "ArrowDown" });
    const primeiro = screen.getByRole("option", { name: /PSD/ });
    expect(campo().getAttribute("aria-activedescendant")).toBe(primeiro.id);
    fireEvent.keyDown(campo(), { key: "ArrowDown" });
    expect(campo().getAttribute("aria-activedescendant")).toBe(screen.getByRole("option", { name: /Maria da Silva/ }).id);
    fireEvent.keyDown(campo(), { key: "Enter" });
    expect(navegacao.push).toHaveBeenCalledWith("/politicos/t0");

    fireEvent.keyDown(campo(), { key: "Escape" });
    expect(screen.queryByRole("listbox")).toBeNull();
    expect((campo() as HTMLInputElement).value).toBe("maria");
  });

  it("enviar a sigla de um partido abre o partido; outro termo abre /candidatos", async () => {
    rotas();
    renderComQuery(<BuscaHome />);
    await waitFor(() => expect(navegacao.push).not.toHaveBeenCalled());
    await digitar("psd");
    await new Promise((r) => setTimeout(r, 50));
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    await waitFor(() => expect(navegacao.push).toHaveBeenCalledWith("/partidos/55"));

    await digitar("  maria  ");
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    expect(navegacao.push).toHaveBeenLastCalledWith("/candidatos?q=maria");
  });

  it("termo curto não navega e explica", () => {
    rotas();
    renderComQuery(<BuscaHome />);
    fireEvent.change(campo(), { target: { value: "a" } });
    fireEvent.click(screen.getByRole("button", { name: "Buscar" }));
    expect(screen.getByText("Digite pelo menos 2 letras.")).toBeTruthy();
    expect(navegacao.push).not.toHaveBeenCalled();
  });

  it("erro em um grupo não esconde o outro", async () => {
    rotas({ partidos: [PSD], erroCandidatos: true });
    renderComQuery(<BuscaHome />);
    await digitar("psd");
    expect(await screen.findByText("Não foi possível buscar agora. Tente de novo em alguns segundos.")).toBeTruthy();
    expect(screen.getByRole("option", { name: /PSD/ })).toBeTruthy();
  });
});

describe("BuscaHome: opção ativa visível", () => {
  it("rola até a opção ativa ao navegar pelas setas", async () => {
    navegacao.reset("/");
    const rolar = vi.fn();
    Element.prototype.scrollIntoView = rolar;
    rotas({ partidos: [PSD], candidatos: paginaCandidatos(["MARIA DA SILVA"]) });
    renderComQuery(<BuscaHome />);
    fireEvent.change(campo(), { target: { value: "maria" } });
    await screen.findByText("Maria da Silva");
    fireEvent.keyDown(campo(), { key: "ArrowDown" });
    fireEvent.keyDown(campo(), { key: "ArrowDown" });
    await waitFor(() => expect(rolar).toHaveBeenLastCalledWith({ block: "nearest" }));
  });
});
