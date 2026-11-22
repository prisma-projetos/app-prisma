// @vitest-environment node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const RAIZ = join(__dirname, "..");
const css = readFileSync(join(RAIZ, "app/globals.css"), "utf8");

describe("ponteiro e favicon (spec 021)", () => {
  it("elementos clicáveis usam a mãozinha e desabilitados, not-allowed", () => {
    const regra = css.slice(css.indexOf("/* Ponteiro"), css.indexOf("/* Ponteiro") + 600);
    for (const seletor of ["button", "summary", "select", '[role="option"]', '[role="tab"]', "label:has(input, select)"]) {
      expect(regra).toContain(seletor);
    }
    expect(regra).toContain("cursor: pointer");
    expect(regra).toContain("cursor: not-allowed");
  });

  it("favicon do prisma no lugar do ícone do template", () => {
    expect(existsSync(join(RAIZ, "app/icon.svg"))).toBe(true);
    expect(existsSync(join(RAIZ, "app/apple-icon.png"))).toBe(true);
    expect(existsSync(join(RAIZ, "app/favicon.ico"))).toBe(false);
    expect(readFileSync(join(RAIZ, "app/icon.svg"), "utf8")).toContain("prefers-color-scheme: dark");
  });
});
