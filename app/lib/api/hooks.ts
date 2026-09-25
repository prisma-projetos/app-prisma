"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiGet, type Parametros } from "./client";
import {
  prismaKeys,
  type FiltroPartidos,
  type FiltroPoliticos,
} from "./query-keys";
import type {
  AnaliseMateriaResponse,
  AnalisePorTemaResponse,
  CandidatoResumoResponse,
  ConsultaRequest,
  MencaoResponse,
  Page,
  PanoramaResponse,
  PartidoResponse,
  PoliticoDetalheResponse,
  SentimentoPorMidiaResponse,
  SentimentoResumoResponse,
} from "./types";

function presente(valor: unknown): boolean {
  return valor !== undefined && valor !== null && valor !== "";
}

/** Exatamente um de tituloEleitoral ou nrPartido informado. */
export function entidadeIdentificada(consulta: ConsultaRequest): boolean {
  return presente(consulta.tituloEleitoral) !== presente(consulta.nrPartido);
}

export function usePoliticos(filtro: FiltroPoliticos = {}) {
  return useQuery({
    queryKey: prismaKeys.politicos.lista(filtro),
    queryFn: ({ signal }) =>
      apiGet<Page<CandidatoResumoResponse>>("politicos", { ...filtro }, signal),
    placeholderData: keepPreviousData,
  });
}

export function usePolitico(tituloEleitoral: string | undefined) {
  return useQuery({
    queryKey: prismaKeys.politicos.detalhe(tituloEleitoral),
    queryFn: ({ signal }) =>
      apiGet<PoliticoDetalheResponse>(
        "politicos/detalhe",
        { tituloEleitoral },
        signal
      ),
    enabled: presente(tituloEleitoral),
  });
}

export function usePartidos(filtro: FiltroPartidos = {}) {
  return useQuery({
    queryKey: prismaKeys.partidos.lista(filtro),
    queryFn: ({ signal }) =>
      apiGet<PartidoResponse[]>("partidos", { ...filtro }, signal),
  });
}

export function usePartido(nrPartido: number | undefined) {
  return useQuery({
    queryKey: prismaKeys.partidos.detalhe(nrPartido),
    queryFn: ({ signal }) =>
      apiGet<PartidoResponse>("partidos/detalhe", { nrPartido }, signal),
    enabled: presente(nrPartido),
  });
}

function useAnalise<T>(
  caminho: string,
  queryKey: readonly unknown[],
  consulta: ConsultaRequest,
  paginado = false
) {
  return useQuery({
    queryKey,
    queryFn: ({ signal }) =>
      apiGet<T>(caminho, { ...consulta } as Parametros, signal),
    enabled: entidadeIdentificada(consulta),
    placeholderData: paginado ? keepPreviousData : undefined,
  });
}

export function useSentimento(consulta: ConsultaRequest) {
  return useAnalise<SentimentoResumoResponse>(
    "analise/sentimento",
    prismaKeys.analise.sentimento(consulta),
    consulta
  );
}

export function useAnalisePorTema(consulta: ConsultaRequest) {
  return useAnalise<AnalisePorTemaResponse>(
    "analise/por-tema",
    prismaKeys.analise.porTema(consulta),
    consulta
  );
}

export function useSentimentoPorMidia(consulta: ConsultaRequest) {
  return useAnalise<SentimentoPorMidiaResponse>(
    "analise/por-midia",
    prismaKeys.analise.porMidia(consulta),
    consulta
  );
}

export function usePanorama(consulta: ConsultaRequest) {
  return useAnalise<PanoramaResponse>(
    "analise/panorama",
    prismaKeys.analise.panorama(consulta),
    consulta
  );
}

export function useMencoes(consulta: ConsultaRequest) {
  return useAnalise<Page<MencaoResponse>>(
    "analise/mencoes",
    prismaKeys.analise.mencoes(consulta),
    consulta,
    true
  );
}

export function useMaterias(consulta: ConsultaRequest) {
  return useAnalise<Page<AnaliseMateriaResponse>>(
    "analise/materias",
    prismaKeys.analise.materias(consulta),
    consulta,
    true
  );
}
