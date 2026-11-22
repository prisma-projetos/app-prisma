import { beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiGet, montarQuery } from "./client";

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn(async () => Response.json({ ok: true }));
  vi.stubGlobal("fetch", fetchMock);
});

describe("montarQuery", () => {
  it("omite parâmetros undefined, null e vazios", () => {
    expect(
      montarQuery({ a: undefined, b: null, c: "", d: 0, e: "x", f: 13 })
    ).toBe("?d=0&e=x&f=13");
  });

  it("devolve string vazia sem parâmetros", () => {
    expect(montarQuery({})).toBe("");
    expect(montarQuery()).toBe("");
  });
});

describe("apiGet", () => {
  it("chama o proxy /api/prisma com a query string", async () => {
    const dados = await apiGet("analise/panorama", {
      nrPartido: 13,
      janela: undefined,
    });

    expect(dados).toEqual({ ok: true });
    expect(fetchMock.mock.calls[0][0]).toBe(
      "/api/prisma/analise/panorama?nrPartido=13"
    );
  });

  it.each([400, 404, 500, 502])(
    "lança ApiError com status %i para respostas não-2xx",
    async (status) => {
      fetchMock.mockResolvedValueOnce(
        Response.json({ erro: "Parâmetro inválido: janela" }, { status })
      );

      const erro = await apiGet("partidos").catch((e: unknown) => e);

      expect(erro).toBeInstanceOf(ApiError);
      expect(erro).toMatchObject({
        status,
        mensagem: "Parâmetro inválido: janela",
      });
    }
  );

  it("usa mensagem genérica quando o corpo de erro não é JSON", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response("<html>Bad Gateway</html>", { status: 502 })
    );

    await expect(apiGet("partidos")).rejects.toMatchObject({
      status: 502,
      mensagem: "Erro ao consultar a API",
    });
  });

  it("lança ApiError quando a rede falha", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await expect(apiGet("partidos")).rejects.toBeInstanceOf(ApiError);
  });
});
