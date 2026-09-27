// @vitest-environment node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SENTIMENTO_COR } from "@/app/lib/sentimento";

const RAIZ = join(__dirname, "..");
const css = readFileSync(join(RAIZ, "app/globals.css"), "utf8");

function arquivos(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
  });
}

/** Bloco de declarações de um seletor (o primeiro que casar). */
function bloco(seletor: string): string {
  const inicio = css.indexOf(`${seletor} {`);
  expect(inicio, `seletor ${seletor} em globals.css`).toBeGreaterThanOrEqual(0);
  return css.slice(inicio, css.indexOf("}", inicio));
}

// Valores de DESIGN.md (claro, escuro).
const TOKENS: Record<string, [string, string]> = {
  papel: ["#f7f7f7", "#141414"],
  "papel-2": ["#ededed", "#1f1f1f"],
  tinta: ["#1a1a1a", "#ededed"],
  "tinta-2": ["#474747", "#b0b0b0"],
  "tinta-3": ["#666666", "#8f8f8f"],
  fio: ["#d4d4d4", "#333333"],
  "placa-logo": ["#efefef", "#efefef"],
  "sent-negativo": ["#1a1a1a", "#f0f0f0"],
  "sent-neutro": ["#c4c4c4", "#3f3f3f"],
  "sent-positivo": ["#6b6b6b", "#8a8a8a"],
  grafico: ["#1a1a1a", "#ededed"],
};

describe("fundação visual (spec 009)", () => {
  it.each(Object.entries(TOKENS))("token %s tem os valores de DESIGN.md", (nome, [claro, escuro]) => {
    expect(bloco(":root").toLowerCase()).toContain(`--${nome}: ${claro};`);
    expect(bloco('[data-theme="dark"]').toLowerCase()).toContain(`--${nome}: ${escuro};`);
  });

  it("não usa preto nem branco puros como cor", () => {
    expect(css).not.toMatch(/#000\b|#000000|#fff\b|#ffffff|\bblack\b|\bwhite\b/i);
  });

  it("nenhum componente usa as cores do visual antigo", () => {
    const proibidas = /\b(?:[a-z]+:)*(?:bg|text|border|from|to|ring|outline|decoration)-(?:zinc|slate|amber)-|\b(?:bg|text|border)-(?:black|white)\b/;
    const ofensores = arquivos(join(RAIZ, "app"))
      .filter((f) => f.endsWith(".tsx") && !f.endsWith(".test.tsx"))
      .filter((f) => proibidas.test(readFileSync(f, "utf8")));
    expect(ofensores).toEqual([]);
  });

  it("carrega a Atkinson Hyperlegible Next e aplica ao body", () => {
    const layout = readFileSync(join(RAIZ, "app/layout.tsx"), "utf8");
    expect(layout).toContain("Atkinson_Hyperlegible_Next");
    expect(layout).not.toMatch(/Geist/);
    expect(bloco("body")).toMatch(/font-family: var\(--font-atkinson\)/);
    expect(bloco("body")).toContain('font-feature-settings: "tnum"');
  });

  it("tem foco de teclado com anel de tinta e espectro", () => {
    expect(css).toContain(":focus-visible");
    expect(css).toContain("--espectro:");
  });

  it("sentimentos usam os tokens sent-* com a retícula de cada um (spec 025)", () => {
    expect(SENTIMENTO_COR).toEqual({
      negativo: "bg-sent-negativo reticula-negativo",
      neutro: "bg-sent-neutro reticula-neutro",
      positivo: "bg-sent-positivo reticula-positivo",
    });
  });

  it("neutro e positivo têm texturas diferentes; negativo é sólido (spec 025)", () => {
    const regra = (nome: string) => {
      const i = css.indexOf(`.${nome} {`);
      expect(i, nome).toBeGreaterThanOrEqual(0);
      return css.slice(i, css.indexOf("}", i));
    };
    expect(regra("reticula-negativo")).not.toContain("background-image");
    expect(regra("reticula-neutro")).toMatch(/background-image: radial-gradient/);
    expect(regra("reticula-positivo")).toMatch(/background-image: repeating-linear-gradient\(45deg/);
  });
});
