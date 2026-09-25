# Filtro por cargo, nomes sempre visíveis e fontes recolhíveis

## Objetivo
A API passou a informar e a filtrar o cargo de cada candidatura em `GET /api/politicos`. Esta spec usa isso para permitir filtrar a lista de políticos de um partido por cargo (combinado com a busca por nome), deixa o nome dos políticos sempre visível nessa lista e torna a lista de fontes do panorama recolhível, recolhida por padrão, para encurtar a página.

## Escopo
1. **Contrato (proxy, tipos e hook):**
   - O proxy aceita `cargo` (texto não vazio) em `politicos`.
   - `CandidatoResumoResponse` ganha `cargo?: string`.
   - `FiltroPoliticos` e `usePoliticos` ganham `cargo?: string`, que entra na query key.
   - O snapshot `test/fixtures/openapi-v1.json` é atualizado para o OpenAPI publicado em 2026-09-24 (com `cargo`).
2. **Filtro por cargo em `PoliticosDoPartido`** (`/partidos/[nrPartido]`):
   - Um `<select>` simples, rotulado "Cargo", ao lado do campo de busca por nome. Primeira opção: "Todos os cargos" (sem filtro).
   - As opções são uma lista fixa em `app/lib/cargos.ts` (a API não tem endpoint que liste cargos), com valor igual ao da API e rótulo em caixa normal, **nesta ordem** (a do TSE, da esfera federal para a estadual, sem juízo de valor):

     | Valor enviado (`cargo`) | Rótulo |
     |---|---|
     | `PRESIDENTE` | Presidente |
     | `VICE-PRESIDENTE` | Vice-presidente |
     | `GOVERNADOR` | Governador |
     | `VICE-GOVERNADOR` | Vice-governador |
     | `SENADOR` | Senador |
     | `1º SUPLENTE` | 1º suplente |
     | `2º SUPLENTE` | 2º suplente |
     | `DEPUTADO FEDERAL` | Deputado federal |
     | `DEPUTADO ESTADUAL` | Deputado estadual |
     | `DEPUTADO DISTRITAL` | Deputado distrital |
   - **Combinação dos filtros:** cargo e nome são aplicados juntos na mesma requisição (`nrPartido` + `anoEleicao` + `cargo` + `q`). Mudar o cargo preserva o nome digitado e vice-versa; qualquer mudança de filtro volta para a página 0.
   - O cargo fica na URL (`?cargo=`), junto com `q` e `pagina`. Abrir a URL restaura o select. Um `cargo` na URL que não está na lista é ignorado (tratado como "Todos os cargos").
   - Estado vazio com filtro: "Nenhum político encontrado." (o mesmo de hoje).
3. **Nome sempre visível na lista de políticos:** cada avatar exibe o nome do político abaixo da foto o tempo todo (não só no hover), centralizado, com quebra de linha para nomes longos e sem truncar. `EntidadeAvatar` ganha a prop `mostrarNome` (padrão `false`, então a home não muda).
4. **Fontes recolhíveis no panorama** (`PanoramaAbas`): a seção "Fontes (N)" de cada eixo vira um bloco recolhível (`<details>`), **recolhido por padrão**, cujo título "Fontes (N)" é o controle de abrir/fechar. Os links, veículos e datas são os mesmos de hoje. A regra 2 do `AGENTS.md` continua atendida: as fontes estão na página, a um clique, e a contagem fica sempre visível.

## Fora de escopo
- Exibir o cargo embaixo do nome na lista (só o nome, conforme pedido).
- Descobrir as opções de cargo pela API (não há endpoint para isso).
- Esconder opções de cargo sem candidatos naquele partido.
- Mudanças na home, na página de político ou nos temas do panorama (que já são recolhíveis).

## Contrato de dados
`GET /api/politicos` (OpenAPI v1, publicado em 2026-09-24):
- novo parâmetro `cargo` (string, sem diferenciar maiúsculas de minúsculas; ex.: `PRESIDENTE`);
- `CandidatoResumoResponse` = `{ tituloEleitoral, nome, cargo, urlFoto }`.

Validado na API real: `cargo=PRESIDENTE&nrPartido=13&anoEleicao=2026` → 1 resultado; `cargo=DEPUTADO FEDERAL&q=maria` → 17 resultados. Os 10 valores da tabela acima são todos os encontrados nas candidaturas de 2026 do PT, do PL e do PSOL.

## Critérios de aceite
- [x] O proxy repassa `cargo` em `politicos` e responde 400 para `cargo` em outros caminhos.
- [x] `usePoliticos({ cargo })` envia `cargo` e filtros com cargos diferentes geram query keys diferentes.
- [x] `CandidatoResumoResponse` bate com o snapshot atualizado do OpenAPI (teste de contrato).
- [x] O select "Cargo" lista "Todos os cargos" seguido dos 10 cargos na ordem da tabela.
- [x] Escolher um cargo envia `cargo` com o valor da API, grava `?cargo=` na URL, volta para a página 0 e mantém `q`.
- [x] Buscar por nome com um cargo selecionado envia `q` e `cargo` juntos e mantém `?cargo=` na URL.
- [x] Voltar para "Todos os cargos" remove `cargo` da requisição e da URL.
- [x] Abrir `?cargo=SENADOR&q=joao` restaura o select e a busca e envia os dois filtros; `?cargo=INVALIDO` é tratado como "Todos os cargos".
- [x] Na lista de políticos, o nome de cada político é visível sem hover; na home, os partidos continuam só com o tooltip.
- [x] Em cada eixo do panorama, "Fontes (N)" aparece recolhido ao abrir a aba; ao clicar, as fontes (links com `target="_blank"` e `rel="noopener noreferrer"`) ficam visíveis.
- [x] `pnpm run build`, `pnpm run lint` e `pnpm run test` passam.

## Casos de borda
- Cargo sem candidatos no partido: "Nenhum político encontrado."
- `cargo` na URL em minúsculas (`?cargo=senador`): a comparação com a lista ignora caixa, e o select mostra "Senador".
- Nome muito longo: quebra em várias linhas dentro da largura do avatar, sem empurrar a grade.
- Candidato com `nome` nulo: nada é exibido embaixo da foto (o link continua com `aria-label` vazio, como hoje).

## Fora do escopo desta versão (futuro)
- Pedido ao backend: um endpoint (ou um facet na resposta de `/politicos`) com os cargos disponíveis e as contagens por partido, para montar o select dinamicamente e esconder cargos vazios.
- Exibir o cargo de cada candidato na lista quando o filtro for "Todos os cargos".
