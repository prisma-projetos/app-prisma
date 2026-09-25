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

  it("sem mostrarNome, o rótulo só aparece no hover (tooltip)", () => {
    const { getByText } = render(<EntidadeAvatar nome="PT" imagemUrl="x.svg" variante="partido" />);
    expect(getByText("PT").className).toMatch(/opacity-0 .*group-hover:opacity-100/);
  });
});
