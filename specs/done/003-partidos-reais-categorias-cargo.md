# Partidos reais, categorias de cargo e candidatos à Presidência 2026

## Objetivo
Substituir os partidos fictícios do mock por todos os partidos com registro definitivo no TSE (com descrição real no campo "Sobre"), introduzir uma categorização formal dos cargos eletivos disputados pelos políticos exibidos, e atualizar a categoria "Presidente e vice-presidente da República" com os candidatos reais oficializados para as eleições de 2026.

## Escopo
- **Partidos reais**: substituir os 3 partidos fictícios atuais (Frente Popular Unida, Partido Aliança Nacional, Partido Novo Horizonte) pelos partidos com registro definitivo no TSE na data de implementação (30 partidos, conforme `https://www.tse.jus.br/partidos/partidos-registrados-no-tse`, em agosto/2026).
  - Campo `sintese.sobre` de cada partido passa a conter uma descrição real e verificável (história, fundação, posicionamento declarado), com `fonteUrl` apontando para a página do partido em `tse.jus.br` (ou, quando o TSE não tiver o dado específico — ex. ano de fundação —, uma fonte jornalística/enciclopédica confiável complementar).
  - Os campos `sintese.elogios` e `sintese.criticas` de cada partido **continuam mockados/fictícios** (não fazem parte desta spec — ver "Fora de escopo"), mas devem existir (podem ser array vazio) para não quebrar o componente `SinteseTabs`.
  - `sigla` e `logoUrl`: usar a sigla oficial do TSE; `logoUrl` mantém o padrão mock atual (`logoPlaceholder(sigla, cor)` ou arquivo estático já versionado em `public/images`, quando existente para a sigla).
- **Categorias de cargo**: introduzir um tipo controlado para o cargo de cada político, com exatamente estes 6 valores (nomenclatura e ordem de exibição fixas, sem ranqueamento):
  1. Deputado federal
  2. Deputado estadual (ou distrital, no caso do Distrito Federal)
  3. Senador (primeira vaga)
  4. Senador (segunda vaga)
  5. Governador e vice-governador
  6. Presidente e vice-presidente da República
  - Cada `Politico` passa a ter um campo de categoria tipado (enum), em vez do atual `cargo: string` livre. Um mapa de rótulos (`CARGO_LABELS`) traduz o valor do enum para o texto exibido na UI, usando exatamente os rótulos acima.
  - Para as categorias "Governador e vice-governador" e "Presidente e vice-presidente da República", adicionar um campo opcional `viceNome?: string` no `Politico`, exibido junto ao nome do titular (ex.: "Fulano — vice: Beltrano"). O vice **não** é uma entidade com síntese própria nesta spec (ver "Fora de escopo").
  - Os 4 políticos mockados existentes (Helena Marques, João Pedrosa, Ricardo Teixeira, Camila Nogueira) são migrados para as novas categorias correspondentes ao seu `cargo` atual, permanecendo vinculados a um partido real (ver abaixo) em vez do partido fictício original. João Pedrosa é classificado em "Senador (primeira vaga)" (mock, sem correspondência real obrigatória).
- **Candidatos à Presidência 2026**: para a categoria "Presidente e vice-presidente da República", substituir qualquer conteúdo mockado pelos candidatos realmente oficializados para a eleição de 2026, com base em `https://g1.globo.com/politica/eleicoes/2026/noticia/2026/08/04/eleicoes-2026-candidatos-a-presidencia-oficializados.ghtml` (nome do candidato, partido, vice, quando disponível na fonte).
  - **Observação para revisão**: no momento da escrita desta spec, o acesso direto a `g1.globo.com` via ferramenta de busca automatizada retornou erro (bloqueio de domínio). A lista de candidatos foi cross-referenciada com fontes jornalísticas alternativas (O Povo/BBC Brasil, Jota, Gazeta do Povo, Canal Rural) que reportam a mesma leva de 13 chapas oficializadas após as convenções partidárias de 5/8/2026. Na implementação, tentar novamente o acesso direto ao G1 (ex. via navegador) antes de usar como fonte definitiva; se persistir o bloqueio, manter as fontes alternativas e registrar isso no `fonteTitulo`/`fonteUrl` de cada trecho.
  - Cada candidato à Presidência entra como um `Politico` com `cargo: "presidente_vice_presidente"`, vinculado ao seu partido real correspondente na lista de partidos desta spec, com `sintese.sobre` contendo um resumo factual verificável (nome, partido, data de oficialização, vice quando houver) e `fonteUrl` apontando para a matéria de origem.
  - Candidatos cujo partido não seja identificável com confiança nas fontes disponíveis (ex. candidaturas avulsas/pré-candidaturas sem sigla confirmada) ficam de fora desta spec até confirmação — não inventar partido.
- Nenhuma mudança de UI/componentes é necessária além do que já existe (`SinteseTabs`, `EntidadeAvatar`, páginas de partido/político) — esta spec é de dados e tipagem, não de layout.

## Fora de escopo
- Descrições reais de `elogios`/`criticas` para partidos ou políticos — nesta spec, esses campos seguem mockados/fictícios (a classificação de viés real depende do pipeline separado, fora deste repositório).
- Síntese própria (Sobre/Elogios/Críticas) para vices de governador/presidente como entidades independentes — o vice aparece apenas como texto complementar (`viceNome`) na entidade titular.
- Preenchimento de políticos reais para as categorias "Deputado federal", "Deputado estadual", "Senador" e "Governador" — essas continuam com os políticos mockados existentes (Helena Marques, João Pedrosa, Ricardo Teixeira, Camila Nogueira), apenas recategorizados e realocados para um partido real.
- Filtro ou navegação por categoria de cargo na UI (ex.: página listando "todos os deputados federais") — a categoria é apenas um atributo exibido, não um mecanismo de navegação novo.
- Os 24 partidos "em formação" (sem registro definitivo no TSE) — apenas os 30 partidos com registro definitivo entram nesta spec.
- Atualização automática/periódica dos dados (esta é uma carga estática de mock, refletindo o estado em agosto/2026; não há job de sincronização com o TSE ou G1).

## Contrato de dados
Sem integração com API real. Ajustes no mock local (`app/lib/mock-data.ts`) e nos tipos (`app/lib/types.ts`):

```ts
export type CargoCategoria =
  | "deputado_federal"
  | "deputado_estadual"
  | "senador_primeira_vaga"
  | "senador_segunda_vaga"
  | "governador_vice_governador"
  | "presidente_vice_presidente";

export const CARGO_LABELS: Record<CargoCategoria, string> = {
  deputado_federal: "Deputado federal",
  deputado_estadual: "Deputado estadual",
  senador_primeira_vaga: "Senador (primeira vaga)",
  senador_segunda_vaga: "Senador (segunda vaga)",
  governador_vice_governador: "Governador e vice-governador",
  presidente_vice_presidente: "Presidente e vice-presidente da República",
};

export interface Politico {
  slug: string;
  nome: string;
  cargo: CargoCategoria; // antes: string livre
  viceNome?: string; // só usado quando cargo é governador ou presidente
  imagemUrl?: string;
  sintese: Sintese;
}
```

`Partido` e `Sintese` permanecem sem alteração estrutural.

## Critérios de aceite
- [ ] `getPartidos()` retorna os 30 partidos com registro definitivo no TSE (nome oficial + sigla), em ordem alfabética, sem os 3 partidos fictícios anteriores.
- [ ] Cada partido tem pelo menos um trecho em `sintese.sobre` com texto real e `fonteUrl` que resolve para `tse.jus.br` ou outra fonte verificável citada.
- [ ] `Politico.cargo` é do tipo `CargoCategoria` (união fechada de 6 valores); código que compila sem `cargo` livre em string.
- [ ] A UI (página de partido) exibe o rótulo de `CARGO_LABELS[politico.cargo]` — exatamente o texto das 6 categorias listadas no Escopo — junto ao nome do político.
- [ ] Para políticos com `cargo` igual a `governador_vice_governador` ou `presidente_vice_presidente` e `viceNome` definido, a UI exibe o nome do vice junto ao nome do titular.
- [ ] Existe pelo menos um `Politico` com `cargo: "presidente_vice_presidente"` para cada candidato à Presidência 2026 identificado com partido confirmado, vinculado ao partido real correspondente na lista de 30 partidos.
- [ ] Cada `Politico` da categoria presidente tem `sintese.sobre` com `fonteUrl` apontando para a matéria de origem (G1, se acessível; senão, a fonte alternativa registrada em `fonteTitulo`).
- [ ] Os 4 políticos mockados pré-existentes continuam acessíveis por seus slugs atuais, agora com `cargo` tipado e `partido` real (não mais FPU/PAN/PNH).
- [ ] `pnpm run build`/`pnpm run lint` (ou equivalente do projeto) passam sem erros de tipo após a migração de `cargo: string` para `cargo: CargoCategoria`.

## Casos de borda
- Partido real sem político nenhum atribuído (a maioria dos 30, já que só ~5 políticos mockados existem) → página do partido exibe o estado vazio já implementado ("Nenhum político cadastrado para este partido.").
- Candidato à Presidência cujo partido não pôde ser confirmado com confiança na fonte → não incluído nesta rodada (não bloqueia a spec; registrar como pendência).
- Fonte do TSE sem texto descritivo suficiente para compor `sobre` (só nome/sigla/número) → complementar com uma fonte jornalística/enciclopédica, citada explicitamente, mantendo o TSE como fonte primária quando possível.
- `viceNome` ausente para um candidato a governador/presidente que ainda não anunciou vice → campo fica `undefined`; UI não exibe nada complementar (sem quebrar layout).

## Fora do escopo desta versão (futuro)
- Sínteses de Elogios/Críticas reais para partidos e políticos (depende do pipeline de classificação).
- Perfis completos (com síntese própria) para vices.
- Navegação/filtro por categoria de cargo.
- Atualização contínua dos dados conforme o calendário eleitoral avança (ex. indeferimentos de candidatura, novas coligações).
