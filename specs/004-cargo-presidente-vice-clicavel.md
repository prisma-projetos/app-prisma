# Separar cargo "Presidente e vice-presidente" e tornar o vice clicável

## Objetivo
A categoria de cargo `presidente_vice_presidente` mistura dois cargos eletivos distintos (Presidente e Vice-presidente da República) em um único valor de enum, e o vice é hoje apenas um texto solto (`viceNome`), sem entidade própria — quebrando a promessa de que toda referência a um político ou partido cadastrado na plataforma é navegável. Esta spec separa os dois cargos, transforma o vice em uma entidade `Politico` real clicável na página do candidato a presidente, e organiza a listagem de políticos na página do partido por categoria de cargo, já que agora há mais categorias distintas coexistindo.

## Escopo
- **Separar o cargo em dois valores de `CargoCategoria`:**
  - `presidente` → rótulo "Presidente da República"
  - `vice_presidente` → rótulo "Vice-presidente da República"
  - O valor `presidente_vice_presidente` deixa de existir no tipo, no `CARGO_LABELS` e em qualquer dado mockado.
- **Vice-presidente vira um `Politico` cadastrado**, com seu próprio `slug`, vinculado ao seu próprio partido real (que pode ser diferente do partido do candidato a presidente — ex.: Geraldo Alckmin/PSB é vice de Lula/PT) e com `cargo: "vice_presidente"`.
  - Cada vice tem sua própria `sintese.sobre` (pelo menos um trecho, com `fonteUrl` rastreável), seguindo o mesmo padrão de fonte já usado para os candidatos a presidente (`candidatoPresidente` em `app/lib/mock-data.ts`).
- **Referência do candidato a presidente para o seu vice:** o `Politico` do candidato a presidente ganha um campo opcional `viceRef` (substitui `viceNome` para este cargo) contendo a referência necessária para montar o link de navegação até o vice (slug do partido do vice + slug do político do vice).
- **UI da página do político** (`app/partidos/[slug]/politicos/[politicoSlug]/page.tsx`): quando `politico.cargo === "presidente"` e `viceRef` está presente, o nome do vice é exibido como um link clicável (`<Link>`) que navega até a página do vice, em vez do texto solto atual (`· vice: {politico.viceNome}`).
- **Migração dos 13 candidatos a presidente já mockados** (`app/lib/mock-data.ts`, candidatos criados via `candidatoPresidente`): cada um passa a ter `cargo: "presidente"`. Para os candidatos cujo vice já está identificado com nome e partido na fonte atual (Lula/Alckmin, Flávio Bolsonaro/Alfredo Gaspar, Caiado/Kassab, Zema/Girão, Edmilson Costa/Cleusa Santos, Hertz Dias/Vanessa Portugal, Samara Martins/Raquel Brício), criar o `Politico` correspondente do vice com `cargo: "vice_presidente"`, vinculado ao partido identificável na fonte, e ligar via `viceRef`. Candidatos sem vice anunciado (Augusto Cury, Clariana Barão, Rui Costa Pimenta, Renan Santos, Wilson Grassi) permanecem sem `viceRef`.
- **Listagem de políticos na página do partido agrupada por categoria de cargo** (`app/partidos/[slug]/page.tsx`): em vez da grade única atual (`partido.politicos.map(...)`), os políticos do partido passam a ser exibidos em seções, uma por categoria de cargo, cada uma com um título (o rótulo de `CARGO_LABELS`, ou o rótulo de grupo — ver abaixo) e a grade de avatares clicáveis dentro dela.
  - **Ordem das seções é fixa** (mesma ordem/critério de não-ranqueamento já usado em `CARGO_LABELS`): Deputado federal, Deputado estadual, Senador (primeira vaga), Senador (segunda vaga), Governador e vice-governador, Presidente e vice-presidente da República.
  - **Exceção de agrupamento:** `presidente` e `vice_presidente` são os únicos dois valores de `CargoCategoria` que compartilham a mesma seção/título na listagem, exibidos juntos sob o rótulo "Presidente e vice-presidente da República" — refletindo que são a mesma disputa eleitoral, mesmo sendo cargos tipados separadamente nos dados (ver spec anterior nesta mesma spec). Todas as demais categorias têm uma seção exclusiva, 1 para 1 com `CargoCategoria`.
  - Categorias sem nenhum político cadastrado no partido não geram seção vazia (a seção só aparece se houver pelo menos um político naquela categoria/grupo).
  - Dentro de cada seção, a ordem dos políticos permanece a ordenação alfabética já usada hoje (`getPartidoBySlug` já ordena `politicos` por nome).

## Fora de escopo
- Qualquer mudança no cargo `governador_vice_governador` — o vice de governador continua sendo exibido como texto solto (`viceNome`) nesta versão, mesmo sendo uma inconsistência análoga (ver "Fora do escopo desta versão (futuro)").
- Tornar clicáveis outras referências textuais a políticos/partidos que hoje não são links (ex.: menções dentro de trechos de síntese/`sobre`/`elogios`/`criticas`) — esta spec cobre especificamente o par presidente↔vice.
- Página ou navegação dedicada listando "todos os vices" ou filtrando por `vice_presidente` como categoria separada na listagem de um partido além do que a UI de partido já faz hoje.
- Confirmar/pesquisar vices para candidatos que hoje não têm vice anunciado na fonte usada pela spec 003.
- Link de volta do vice para o candidato a presidente (ex.: "vice de Fulano" na página do vice) — a navegação nesta spec é unidirecional (presidente → vice).

## Contrato de dados
Sem integração com API real. Ajustes no mock local (`app/lib/mock-data.ts`) e nos tipos (`app/lib/types.ts`):

```ts
export type CargoCategoria =
  | "deputado_federal"
  | "deputado_estadual"
  | "senador_primeira_vaga"
  | "senador_segunda_vaga"
  | "governador_vice_governador"
  | "presidente"
  | "vice_presidente";

export const CARGO_LABELS: Record<CargoCategoria, string> = {
  deputado_federal: "Deputado federal",
  deputado_estadual: "Deputado estadual",
  senador_primeira_vaga: "Senador (primeira vaga)",
  senador_segunda_vaga: "Senador (segunda vaga)",
  governador_vice_governador: "Governador e vice-governador",
  presidente: "Presidente da República",
  vice_presidente: "Vice-presidente da República",
};

export interface ReferenciaPolitico {
  partidoSlug: string;
  politicoSlug: string;
}

export interface Politico {
  slug: string;
  nome: string;
  cargo: CargoCategoria;
  viceNome?: string; // usado apenas quando cargo é governador_vice_governador
  viceRef?: ReferenciaPolitico; // usado apenas quando cargo é presidente
  imagemUrl?: string;
  sintese: Sintese;
}

// Agrupamento de categorias para a listagem da página do partido.
// Todo valor de CargoCategoria mapeia para um grupo; presidente e
// vice_presidente são os únicos que colidem no mesmo grupo.
export const CARGO_GRUPOS: { chave: string; titulo: string; cargos: CargoCategoria[] }[] = [
  { chave: "deputado_federal", titulo: "Deputado federal", cargos: ["deputado_federal"] },
  { chave: "deputado_estadual", titulo: "Deputado estadual", cargos: ["deputado_estadual"] },
  { chave: "senador_primeira_vaga", titulo: "Senador (primeira vaga)", cargos: ["senador_primeira_vaga"] },
  { chave: "senador_segunda_vaga", titulo: "Senador (segunda vaga)", cargos: ["senador_segunda_vaga"] },
  { chave: "governador_vice_governador", titulo: "Governador e vice-governador", cargos: ["governador_vice_governador"] },
  { chave: "presidencia", titulo: "Presidente e vice-presidente da República", cargos: ["presidente", "vice_presidente"] },
];
```

`Partido` e `Sintese` permanecem sem alteração estrutural.

## Critérios de aceite
- [ ] `CargoCategoria` não contém mais `presidente_vice_presidente`; contém `presidente` e `vice_presidente` como valores distintos.
- [ ] `CARGO_LABELS["presidente"]` é exatamente "Presidente da República" e `CARGO_LABELS["vice_presidente"]` é exatamente "Vice-presidente da República".
- [ ] Cada candidato a presidente com vice já identificado na fonte (spec 003) tem `viceRef` apontando para um `Politico` real com `cargo: "vice_presidente"`, cadastrado no partido correto (o do vice, não necessariamente o do titular).
- [ ] O `Politico` do vice tem `sintese.sobre` com pelo menos um trecho com `fonteUrl` rastreável (reaproveitando a fonte já usada para o candidato a presidente correspondente, quando não houver fonte específica melhor).
- [ ] Na página do político (`/partidos/:slug/politicos/:politicoSlug`), quando `cargo === "presidente"` e `viceRef` existe, o nome do vice aparece como link (`<Link href="/partidos/{viceRef.partidoSlug}/politicos/{viceRef.politicoSlug}">`) e a navegação leva à página do vice, exibindo `CARGO_LABELS["vice_presidente"]` e a sigla do partido do vice.
- [ ] Candidatos a presidente sem vice anunciado não exibem nenhum texto/link de vice (sem quebra de layout).
- [ ] Na página do partido, os políticos aparecem divididos em seções por categoria de cargo, na ordem fixa definida em `CARGO_GRUPOS`, cada seção com o título correspondente.
- [ ] `presidente` e `vice_presidente` aparecem juntos, na mesma seção "Presidente e vice-presidente da República", quando o partido tiver político(s) em qualquer um desses dois cargos.
- [ ] Uma categoria/grupo sem nenhum político cadastrado no partido não gera seção (nenhum título vazio ou grade vazia).
- [ ] Dentro de cada seção, os políticos continuam ordenados alfabeticamente por nome.
- [ ] `pnpm run build`/`pnpm run lint` passam sem erro de tipo após a mudança do enum e da interface `Politico`.

## Casos de borda
- Vice cujo partido não é identificável com confiança na fonte disponível → não criar `Politico` nem `viceRef` para ele nesta rodada; não inventar partido (mesma regra já aplicada na spec 003 para candidatos a presidente).
- Slug do vice colide com um slug de político já existente → gerar slug único (ex.: sufixo do partido), já que `getPoliticoBySlug` busca por partido + slug do político.
- Vice que também é, coincidentemente, titular de outro cargo cadastrado (ex.: já é deputado federal com `Politico` próprio) → fora de escopo; tratar como pessoa duplicada não é resolvido nesta spec.
- `governador_vice_governador` com `viceNome` continua exibido como texto solto, não-clicável — comportamento inalterado, não é regressão desta spec.
- Partido com políticos em apenas uma categoria → uma única seção é exibida (não um caso especial, apenas o resultado natural do agrupamento).
- Partido só com `vice_presidente` cadastrado e sem `presidente` correspondente naquele partido (caso o vice seja de um partido diferente do titular) → a seção "Presidente e vice-presidente da República" aparece mesmo assim nesse partido, contendo apenas o vice.
- Partido sem nenhum político cadastrado → mantém o estado vazio já existente ("Nenhum político cadastrado para este partido."), sem seções.

## Fora do escopo desta versão (futuro)
- Aplicar o mesmo tratamento (vice como `Politico` cadastrado e clicável) ao cargo `governador_vice_governador`, alinhando com o princípio geral de que toda referência a uma entidade cadastrada deve ser navegável.
- Link de volta do vice para o titular na página do vice.
- Modelar `presidente`/`vice_presidente` como uma "chapa" (entidade própria com sua própria síntese conjunta), em vez de dois `Politico`s ligados por referência.
