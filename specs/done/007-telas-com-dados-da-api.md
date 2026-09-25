# Telas com dados reais da API: partidos, políticos e panorama por sentimento

## Objetivo
Trocar os dados mockados (`app/lib/mock-data.ts`) pelos dados da API Prisma em todas as telas, usando os hooks da spec 006. Com isso, as entidades passam a ser identificadas por `nrPartido`/`tituloEleitoral`, as imagens vêm de `urlLogo`/`urlFoto`, e a síntese Sobre/Elogios/Críticas dá lugar ao panorama por sentimento (`positivo`/`neutro`/`negativo`) que a API produz.

## Mudanças nas regras de produto (`AGENTS.md`) — aprovadas em 2026-09-24
A API não produz categorias de viés nem separa trechos em fato/opinião do autor/inferência do modelo. Três seções do `AGENTS.md` deixam de corresponder aos dados e passam a ter esta redação:

1. **Glossário de domínio (substitui o atual):**
   - **Entidade**: um político (identificado por `tituloEleitoral`) ou partido (identificado por `nrPartido`). *(mantido, com os identificadores)*
   - **Sentimento**: `positivo`, `neutro` ou `negativo`. É a classificação que o pipeline atribui a parágrafos e matérias. *(substitui "categoria de viés")*
   - **Panorama**: o texto consolidado pelo modelo para uma entidade, um sentimento (o "eixo" na API) e uma janela mensal. Sempre exibido com as fontes que o sustentam. *(substitui "síntese")*
   - **Fonte**: a matéria jornalística (veículo + link) que sustenta um panorama.
   - **Janela**: o mês (`YYYY-MM`) a que um panorama se refere.
   - Removidos: "categoria de viés", "síntese", "fato / opinião do autor / inferência do modelo".
2. **Regras de UI:**
   1. Nunca ranquear sentimentos nem apresentá-los como certos ou errados. A ordem de exibição é sempre fixa: **Negativo, Neutro, Positivo** (alfabética).
   2. Todo panorama exibido precisa linkar para as suas fontes. Um panorama sem fonte não é exibido.
   3. Disclaimer obrigatório em qualquer tela que mostre sentimento ou panorama:
      > "As classificações de sentimento e os panoramas são gerados por modelos de IA e podem conter erros. Os panoramas resumem o que as fontes publicaram, não fatos verificados por esta plataforma."
   4. **O texto gerado por modelo é sempre identificado como tal** (rótulo "Gerado por IA" + nome do modelo) e fica visualmente separado da lista de fontes. *(substitui a regra de fato/opinião/inferência)*
3. **Comentário sobre o contrato:** a descrição do projeto no `AGENTS.md` deixa de falar em "classifica o viés político" e passa a dizer "classifica o sentimento da cobertura jornalística sobre políticos e partidos".

As specs `001`, `003` e `004` usam o glossário antigo e ficam como registro histórico, sem edição.

## Escopo

### Rotas
| Rota | Substitui | Identificador |
|---|---|---|
| `/` | `/` | (nenhum) |
| `/partidos/[nrPartido]` | `/partidos/[slug]` | `nrPartido`, inteiro positivo |
| `/politicos/[tituloEleitoral]` | `/partidos/[slug]/politicos/[politicoSlug]` | `tituloEleitoral`, só dígitos |

- As páginas continuam como Server Components que só leem e validam `params` (identificador malformado → `notFound()`) e renderizam um componente client, que busca os dados com os hooks da spec 006.
- As rotas antigas por slug são removidas, sem redirect.

### Página inicial (`/`)
- Lista de partidos via `usePartidos()`, ordenada por `sigla` (alfabética, `localeCompare` em `pt-BR`).
- Cada partido é um `EntidadeAvatar` com `urlLogo` e tooltip "SIGLA — Nome", que linka para `/partidos/{numero}`.
- Estados: skeleton da grade durante o carregamento; mensagem de erro com botão "Tentar de novo" (`refetch`); "Nenhum partido encontrado." para lista vazia.

### Página de partido (`/partidos/[nrPartido]`)
Seções, nesta ordem:
1. **Cabeçalho:** `usePartido(nrPartido)`, com logo (`urlLogo`), sigla, nome e número. Se a API responder 404, a página mostra o estado "Partido não encontrado" com link para a home.
2. **Disclaimer** (texto novo, ver acima).
3. **Sentimento da cobertura** (`useSentimento({ nrPartido })`, ver "Componentes").
4. **Panorama** (`usePanorama({ nrPartido })`, ver "Componentes").
5. **Políticos:** `usePoliticos({ nrPartido, anoEleicao: ANO_ELEICAO, pagina, tamanho: 48 })`.
   - `ANO_ELEICAO = 2026`, constante em `app/lib/config.ts`.
   - Grade de `EntidadeAvatar` com `urlFoto`, cada um linkando para `/politicos/{tituloEleitoral}`.
   - Campo de busca por nome (`q`, com debounce de 300 ms), que volta para a página 0 ao mudar.
   - Paginação "Anterior / Próxima" com "Página X de Y" e total de candidatos (`totalElements`). A página atual e a busca ficam na URL (`?pagina=`, `?q=`), para que o link seja compartilhável e o botão voltar funcione.
   - A ordem é a devolvida pela API (hoje alfabética por nome na prática; ver "Casos de borda").
   - Estados: skeleton; erro com "Tentar de novo"; "Nenhum político encontrado." (com ou sem busca).

### Página de político (`/politicos/[tituloEleitoral]`)
1. **Cabeçalho:** `usePolitico(tituloEleitoral)`, com foto (o `urlFoto` da candidatura mais recente), `nomeSocial` quando houver ou `nome` caso contrário, e cargo + UF + sigla do partido da candidatura mais recente. A sigla linka para `/partidos/{nrPartido}`. 404 → estado "Político não encontrado".
2. **Disclaimer.**
3. **Sentimento da cobertura** (`useSentimento({ tituloEleitoral })`).
4. **Panorama** (`usePanorama({ tituloEleitoral })`).
5. **Candidaturas:** tabela com ano, cargo, UF, partido (sigla linkando para o partido), número de urna e resultado, ordenada por ano (decrescente) e turno. Campos nulos são exibidos como "—".
   - "Candidatura mais recente" = maior `anoEleicao`, desempatado pelo maior `turno`.

### Componentes
- **`EntidadeAvatar`** (existente, alterado): passa a ser client component e trata falha de carregamento (`onError`) exibindo o fallback atual (iniciais para partido, ícone de pessoa para político). Também exibe o fallback quando `imagemUrl` é nulo ou vazio. As imagens continuam em `<img>`, sem `next/image` (nenhuma mudança em `next.config.ts`).
- **`SentimentoResumo`** (novo): uma barra horizontal empilhada com os três sentimentos, na ordem fixa Negativo, Neutro, Positivo, cada segmento com largura = `percentual`. Abaixo, a legenda com rótulo, percentual (1 casa decimal) e total de parágrafos de cada sentimento. Rodapé: "Baseado em N parágrafos · método X (versão Y)", a partir de `totalParagrafos` e `proveniencia`. Se `totalParagrafos` for 0 ou `porSentimento` vier vazio: "Ainda não há parágrafos analisados sobre esta entidade."
  - As cores dos sentimentos são neutras entre si, sem verde = bom e vermelho = ruim (regra 1): três tons distintos da mesma família de azul/cinza, com contraste AA nos dois temas e o rótulo em texto sempre visível (a cor nunca é a única pista).
- **`PanoramaAbas`** (novo, substitui `SinteseTabs`): abas **Negativo / Neutro / Positivo** (nessa ordem), com **Neutro** selecionada inicialmente. Cada aba mostra, para o eixo correspondente:
  - cabeçalho "Panorama de {mês por extenso} de {ano}" (da `janela`) e "{totalItens} matérias";
  - o `texto` dentro de um bloco com o rótulo "Gerado por IA · {modelo}" (regra 4);
  - os **temas** (`temas[]`), cada um com `tema`, `ocorrencias` e a lista de fontes do tema (recolhível);
  - as **fontes** (`fontes[]`): link para `url` (abre em nova aba, `rel="noopener noreferrer"`), veículo (ou o domínio da URL quando `veiculo` for nulo) e data de publicação (`dd/mm/aaaa`);
  - os **avisos** (`avisos[]`), quando houver, numa caixa "Divergências registradas na verificação automática".
  - Aba de eixo ausente na resposta, ou eixo com `fontes` vazio: "Não há panorama {negativo|neutro|positivo} para este período." O `texto` de um eixo sem fonte **não** é exibido (regra 2).
  - `eixos: []` / `janela: null` em todas as abas: "Ainda não há panorama para esta entidade."
- **`Disclaimer`**: atualizado para o texto novo.

### Remoções
- `app/lib/mock-data.ts`, `app/components/sintese-tabs.tsx` e os tipos de `app/lib/types.ts` usados só pelo mock (`Sintese`, `Trecho`, `TrechoInformativo`, `TrechoTipo`, `CargoCategoria`, `CARGO_LABELS`, `CARGO_GRUPOS`, `Politico`, `Partido`, `ReferenciaPolitico`). O arquivo é removido se ficar vazio.
- As imagens de `public/images/` referenciadas só pelo mock. As que outros lugares usam (ex.: o logo do produto) ficam.

## Fora de escopo
- Agrupar os políticos do partido por cargo (spec 004): `CandidatoResumoResponse` não traz cargo, e buscar o detalhe de cada um dos até 1.097 candidatos não é viável. **Isso é uma regressão consciente**, que volta quando a API expuser `cargo` na listagem (ver "Futuro").
- Link entre presidente e vice (spec 004): a API não modela a chapa. Também é regressão consciente.
- Seletor de janela (mês) para o panorama: sempre a janela mais recente.
- Seletor de ano da eleição na lista de políticos: fixo em `ANO_ELEICAO`.
- As telas de `por-tema`, `por-midia`, `mencoes` e `materias`.
- Prefetch no servidor (`HydrationBoundary`) e metadados dinâmicos (`<title>` com o nome da entidade).

## Contrato de dados
Somente os hooks da spec 006 (sem mudança de contrato):

| Tela | Hook | Parâmetros |
|---|---|---|
| Home | `usePartidos` | — |
| Partido | `usePartido` | `nrPartido` |
| Partido | `useSentimento`, `usePanorama` | `{ nrPartido }` |
| Partido | `usePoliticos` | `{ nrPartido, anoEleicao: 2026, q?, pagina, tamanho: 48 }` |
| Político | `usePolitico` | `tituloEleitoral` |
| Político | `useSentimento`, `usePanorama` | `{ tituloEleitoral }` |

Comportamentos observados na API real em 2026-09-24, que esta spec assume:
- `partidos/detalhe` e `politicos/detalhe` respondem **404** para identificador inexistente.
- `panorama` sem material responde 200 com `janela: null, eixos: []`; `sentimento` sem material responde 200 com `totalParagrafos: 0, porSentimento: []`.
- `Fonte.veiculo` pode ser nulo (frequente).
- `politicos` devolve os candidatos já na ordem de exibição.

**Decisão (2026-09-24):** os formatos e a ordem devolvidos pela API são confiáveis e usados como vêm; a UI não reordena nem normaliza dados da API além do descrito nesta spec.

## Critérios de aceite
**Regras de produto**
- [x] O `AGENTS.md` tem o glossário, as regras de UI, o disclaimer e a descrição do projeto com a redação da seção "Mudanças nas regras de produto".
- [x] Nenhum arquivo em `app/` contém os termos "categoria de viés", "síntese", "fato", "opinião do autor" ou "inferência do modelo" em código, copy ou nome de componente (checado por teste que varre `app/`).

**Home**
- [x] Exibe um avatar por partido retornado, ordenado por sigla, com `urlLogo` como imagem e link para `/partidos/{numero}`.
- [x] Exibe o skeleton durante o carregamento, a mensagem de erro com "Tentar de novo" (que chama o refetch) e "Nenhum partido encontrado." para lista vazia.

**Partido**
- [x] `/partidos/abc`, `/partidos/0` e `/partidos/-1` → 404 do Next, sem chamar a API.
- [x] Mostra sigla, nome, número e logo de `usePartido`; API 404 → "Partido não encontrado" com link para a home.
- [x] Lista os políticos com `nrPartido`, `anoEleicao=2026` e `tamanho=48`, cada avatar com `urlFoto` e link para `/politicos/{tituloEleitoral}`.
- [x] "Próxima"/"Anterior" mudam `pagina` na URL e na requisição; "Anterior" fica desabilitado na página 0 e "Próxima" na última (`last: true`).
- [x] A busca envia `q` depois de 300 ms sem digitar, volta à página 0 e reflete `q` na URL; abrir a URL com `?q=joao&pagina=2` restaura a busca e a página.
- [x] Mostra "Nenhum político encontrado." para `content` vazio.

**Político**
- [x] `/politicos/abc` → 404 do Next, sem chamar a API; API 404 → "Político não encontrado".
- [x] Exibe `nomeSocial` quando presente e `nome` caso contrário.
- [x] A foto, o cargo, a UF e o partido do cabeçalho vêm da candidatura com maior `anoEleicao` (desempate: maior `turno`), e a sigla linka para `/partidos/{nrPartido}`.
- [x] A tabela de candidaturas lista todas, por ano decrescente, com "—" para campos nulos.

**Sentimento e panorama (partido e político)**
- [x] `SentimentoResumo` exibe os três sentimentos na ordem Negativo, Neutro, Positivo, com percentual e total, independentemente da ordem da resposta; exibe o rodapé de proveniência; e mostra a mensagem de vazio quando `totalParagrafos` é 0.
- [x] As cores dos sentimentos não usam as famílias verde nem vermelho, e cada segmento tem rótulo em texto.
- [x] `PanoramaAbas` renderiza as abas na ordem Negativo, Neutro, Positivo, com Neutro selecionada ao abrir.
- [x] Cada aba exibe o `texto` com o rótulo "Gerado por IA · {modelo}", a janela por extenso, os temas, as fontes (link com `target="_blank"` e `rel="noopener noreferrer"`, veículo ou domínio, data `dd/mm/aaaa`) e os avisos, quando houver.
- [x] Eixo com `fontes: []` não exibe o `texto` e mostra a mensagem de ausência daquele eixo.
- [x] `eixos: []` mostra "Ainda não há panorama para esta entidade."
- [x] O disclaimer com o texto novo aparece nas páginas de partido e de político.
- [x] Cada seção (cabeçalho, sentimento, panorama, políticos) tem estado de carregamento e de erro próprio: o erro de uma seção não esconde as outras.

**Componentes e limpeza**
- [x] `EntidadeAvatar` exibe o fallback quando `imagemUrl` é nulo/vazio e quando a imagem dispara `onError`.
- [x] `mock-data.ts`, `sintese-tabs.tsx`, os tipos do mock e as rotas por slug não existem mais.
- [x] `pnpm run build`, `pnpm run lint` e `pnpm run test` passam.

## Casos de borda
- **`urlFoto`/`urlLogo` nulos ou quebrados (404 no MinIO)**: fallback do `EntidadeAvatar`, sem ícone de imagem quebrada.
- **`tituloEleitoral` com zeros à esquerda**: sempre tratado como string na rota e na requisição.
- **Político sem candidaturas** (`candidaturas: []`): cabeçalho só com nome e foto de fallback, e "Nenhuma candidatura registrada." na tabela.
- **Político cuja candidatura mais recente não é de 2026**: aparece normalmente na sua página. A lista do partido só mostra 2026, por definição.
- **Político com candidaturas por partidos diferentes**: o cabeçalho mostra o partido da mais recente; a tabela mostra todos, cada um com seu link.
- **`pagina` na URL maior que o total, negativa ou não numérica**: tratada como 0.
- **Ordem da lista de políticos**: a da API; a UI não reordena (ordenar só a página atual daria uma ordem falsa entre páginas).
- **Nomes em caixa alta** (a API devolve "PARTIDO DOS TRABALHADORES", "AARON SALLES..."): exibidos como vêm, sem conversão de caixa (não há regra segura para nomes próprios).
- **`percentual` que não soma exatamente 100** por arredondamento: a barra usa as proporções de `total`, não de `percentual`, para sempre fechar 100%; a legenda mostra o `percentual` da API.
- **`scoreMedio` 0 para neutro**: não exibido (a spec não usa `scoreMedio`).
- **`avisos` com texto técnico**: exibidos literalmente, sem reescrita.

## Fora do escopo desta versão (futuro)
- Pedido ao backend: incluir `cargo` (e `uf`) em `CandidatoResumoResponse`. Com isso, o agrupamento por cargo da spec 004 volta.
- Pedido ao backend: modelar a chapa presidente/vice para restaurar o link entre os dois.
- Seletor de janela no panorama e de ano da eleição na lista de políticos.
- Telas de concentração de pauta (`por-tema`) e de fontes (`por-midia`), inclusive para evidenciar quando a maior parte dos parágrafos não tem veículo associado (hoje ~71% no PT).
- Rastreabilidade até o parágrafo (`mencoes`) e lista de matérias (`materias`).
- Prefetch no servidor e metadados dinâmicos por entidade.
