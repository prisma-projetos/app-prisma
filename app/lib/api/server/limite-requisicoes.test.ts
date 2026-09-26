// @vitest-environment node
import { describe, expect, it } from "vitest";
import { criarLimitador, ipDaRequisicao } from "./limite-requisicoes";

describe("limitador de requisições (spec 019)", () => {
  it("libera 60 por minuto e barra a 61ª com o tempo até liberar", () => {
    const limitador = criarLimitador({ limite: 60, janelaMs: 60_000 });
    for (let i = 0; i < 60; i++) expect(limitador.verificar("1.1.1.1", 1_000 + i).permitido).toBe(true);
    const bloqueio = limitador.verificar("1.1.1.1", 1_100);
    expect(bloqueio.permitido).toBe(false);
    expect(bloqueio.retryAfterSegundos).toBe(60);
  });

  it("outro IP não é afetado", () => {
    const limitador = criarLimitador({ limite: 2, janelaMs: 60_000 });
    limitador.verificar("a", 0);
    limitador.verificar("a", 0);
    expect(limitador.verificar("a", 0).permitido).toBe(false);
    expect(limitador.verificar("b", 0).permitido).toBe(true);
  });

  it("depois da janela, o IP volta a ser atendido", () => {
    const limitador = criarLimitador({ limite: 2, janelaMs: 60_000 });
    limitador.verificar("a", 0);
    limitador.verificar("a", 10_000);
    expect(limitador.verificar("a", 30_000).permitido).toBe(false);
    expect(limitador.verificar("a", 60_001).permitido).toBe(true);
  });

  it("remove entradas vencidas", () => {
    const limitador = criarLimitador({ limite: 5, janelaMs: 1_000 });
    for (let i = 0; i < 100; i++) limitador.verificar(`ip-${i}`, 0);
    expect(limitador.tamanho()).toBe(100);
    limitador.verificar("novo", 5_000);
    expect(limitador.tamanho()).toBe(1);
  });

  it.each([
    [{ "x-forwarded-for": "1.1.1.1, 10.0.0.1" }, "1.1.1.1"],
    [{ "x-forwarded-for": "  2.2.2.2 " }, "2.2.2.2"],
    [{ "x-forwarded-for": " ", "x-real-ip": "3.3.3.3" }, "3.3.3.3"],
    [{ "x-real-ip": "4.4.4.4" }, "4.4.4.4"],
    [{}, "desconhecido"],
  ])("IP de %j é %s", (cabecalhos, esperado) => {
    expect(ipDaRequisicao(new Headers(cabecalhos))).toBe(esperado);
  });
});
