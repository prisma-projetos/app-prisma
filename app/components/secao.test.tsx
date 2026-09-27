import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Secao } from "./secao";
import { Disclaimer, TEXTO_DISCLAIMER } from "./disclaimer";

describe("estrutura de leitura (spec 009)", () => {
  it("identifica a seção pelo título de nível 2", () => {
    render(<Secao id="fontes" titulo="Fontes"><p>Matérias consultadas</p></Secao>);
    const secao = screen.getByRole("region", { name: "Fontes" });
    expect(within(secao).getByRole("heading", { level: 2 }).textContent).toBe("Fontes");
    expect(within(secao).getByText("Matérias consultadas")).toBeTruthy();
  });

  it("preserva o aviso de IA e mantém o ícone decorativo", () => {
    const { container } = render(<Disclaimer />);
    expect(screen.getByText(TEXTO_DISCLAIMER)).toBeTruthy();
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });
});
