import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { CandidatoResumoResponse } from "@/app/lib/api/types";
import { CabecalhoLista, LinhaCandidato, temPartido } from "./linha-candidato";

const BASE: CandidatoResumoResponse = { tituloEleitoral: "0001", nome: "MARIA DA SILVA", cargo: "SENADOR" };

function linha(candidato: CandidatoResumoResponse, props: { mostrarCargo?: boolean; mostrarPartido?: boolean } = {}) {
  render(
    <ul>
      <LinhaCandidato candidato={candidato} {...props} />
    </ul>
  );
  return screen.getByRole("listitem");
}

describe("Partido na linha de candidato (spec 026)", () => {
  it("mostra a sigla como link para o partido, separado do link do nome", () => {
    const li = linha({ ...BASE, nrPartido: 55, siglaPartido: "PSD" }, { mostrarPartido: true });
    expect(within(li).getByRole("link", { name: "PSD" }).getAttribute("href")).toBe("/partidos/55");
    expect(within(li).getByRole("link", { name: "Maria da Silva" }).getAttribute("href")).toBe("/politicos/0001");
    expect(within(li).getByText("Senador")).toBeTruthy();
  });

  it("sigla sem número aparece como texto, sem link", () => {
    const li = linha({ ...BASE, siglaPartido: "PSD" }, { mostrarPartido: true });
    expect(within(li).getByText("PSD")).toBeTruthy();
    expect(within(li).queryByRole("link", { name: "PSD" })).toBeNull();
  });

  it("sem sigla mostra — com texto acessível", () => {
    const li = linha(BASE, { mostrarPartido: true });
    expect(within(li).getByText("—").getAttribute("aria-hidden")).toBe("true");
    expect(within(li).getByText("Partido não informado")).toBeTruthy();
  });

  it("sem mostrarPartido, a linha não tem partido", () => {
    const li = linha({ ...BASE, nrPartido: 55, siglaPartido: "PSD" });
    expect(within(li).queryByText("PSD")).toBeNull();
    expect(within(li).queryByText("Partido não informado")).toBeNull();
  });

  it("sem cargo, mostra só o partido", () => {
    const li = linha({ ...BASE, nrPartido: 55, siglaPartido: "PSD" }, { mostrarCargo: false, mostrarPartido: true });
    expect(within(li).getByRole("link", { name: "PSD" })).toBeTruthy();
    expect(within(li).queryByText("Senador")).toBeNull();
  });

  it("o cabeçalho acompanha as colunas", () => {
    const { container, rerender } = render(<CabecalhoLista mostrarPartido />);
    expect(container.textContent).toBe("NomePartidoCargo");
    rerender(<CabecalhoLista mostrarCargo={false} mostrarPartido />);
    expect(container.textContent).toBe("NomePartido");
    rerender(<CabecalhoLista />);
    expect(container.textContent).toBe("NomeCargo");
  });

  it("temPartido só é verdadeiro se algum item traz a sigla", () => {
    expect(temPartido([BASE, BASE])).toBe(false);
    expect(temPartido([BASE, { ...BASE, siglaPartido: "PSD" }])).toBe(true);
    expect(temPartido([])).toBe(false);
  });
});
