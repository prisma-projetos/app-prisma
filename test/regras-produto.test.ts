// @vitest-environment node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { TEXTO_DISCLAIMER } from "@/app/components/disclaimer";

const RAIZ = join(__dirname, "..");

function arquivos(dir: string): string[] {
  return readdirSync(dir).flatMap((nome) => {
    const caminho = join(dir, nome);
    return statSync(caminho).isDirectory() ? arquivos(caminho) : [caminho];
  });
}

describe("regras de produto (spec 007)", () => {
  const agents = readFileSync(join(RAIZ, "AGENTS.md"), "utf8");

  it("AGENTS.md tem o glossário, as regras de UI e o disclaimer novos", () => {
    for (const termo of ["**Sentimento**", "**Panorama**", "**Fonte**", "**Janela**"]) {
      expect(agents).toContain(termo);
    }
    expect(agents).toContain("Negativo, Neutro, Positivo");
    expect(agents).toContain('"Gerado por IA"');
    expect(agents).toContain(TEXTO_DISCLAIMER);
    expect(agents).toContain("classifica o sentimento da cobertura jornalística");
    expect(agents).not.toMatch(/categoria de viés|Fato\/opinião\/inferência/i);
  });

  it("nenhum arquivo em app/ usa os termos do glossário antigo", () => {
    const proibidos =
      /categorias? de viés|s[ií]ntese|\bfato\b|opini[aã]o do autor|infer[eê]ncia do modelo/i;
    const ofensores = arquivos(join(RAIZ, "app"))
      .filter((f) => /\.(tsx?|css)$/.test(f))
      .filter((f) => proibidos.test(readFileSync(f, "utf8")));
    expect(ofensores).toEqual([]);
  });

  it.each([
    "app/lib/mock-data.ts",
    "app/lib/types.ts",
    "app/components/sintese-tabs.tsx",
    "app/partidos/[slug]",
    "public/images",
  ])("%s foi removido", (caminho) => {
    expect(existsSync(join(RAIZ, caminho))).toBe(false);
  });
});
