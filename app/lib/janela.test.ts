import { describe, expect, it } from "vitest";
import { intervaloDaJanela, lerJanela, mesesDisponiveis, periodoPorExtenso } from "./janela";

describe("janela (spec 018)", () => {
  it("oferece os 12 últimos meses até o mês atual no fuso de Brasília, do mais recente", () => {
    const meses = mesesDisponiveis(new Date("2026-09-26T12:00:00Z"));
    expect(meses).toHaveLength(12);
    expect(meses[0]).toBe("2026-09");
    expect(meses.slice(7, 10)).toEqual(["2026-02", "2026-01", "2025-12"]);
    expect(meses[11]).toBe("2025-10");
  });

  it("usa o mês de Brasília na virada (1º de outubro, 01h UTC, ainda é setembro)", () => {
    expect(mesesDisponiveis(new Date("2026-10-01T01:00:00Z"))[0]).toBe("2026-09");
  });

  it.each([
    ["2026-02", "2026-02-01", "2026-02-28"],
    ["2028-02", "2028-02-01", "2028-02-29"],
    ["2026-04", "2026-04-01", "2026-04-30"],
    ["2026-08", "2026-08-01", "2026-08-31"],
  ])("%s vai de %s até %s", (janela, de, ate) => {
    expect(intervaloDaJanela(janela)).toEqual({ de, ate });
  });

  it("aceita só meses da lista", () => {
    const meses = ["2026-09", "2026-08"];
    expect(lerJanela("2026-08", meses)).toBe("2026-08");
    expect(lerJanela("2026-13", meses)).toBe("");
    expect(lerJanela("abc", meses)).toBe("");
    expect(lerJanela("2020-01", meses)).toBe("");
    expect(lerJanela(null, meses)).toBe("");
  });

  it("descreve o período por extenso", () => {
    expect(periodoPorExtenso("")).toBe("em todo o período");
    expect(periodoPorExtenso("2026-08")).toBe("em agosto de 2026");
  });
});
