import { act } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ThemeToggle } from "./theme-toggle";

afterEach(() => {
  document.documentElement.setAttribute("data-theme", "light");
  vi.restoreAllMocks();
});

describe("hidratação do tema", () => {
  it("hidrata o HTML do servidor com o tema escuro aplicado antes da pintura", async () => {
    const erro = vi.spyOn(console, "error").mockImplementation(() => {});
    const recuperavel = vi.fn();
    const container = document.createElement("div");
    container.innerHTML = renderToString(<ThemeToggle />);
    document.body.append(container);
    document.documentElement.setAttribute("data-theme", "dark");
    let root: ReturnType<typeof hydrateRoot>;
    await act(async () => {
      root = hydrateRoot(container, <ThemeToggle />, { onRecoverableError: recuperavel });
    });
    expect(container.querySelector("button")?.textContent).toBe("Modo claro");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(recuperavel).not.toHaveBeenCalled();
    expect(erro).not.toHaveBeenCalled();
    await act(async () => root!.unmount());
    container.remove();
  });
});
