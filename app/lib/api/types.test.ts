// @vitest-environment node
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import openapi from "@/test/fixtures/openapi-v1.json";

// Os tipos TypeScript não existem em runtime, então o teste lê o fonte e
// compara os campos de cada interface com o snapshot do OpenAPI publicado.
const fonte = readFileSync(new URL("./types.ts", import.meta.url), "utf8");

function camposDaInterface(nome: string): string[] | undefined {
  const bloco = new RegExp(`interface ${nome}(?:<T>)? \\{([\\s\\S]*?)\\n\\}`).exec(fonte);
  return bloco?.[1].match(/^\s+(\w+)\?:/gm)?.map((c) => c.trim().replace("?:", "")).sort();
}

const schemas = openapi.components.schemas as Record<
  string,
  { properties?: Record<string, unknown> }
>;
const nomes = Object.keys(schemas).filter((n) => !n.startsWith("Page"));

describe("tipos da API x OpenAPI v1 publicado", () => {
  it.each(nomes)("%s tem os mesmos campos do schema", (nome) => {
    expect(camposDaInterface(nome)).toEqual(
      Object.keys(schemas[nome].properties ?? {}).sort()
    );
  });

  it("listagem de políticos responde Page<CandidatoResumoResponse>", () => {
    const ref =
      openapi.paths["/api/politicos"].get.responses["200"].content["*/*"].schema.$ref;
    expect(ref).toBe("#/components/schemas/PageCandidatoResumoResponse");
    expect(fonte).toMatch(/interface Page<T>/);
  });
});
