import Link from "next/link";
import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { EntidadeAvatar } from "./entidade-avatar";

describe("EntidadeAvatar", () => {
  it.each([undefined, null, ""])("exibe o fallback quando imagemUrl é %j", (url) => {
    const { container } = render(
      <EntidadeAvatar nome="PT" imagemUrl={url} variante="partido" />
    );
    expect(container.querySelector("img")).toBeNull();
    expect(container.textContent).toContain("PT");
  });

  it("troca a imagem pelo fallback quando ela falha ao carregar", () => {
    const { container } = render(
      <EntidadeAvatar nome="FULANO" imagemUrl="https://x.test/f.jpg" variante="politico" />
    );
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector("svg")).not.toBeNull();
  });

  it("preserva a sigla longa no fallback quando a logo falha", () => {
    const { container, getByText } = render(
      <EntidadeAvatar nome="SOLIDARIEDADE" imagemUrl="x.svg" variante="partido" />
    );
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("img")).toBeNull();
    expect(getByText("SOLIDARIEDADE").textContent).toBe("SOLIDARIEDADE");
  });

  it("tenta de novo quando a URL muda depois de uma falha", () => {
    const { container, rerender } = render(
      <EntidadeAvatar nome="PT" imagemUrl="https://x.test/a.svg" variante="partido" />
    );
    fireEvent.error(container.querySelector("img")!);
    rerender(<EntidadeAvatar nome="PT" imagemUrl="https://x.test/b.svg" variante="partido" />);
    expect(container.querySelector("img")?.getAttribute("src")).toBe("https://x.test/b.svg");
  });

  it("com mostrarNome, exibe o rótulo sempre visível", () => {
    const { getByText } = render(
      <EntidadeAvatar nome="FULANO DE TAL" imagemUrl="x.jpg" variante="politico" mostrarNome />
    );
    expect(getByText("FULANO DE TAL").className).not.toMatch(/opacity-0/);
  });

  it("sem mostrarNome, mantém a imagem decorativa e o nome no conteúdo adjacente", () => {
    const { getByRole, getAllByText, container } = render(
      <Link href="/partidos/13" aria-label="PT, Partido dos Trabalhadores, número 13">
        <EntidadeAvatar nome="PT" imagemUrl="x.svg" variante="partido" />
        <span>PT</span>
        <span>Partido dos Trabalhadores</span>
      </Link>
    );
    expect(getByRole("link", { name: "PT, Partido dos Trabalhadores, número 13" })).toBeTruthy();
    expect(getAllByText("PT")).toHaveLength(1);
    expect(container.querySelector("img")?.getAttribute("alt")).toBe("");
  });
});
