// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { limitadorDoProxy, reiniciarAvisoSemProxy } from "@/app/lib/api/server/limite-requisicoes";
import { DELETE, GET, PATCH, POST, PUT } from "./route";

const BASE = "https://api.exemplo.test";
const CHAVE = "chave-secreta";

function requisicao(caminho: string) {
  return new NextRequest(`http://localhost/api/prisma/${caminho}`);
}

function ctx(path: string[]) {
  return { params: Promise.resolve({ path }) };
}

async function chamar(path: string[], query = "") {
  return GET(requisicao(`${path.join("/")}${query}`), ctx(path));
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  limitadorDoProxy.limpar();
  reiniciarAvisoSemProxy();
  vi.stubEnv("API_PRISMA", BASE);
  vi.stubEnv("API_PRISMA_KEY", CHAVE);
  fetchMock = vi.fn(async () => Response.json({ ok: true }));
  vi.stubGlobal("fetch", fetchMock);
});

function chamadaAoBackend(): { url: URL; init: RequestInit } {
  const [url, init] = fetchMock.mock.calls[0];
  return { url: new URL(String(url)), init };
}

describe("proxy /api/prisma", () => {
  it("injeta X-API-KEY e repassa a query string como GET ao backend", async () => {
    const resposta = await chamar(
      ["analise", "sentimento"],
      "?nrPartido=13&janela=2026-08"
    );

    expect(resposta.status).toBe(200);
    const { url, init } = chamadaAoBackend();
    expect(url.origin + url.pathname).toBe(`${BASE}/api/analise/sentimento`);
    expect(url.searchParams.get("nrPartido")).toBe("13");
    expect(url.searchParams.get("janela")).toBe("2026-08");
    expect(init.method).toBe("GET");
    expect(init.body).toBeUndefined();
    expect(new Headers(init.headers).get("X-API-KEY")).toBe(CHAVE);
  });

  it("preserva zeros à esquerda do titulo eleitoral", async () => {
    await chamar(["politicos", "detalhe"], "?tituloEleitoral=001234567890");
    expect(chamadaAoBackend().url.searchParams.get("tituloEleitoral")).toBe(
      "001234567890"
    );
  });

  it("repassa os filtros nrPartido, anoEleicao e cargo da listagem de políticos", async () => {
    const resposta = await chamar(
      ["politicos"],
      "?nrPartido=13&anoEleicao=2026&cargo=DEPUTADO%20FEDERAL"
    );
    expect(resposta.status).toBe(200);
    const { url } = chamadaAoBackend();
    expect(url.searchParams.get("nrPartido")).toBe("13");
    expect(url.searchParams.get("anoEleicao")).toBe("2026");
    expect(url.searchParams.get("cargo")).toBe("DEPUTADO FEDERAL");
  });

  it("aceita URL base com barra no final", async () => {
    vi.stubEnv("API_PRISMA", `${BASE}/`);
    await chamar(["partidos"]);
    expect(chamadaAoBackend().url.href).toBe(`${BASE}/api/partidos`);
  });

  it.each([
    [["test"]],
    [["politicos", "..", "test"]],
    [["%2e%2e", "test"]],
    [["analise"]],
    [["analise", "sentimento", "extra"]],
    [["politicos", "", "detalhe"]],
  ])("responde 404 para caminho fora da allowlist: %j", async (path) => {
    const resposta = await chamar(path);
    expect(resposta.status).toBe(404);
    expect(await resposta.json()).toEqual({ erro: expect.any(String) });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([POST, PUT, PATCH, DELETE])(
    "responde 405 para métodos diferentes de GET",
    async (handler) => {
      const resposta = handler();
      expect(resposta.status).toBe(405);
      expect(resposta.headers.get("Allow")).toBe("GET");
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );

  it.each([
    ["analise/panorama", "?nrPartido=13&janela=2026-13"],
    ["analise/panorama", "?nrPartido=13&janela=26-08"],
    ["analise/mencoes", "?nrPartido=13&de=2026-02-30"],
    ["analise/mencoes", "?nrPartido=13&ate=01/01/2026"],
    ["analise/mencoes", "?nrPartido=13&sentimento=otimo"],
    ["analise/mencoes", "?nrPartido=13&pagina=-1"],
    ["analise/mencoes", "?nrPartido=13&tamanho=0"],
    ["analise/mencoes", "?nrPartido=13&tamanho=101"],
    ["analise/mencoes", "?nrPartido=13&tamanho=abc"],
    ["partidos/detalhe", "?nrPartido=13.5"],
    ["partidos/detalhe", "?nrPartido=PT"],
    ["partidos", "?nrPartido=13"],
    ["politicos", "?nrPartido=PT"],
    ["politicos", "?anoEleicao=26"],
    ["politicos", "?anoEleicao=2026.0"],
    ["analise/sentimento", "?nrPartido=13&anoEleicao=2026"],
    ["analise/sentimento", "?nrPartido=13&cargo=SENADOR"],
    ["partidos", "?cargo=SENADOR"],
    ["politicos/detalhe", "?q=lula"],
    ["analise/sentimento", "?nrPartido=13&nrPartido=45"],
  ])("responde 400 para parâmetros inválidos: %s%s", async (caminho, query) => {
    const resposta = await chamar(caminho.split("/"), query);
    expect(resposta.status).toBe(400);
    expect(await resposta.json()).toEqual({ erro: expect.any(String) });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([200, 404, 422, 500, 503])(
    "repassa status %i e corpo do backend sem alteração",
    async (status) => {
      const corpo = JSON.stringify({ qualquer: "coisa", status });
      fetchMock.mockResolvedValueOnce(
        new Response(corpo, {
          status,
          headers: { "Content-Type": "application/json" },
        })
      );

      const resposta = await chamar(["partidos"]);

      expect(resposta.status).toBe(status);
      expect(await resposta.text()).toBe(corpo);
      expect(resposta.headers.get("Cache-Control")).toBe("no-store");
    }
  );

  it("responde 502 quando o backend está inacessível", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    const resposta = await chamar(["partidos"]);
    expect(resposta.status).toBe(502);
    expect(await resposta.json()).toEqual({ erro: expect.any(String) });
  });

  it("usa timeout de 10 s e responde 502 quando ele estoura", async () => {
    const timeout = vi.spyOn(AbortSignal, "timeout");
    fetchMock.mockRejectedValueOnce(
      new DOMException("The operation was aborted due to timeout", "TimeoutError")
    );

    const resposta = await chamar(["partidos"]);

    expect(timeout).toHaveBeenCalledWith(10_000);
    expect(resposta.status).toBe(502);
  });

  it.each(["API_PRISMA", "API_PRISMA_KEY"])(
    "responde 500 sem vazar detalhes quando %s não está definida",
    async (variavel) => {
      vi.stubEnv(variavel, "");
      const resposta = await chamar(["partidos"]);
      expect(resposta.status).toBe(500);
      expect(await resposta.json()).toEqual({ erro: "API não configurada" });
      expect(fetchMock).not.toHaveBeenCalled();
    }
  );
});

describe("proxy /api/prisma: limite de requisições (spec 019)", () => {
  function comCabecalho(xff: string) {
    return GET(
      new NextRequest("http://localhost/api/prisma/partidos", { headers: { "x-forwarded-for": xff } }),
      ctx(["partidos"])
    );
  }

  it("com 1 proxy confiável, a 61ª requisição do mesmo IP recebe 429 sem chamar o backend", async () => {
    vi.stubEnv("PROXIES_CONFIAVEIS", "1");
    for (let i = 0; i < 60; i++) expect((await comCabecalho(`forjado-${i}, 9.9.9.9`)).status).toBe(200);
    fetchMock.mockClear();
    const resposta = await comCabecalho("outro-forjado, 9.9.9.9");
    expect(resposta.status).toBe(429);
    expect(Number(resposta.headers.get("Retry-After"))).toBeGreaterThan(0);
    expect(resposta.headers.get("Cache-Control")).toBe("no-store");
    expect(await resposta.json()).toEqual({ erro: "Muitas requisições. Tente de novo em instantes." });
    expect(fetchMock).not.toHaveBeenCalled();
    expect((await comCabecalho("9.9.9.9, 8.8.8.8")).status).toBe(200);
  });

  it("sem proxy confiável, o limite fica desligado e avisa uma vez no log", async () => {
    const aviso = vi.spyOn(console, "warn").mockImplementation(() => {});
    for (let i = 0; i < 70; i++) expect((await comCabecalho("1.1.1.1")).status).toBe(200);
    expect(aviso).toHaveBeenCalledTimes(1);
    expect(String(aviso.mock.calls[0][0])).toContain("PROXIES_CONFIAVEIS");
  });
});

describe("proxy /api/prisma: filtro por UF (spec 023)", () => {
  it("repassa uf válido em politicos", async () => {
    const resposta = await chamar(["politicos"], "?uf=RO&anoEleicao=2026");
    expect(resposta.status).toBe(200);
    expect(chamadaAoBackend().url.searchParams.get("uf")).toBe("RO");
  });

  it.each(["abc", "R", "12"])("recusa uf=%s", async (uf) => {
    expect((await chamar(["politicos"], `?uf=${uf}`)).status).toBe(400);
  });

  it("recusa uf fora de politicos", async () => {
    expect((await chamar(["partidos"], "?uf=RO")).status).toBe(400);
  });
});
