import { describe, expect, it } from "vitest";
import { nomeProprio } from "./formatacao";

describe("nomeProprio", () => {
  it.each([
    ["PARTIDO SOCIALISTA  DOS TRABALHADORES UNIFICADO", "Partido Socialista dos Trabalhadores Unificado"],
    ["REDE SUSTENTABILIDADE", "Rede Sustentabilidade"],
    ["DEMOCRACIA CRISTÃ", "Democracia Cristã"],
    [" A À E O DA DAS DE DO DOS ", "A à e o da das de do dos"],
    ["MARIA DA SILVA", "Maria da Silva"],
    ["ALESSANDRO DE SANT'ANNA CARDOSO", "Alessandro de Sant'Anna Cardoso"],
    ["ANA-LUÍSA DOS SANTOS", "Ana-Luísa dos Santos"],
    [null, ""],
    [undefined, ""],
  ])("formata %s", (entrada, esperado) => expect(nomeProprio(entrada)).toBe(esperado));
});
