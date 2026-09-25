import { QueryClientProvider, type UseQueryResult } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  useAnalisePorTema,
  useMaterias,
  useMencoes,
  usePanorama,
  usePartido,
  usePartidos,
  usePolitico,
  usePoliticos,
  useSentimento,
  useSentimentoPorMidia,
} from "./hooks";
import { criarQueryClient } from "./query-client";
import { prismaKeys } from "./query-keys";

let fetchMock: ReturnType<typeof vi.fn>;

type CasoHook = [string, () => UseQueryResult<unknown>, string];

function criarWrapper() {
  const client = criarQueryClient();
  client.setDefaultOptions({
    queries: { ...client.getDefaultOptions().queries, retryDelay: 0 },
  });
  function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  }
  return Wrapper;
}

function urlChamada(indice = 0): string {
  return String(fetchMock.mock.calls[indice][0]);
}

beforeEach(() => {
  fetchMock = vi.fn(async () => Response.json({ dados: "ok" }));
  vi.stubGlobal("fetch", fetchMock);
});

describe("hooks da API Prisma", () => {
  const casos: CasoHook[] = [
    ["usePoliticos", () => usePoliticos({ q: "silva", pagina: 1, tamanho: 10 }), "/api/prisma/politicos?q=silva&pagina=1&tamanho=10"],
    ["usePoliticos (por partido e ano)", () => usePoliticos({ nrPartido: 13, anoEleicao: 2026 }), "/api/prisma/politicos?nrPartido=13&anoEleicao=2026"],
    ["usePoliticos (por cargo e nome)", () => usePoliticos({ nrPartido: 13, cargo: "SENADOR", q: "joao" }), "/api/prisma/politicos?nrPartido=13&cargo=SENADOR&q=joao"],
    ["usePolitico", () => usePolitico("001234567890"), "/api/prisma/politicos/detalhe?tituloEleitoral=001234567890"],
    ["usePartidos", () => usePartidos({ q: "PT" }), "/api/prisma/partidos?q=PT"],
    ["usePartido", () => usePartido(13), "/api/prisma/partidos/detalhe?nrPartido=13"],
    ["useSentimento", () => useSentimento({ nrPartido: 13, sentimento: "negativo" }), "/api/prisma/analise/sentimento?nrPartido=13&sentimento=negativo"],
    ["useAnalisePorTema", () => useAnalisePorTema({ nrPartido: 13 }), "/api/prisma/analise/por-tema?nrPartido=13"],
    ["useSentimentoPorMidia", () => useSentimentoPorMidia({ tituloEleitoral: "123" }), "/api/prisma/analise/por-midia?tituloEleitoral=123"],
    ["usePanorama", () => usePanorama({ nrPartido: 13, janela: "2026-08" }), "/api/prisma/analise/panorama?nrPartido=13&janela=2026-08"],
    ["useMencoes", () => useMencoes({ nrPartido: 13, de: "2026-01-01", ate: "2026-12-31" }), "/api/prisma/analise/mencoes?nrPartido=13&de=2026-01-01&ate=2026-12-31"],
    ["useMaterias", () => useMaterias({ nrPartido: 13, tema: "saude", pagina: 0 }), "/api/prisma/analise/materias?nrPartido=13&tema=saude&pagina=0"],
  ];

  it.each(casos)("%s chama o caminho correto do proxy e expõe os dados", async (_nome, hook, esperado) => {
    const { result } = renderHook(hook, { wrapper: criarWrapper() });

    expect(result.current.isPending).toBe(true);
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(urlChamada()).toBe(esperado);
    expect(result.current.data).toEqual({ dados: "ok" });
  });

  it.each([
    ["useSentimento", useSentimento],
    ["useAnalisePorTema", useAnalisePorTema],
    ["useSentimentoPorMidia", useSentimentoPorMidia],
    ["usePanorama", usePanorama],
    ["useMencoes", useMencoes],
    ["useMaterias", useMaterias],
  ])("%s não faz requisição sem entidade ou com as duas", async (_nome, hook) => {
    const wrapper = criarWrapper();
    const semEntidade = renderHook(() => hook({ janela: "2026-08" }), { wrapper });
    const comAsDuas = renderHook(
      () => hook({ nrPartido: 13, tituloEleitoral: "123" }),
      { wrapper }
    );

    await new Promise((r) => setTimeout(r, 20));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(semEntidade.result.current.fetchStatus).toBe("idle");
    expect(comAsDuas.result.current.fetchStatus).toBe("idle");
  });

  it("usePolitico e usePartido não fazem requisição sem identificador", async () => {
    const wrapper = criarWrapper();
    renderHook(() => usePolitico(undefined), { wrapper });
    renderHook(() => usePolitico(""), { wrapper });
    renderHook(() => usePartido(undefined), { wrapper });

    await new Promise((r) => setTimeout(r, 20));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("chamadas com os mesmos parâmetros compartilham uma única requisição", async () => {
    const wrapper = criarWrapper();
    const a = renderHook(() => usePanorama({ nrPartido: 13 }), { wrapper });
    const b = renderHook(() => usePanorama({ nrPartido: 13 }), { wrapper });

    await waitFor(() => expect(a.result.current.isSuccess).toBe(true));
    await waitFor(() => expect(b.result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("parâmetros diferentes geram query keys diferentes", () => {
    expect(prismaKeys.analise.panorama({ nrPartido: 13 })).not.toEqual(
      prismaKeys.analise.panorama({ nrPartido: 45 })
    );
    expect(prismaKeys.analise.panorama({ nrPartido: 13 })).not.toEqual(
      prismaKeys.analise.sentimento({ nrPartido: 13 })
    );
    expect(prismaKeys.politicos.lista({ nrPartido: 13 })).not.toEqual(
      prismaKeys.politicos.lista({ nrPartido: 13, anoEleicao: 2026 })
    );
    expect(prismaKeys.politicos.lista({ nrPartido: 13, cargo: "SENADOR" })).not.toEqual(
      prismaKeys.politicos.lista({ nrPartido: 13, cargo: "GOVERNADOR" })
    );
    expect(prismaKeys.partidos.detalhe(13)).not.toEqual(
      prismaKeys.partidos.detalhe(45)
    );
  });

  it("não repete requisição em erro 4xx", async () => {
    fetchMock.mockImplementation(async () =>
      Response.json({ erro: "Parâmetro inválido: janela" }, { status: 400 })
    );

    const { result } = renderHook(() => usePartido(13), {
      wrapper: criarWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(result.current.error).toMatchObject({ status: 400 });
  });

  it.each([500, 502])(
    "repete até 2 vezes em erro %i antes de entrar em isError",
    async (status) => {
      fetchMock.mockImplementation(async () =>
        Response.json({ erro: "falhou" }, { status })
      );

      const { result } = renderHook(() => usePartido(13), {
        wrapper: criarWrapper(),
      });

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(fetchMock).toHaveBeenCalledTimes(3);
      expect(result.current.error).toMatchObject({ status });
    }
  );

  it("mantém os dados da página anterior enquanto a próxima carrega", async () => {
    fetchMock.mockImplementation(async (url: string) =>
      Response.json({ number: Number(new URL(url, "http://x").searchParams.get("pagina")) })
    );
    const { result, rerender } = renderHook(
      ({ pagina }) => useMencoes({ nrPartido: 13, pagina }),
      { wrapper: criarWrapper(), initialProps: { pagina: 0 } }
    );
    await waitFor(() => expect(result.current.data).toEqual({ number: 0 }));

    rerender({ pagina: 1 });

    expect(result.current.data).toEqual({ number: 0 });
    expect(result.current.isPlaceholderData).toBe(true);
    await waitFor(() => expect(result.current.data).toEqual({ number: 1 }));
  });
});
