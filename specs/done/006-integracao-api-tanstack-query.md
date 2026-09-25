# Integração com a API Prisma via TanStack Query

## Objetivo
Criar a camada de acesso à API Prisma (`https://api-prisma.intranet.ajvale.com.br`, OpenAPI v1) usando TanStack Query, para que as telas possam deixar de depender de `app/lib/mock-data.ts`. A chave de API (`X-API-KEY`) nunca pode chegar ao navegador, então toda chamada passa por um proxy server-side do próprio Next.js (backend-for-frontend).

## Escopo
- **Dependência:** adicionar `@tanstack/react-query` (v5).
- **Provider:** componente client `app/providers.tsx` com `QueryClientProvider`, montado em `app/layout.tsx` envolvendo `{children}`. O `QueryClient` é criado uma vez por sessão do navegador (via `useState`), com defaults:
  - `staleTime: 5 * 60_000` (os dados vêm de pipeline em lote; não mudam a cada segundo);
  - `retry`: até 2 tentativas, **sem** retry para respostas 4xx;
  - `refetchOnWindowFocus: false`.
- **Proxy server-side (BFF):** Route Handler `app/api/prisma/[...path]/route.ts` que:
  - aceita apenas `GET`;
  - aceita apenas os caminhos da allowlist abaixo (qualquer outro → `404`, sem repassar ao backend);
  - lê os parâmetros da query string do navegador, valida-os (ver "Casos de borda") e os repassa como query string à API real (ver "Contrato de dados → Decisão");
  - injeta `X-API-KEY` a partir de `API_PRISMA_KEY` (variável **sem** prefixo `NEXT_PUBLIC_`, só lida no servidor);
  - devolve o status e o JSON do backend sem alterar o corpo; erros de rede/timeout do backend viram `502` com corpo `{ "erro": string }`.
- **Variáveis de ambiente (somente servidor, lidas em runtime, compatível com a imagem Docker `standalone`):**
  - `API_PRISMA` — ex.: `https://api-prisma.intranet.ajvale.com.br`
  - `API_PRISMA_KEY`
  - Um `.env.example` documentando as duas (sem valores reais), liberado no `.gitignore` via `!.env.example`; os demais `.env*` continuam ignorados.
  - Substitui a menção a `NEXT_PUBLIC_API_BASE_URL` no `AGENTS.md` (a URL da API deixa de ser pública; o navegador só conhece `/api/prisma/*`).
- **Serviço base server-side** `app/lib/api/server/prisma-service.ts` (com `import "server-only"`): lê `API_PRISMA`/`API_PRISMA_KEY`, contém a allowlist, a validação de parâmetros e `encaminhar(caminho, params)`, que faz o `fetch` ao backend com `X-API-KEY` e timeout. O Route Handler só delega a ele.
- **Cliente HTTP** `app/lib/api/client.ts`: função `apiGet<T>(path, params)` que chama `/api/prisma/{path}?{params}`, omite parâmetros `undefined`/`null`/`""` e lança `ApiError` (com `status` e `mensagem`) quando a resposta não for `2xx`.
- **Tipos** `app/lib/api/types.ts`: interfaces TypeScript escritas à mão, espelhando os schemas do OpenAPI v1 (`PoliticoResponse`, `CandidatoResumoResponse`, `CandidaturaResponse`, `PoliticoDetalheResponse`, `PartidoResponse`, `ConsultaRequest`, `SentimentoResumoResponse`, `ContagemSentimento`, `Proveniencia`, `AnalisePorTemaResponse`, `TemaContagem`, `ProvenienciaAnalise`, `SentimentoPorMidiaResponse`, `MidiaSentimento`, `PanoramaResponse`, `PanoramaEixo`, `TemaPanorama`, `Fonte`, `MencaoResponse`, `AnaliseMateriaResponse`) e um genérico `Page<T>` para as respostas paginadas do Spring. Todos os campos opcionais (`?`), já que o OpenAPI não declara `required`.
- **Query keys** `app/lib/api/query-keys.ts`: fábrica hierárquica, ex.:
  ```ts
  prismaKeys.politicos.lista({ q, nrPartido, anoEleicao, pagina, tamanho })
  prismaKeys.politicos.detalhe(tituloEleitoral)
  prismaKeys.partidos.lista({ q })
  prismaKeys.partidos.detalhe(nrPartido)
  prismaKeys.analise.sentimento(consulta)
  prismaKeys.analise.porTema(consulta)
  prismaKeys.analise.porMidia(consulta)
  prismaKeys.analise.panorama(consulta)
  prismaKeys.analise.mencoes(consulta)
  prismaKeys.analise.materias(consulta)
  ```
- **Hooks** `app/lib/api/hooks.ts`, um por endpoint:

  | Hook | Endpoint | Habilitado quando |
  |---|---|---|
  | `usePoliticos({ q?, nrPartido?, anoEleicao?, pagina?, tamanho? })` | `/api/politicos` | sempre |
  | `usePolitico(tituloEleitoral)` | `/api/politicos/detalhe` | `tituloEleitoral` presente |
  | `usePartidos({ q? })` | `/api/partidos` | sempre |
  | `usePartido(nrPartido)` | `/api/partidos/detalhe` | `nrPartido` presente |
  | `useSentimento(consulta)` | `/api/analise/sentimento` | entidade identificada* |
  | `useAnalisePorTema(consulta)` | `/api/analise/por-tema` | entidade identificada* |
  | `useSentimentoPorMidia(consulta)` | `/api/analise/por-midia` | entidade identificada* |
  | `usePanorama(consulta)` | `/api/analise/panorama` | entidade identificada* |
  | `useMencoes(consulta)` | `/api/analise/mencoes` | entidade identificada* |
  | `useMaterias(consulta)` | `/api/analise/materias` | entidade identificada* |

  \* "entidade identificada" = exatamente um de `tituloEleitoral` ou `nrPartido` presente. Com zero ou os dois, o hook fica `enabled: false` e não faz requisição.

  Hooks paginados (`usePoliticos`, `useMencoes`, `useMaterias`) usam `placeholderData: keepPreviousData` para não piscar vazio ao trocar de página.
- **Infra de testes:** adicionar Vitest + `@testing-library/react` + `jsdom` e o script `pnpm run test` (hoje ele não existe no `package.json`).

## Fora de escopo
- **Trocar as telas existentes** (`app/page.tsx`, `app/partidos/[slug]/...`) do mock para a API. Isso vira specs próprias, porque o modelo da API (identificação por `tituloEleitoral`/`nrPartido`, sentimento positivo/neutro/negativo, panorama por eixo) não bate 1:1 com o modelo atual do mock (slugs, `Sintese` com `sobre`/`elogios`/`criticas`, `Trecho` com fato/opinião do autor/inferência do modelo). Essa conciliação precisa ser decidida antes, inclusive como apresentar os dados respeitando as regras de UI do `AGENTS.md`.
- Buscar dados em Server Components (prefetch + `HydrationBoundary`). Esta spec cobre só o consumo client-side.
- Chamar o endpoint `/api/test` a partir da UI.
- Cache HTTP/CDN no proxy (o proxy responde com `Cache-Control: no-store`; o cache fica a cargo do TanStack Query).
- Autenticação de usuários finais e rate limiting no proxy.

## Contrato de dados
Fonte: OpenAPI 3.1 "API Prisma" v1 (colado na conversa de 2026-09-23). Autenticação: header `X-API-KEY`.

**Allowlist de caminhos do proxy** (navegador → `/api/prisma/{caminho}` → backend `/api/{caminho}`):

| Caminho | Parâmetros aceitos (query string no navegador) | Resposta |
|---|---|---|
| `politicos` | `q`, `nrPartido`, `anoEleicao`, `pagina`, `tamanho` | `Page<CandidatoResumoResponse>` |
| `politicos/detalhe` | `tituloEleitoral` | `PoliticoDetalheResponse` |
| `partidos` | `q` | `PartidoResponse[]` |
| `partidos/detalhe` | `nrPartido` | `PartidoResponse` |
| `analise/sentimento` | campos de `ConsultaRequest` | `SentimentoResumoResponse` |
| `analise/por-tema` | campos de `ConsultaRequest` | `AnalisePorTemaResponse` |
| `analise/por-midia` | campos de `ConsultaRequest` | `SentimentoPorMidiaResponse` |
| `analise/panorama` | campos de `ConsultaRequest` | `PanoramaResponse` |
| `analise/mencoes` | campos de `ConsultaRequest` | `Page<MencaoResponse>` |
| `analise/materias` | campos de `ConsultaRequest` | `Page<AnaliseMateriaResponse>` |

Campos de `ConsultaRequest`: `tituloEleitoral`, `nrPartido`, `sentimento` (`positivo`|`neutro`|`negativo`), `tema`, `janela` (`YYYY-MM`), `de`, `ate` (`YYYY-MM-DD`), `pagina` (≥ 0), `tamanho` (1–100).

**Decisão (2026-09-23):** no OpenAPI v1, `politicos/detalhe`, `partidos/detalhe` e todos os `analise/*` são declarados como `GET` com corpo JSON (`ConsultaRequest` no `requestBody`), algo que navegadores e o `fetch` do Node não enviam. O backend será alterado para aceitar **os mesmos campos de `ConsultaRequest`, com os mesmos nomes, como query params no `GET`**, sem corpo. O proxy, portanto, só repassa a query string validada (`GET {API_PRISMA}/api/{caminho}?{params}`). O repasse fica isolado numa única função do proxy (`encaminhar(caminho, params)`).

Entregue pelo backend em 2026-09-24: todos os endpoints aceitam query params, sem `requestBody`. O OpenAPI gerado lista todos os campos de `ConsultaRequest` também em `partidos/detalhe`, mas só `nrPartido` tem efeito ali; o proxy continua aceitando apenas `nrPartido` nesse caminho.

**Emenda (2026-09-24): mudanças de contrato no OpenAPI v1 publicado pelo backend.**
- `GET /api/politicos` ganhou os filtros opcionais `nrPartido` (inteiro, número de legenda) e `anoEleicao` (inteiro, ano com 4 dígitos, ex.: `2026`).
- `GET /api/politicos` passou a responder `Page<CandidatoResumoResponse>`, com **um item por candidatura, não por pessoa**: sem `anoEleicao`, o mesmo político aparece uma vez por eleição disputada. Dados completos continuam em `/politicos/detalhe`.
  ```ts
  interface CandidatoResumoResponse {
    tituloEleitoral?: string;
    nome?: string;
    urlFoto?: string; // nula se UF ou sequencial não existirem
  }
  ```
- `PartidoResponse` ganhou `urlLogo?: string`; `CandidaturaResponse` ganhou `urlFoto?: string`.
- Essas URLs (`urlLogo`, `urlFoto`) passam a ser a imagem usada nas listagens de partidos e de políticos, substituindo as imagens mockadas atuais (`logoUrl`/`imagemUrl` em `app/lib/mock-data.ts`). A troca na UI fica para a spec de migração das telas (ver "Fora do escopo desta versão"); esta spec só expõe os campos nos tipos.

## Critérios de aceite
- [x] (emenda) O proxy aceita `nrPartido` e `anoEleicao` em `politicos` e responde `400` para valores não inteiros ou `anoEleicao` fora do formato de 4 dígitos.
- [x] (emenda) `usePoliticos` repassa `nrPartido` e `anoEleicao` ao proxy e é tipado como `Page<CandidatoResumoResponse>`; filtros diferentes geram query keys diferentes.
- [x] (emenda) `PartidoResponse.urlLogo`, `CandidaturaResponse.urlFoto` e `CandidatoResumoResponse` existem em `app/lib/api/types.ts` e batem com o OpenAPI publicado (checado por teste contra um snapshot dos nomes de campos).
- [x] `@tanstack/react-query` está em `dependencies` e `QueryClientProvider` envolve todas as páginas via `app/layout.tsx`.
- [x] Nenhum arquivo enviado ao navegador contém `API_PRISMA_KEY` nem o valor da chave (verificado com busca no `.next/static` após `pnpm run build`), e nenhuma variável `NEXT_PUBLIC_*` guarda a URL ou a chave da API.
- [x] O proxy injeta `X-API-KEY` com o valor de `API_PRISMA_KEY` em toda requisição repassada ao backend (teste com `fetch`/cliente HTTP mockado).
- [x] O proxy responde `404` a um caminho fora da allowlist (ex.: `/api/prisma/test`, `/api/prisma/../x`) sem chamar o backend.
- [x] O proxy responde `405` a métodos diferentes de `GET`.
- [x] O proxy responde `400` com `{ "erro": string }`, sem chamar o backend, para parâmetros inválidos: `janela` fora do formato `YYYY-MM`, `de`/`ate` fora de `YYYY-MM-DD`, `sentimento` fora de `positivo|neutro|negativo`, `pagina` negativa, `tamanho` fora de 1–100, `nrPartido` não inteiro, ou parâmetro desconhecido para aquele caminho.
- [x] O proxy repassa status e corpo do backend sem alteração para respostas `2xx`, `4xx` e `5xx`.
- [x] O proxy responde `502` com `{ "erro": string }` quando o backend está inacessível ou estoura o timeout (10 s).
- [x] O proxy responde `500` com `{ "erro": "API não configurada" }` quando `API_PRISMA` ou `API_PRISMA_KEY` não estão definidas, sem vazar detalhes.
- [x] `apiGet` omite parâmetros `undefined`/`null`/`""` da query string e lança `ApiError` com o `status` correto para respostas não-`2xx`.
- [x] Cada hook da tabela chama o caminho correto do proxy com os parâmetros recebidos e expõe os dados tipados (um teste por hook, com `fetch` mockado).
- [x] Hooks de análise não fazem requisição quando nem `tituloEleitoral` nem `nrPartido` são informados, ou quando os dois são informados.
- [x] `usePolitico`/`usePartido` não fazem requisição sem identificador.
- [x] Duas chamadas ao mesmo hook com os mesmos parâmetros compartilham a mesma query (uma requisição só), e parâmetros diferentes geram query keys diferentes.
- [x] Um erro `4xx` não é tentado de novo; um erro `5xx`/`502` é tentado até 2 vezes antes de o hook entrar em `isError`.
- [x] Estados de loading, erro e sucesso ficam acessíveis via retorno padrão do `useQuery` (`isPending`, `isError`, `error`, `data`).
- [x] `pnpm run build`, `pnpm run lint` e `pnpm run test` passam.

## Casos de borda
- **Resposta vazia legítima** (`Page` com `empty: true`, lista de partidos `[]`, `PanoramaResponse` com `eixos: []`): é sucesso, não erro. Os hooks devolvem os dados normalmente; o estado vazio é tratado pela tela que consumir.
- **Campos ausentes na resposta**: todos os campos são opcionais nos tipos. Nenhum hook assume presença de campo além do próprio JSON ser objeto/array.
- **Corpo de erro não-JSON** vindo do backend (ex.: HTML de gateway): `apiGet` lança `ApiError` com `mensagem` genérica ("Erro ao consultar a API") em vez de quebrar no `JSON.parse`.
- **`tituloEleitoral`**: tratado sempre como string (preserva zeros à esquerda). Nunca convertido para número.
- **Caminho com path traversal ou encoding estranho** (`..`, `%2e%2e`, barras duplicadas): rejeitado com `404` pela allowlist exata (comparação com a string normalizada, não prefixo).
- **Troca de página em listas paginadas**: dados da página anterior continuam visíveis (`keepPreviousData`) até chegar a nova.
- **Backend lento**: timeout de 10 s no proxy via `AbortSignal.timeout`; o cliente vê `502`.

## Fora do escopo desta versão (futuro)
- Gerar os tipos automaticamente a partir do OpenAPI (`openapi-typescript`) em vez de escrevê-los à mão.
- Prefetch em Server Components com `HydrationBoundary` para primeira renderização sem loading.
- `@tanstack/react-query-devtools` em desenvolvimento.
- `useInfiniteQuery` para menções/matérias ("carregar mais").
- Specs de migração tela a tela (usando `urlLogo`/`urlFoto` como imagem de partidos e políticos nas listagens, no lugar das imagens mockadas; e `usePoliticos({ nrPartido, anoEleicao })` para listar os políticos de um partido sem repetição por eleição): página inicial com `usePartidos`, página de partido com `usePartido` + `usePanorama`, página de político com `usePolitico` + candidaturas. Decidido em 2026-09-23: a UI passa a exibir sentimento `positivo`/`neutro`/`negativo` e a identificar partidos por `nrPartido` (no lugar de slugs). Isso muda o glossário de domínio do `AGENTS.md` (categoria de viés, fato/opinião do autor/inferência do modelo), que deve ser atualizado na mesma spec.
