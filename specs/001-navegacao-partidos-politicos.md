# Navegação: Home → Partido → Político

## Objetivo
Estabelecer a navegação principal do PRISMA: uma home listando partidos políticos clicáveis (por imagem/logo), uma página de partido mostrando sua síntese em três estados (Sobre/Elogios/Críticas) e seus políticos, e uma página de político com a mesma estrutura de síntese alternável. Usa dados mock, já que o pipeline de classificação ainda não está integrado.

## Escopo
- Página inicial (`/`) com título do produto e lista de partidos políticos como imagens clicáveis (logo do partido).
- Página de partido (`/partidos/[slug]`) exibindo:
  - Nome do partido.
  - Componente de síntese alternável entre três estados: **Sobre** (neutro, dados informativos), **Elogios** e **Críticas** (toggle por botão/abas, sem reload). "Sobre" é o estado inicial exibido.
  - Disclaimer obrigatório de IA (texto fixo definido no AGENTS.md).
  - Lista de políticos do partido como imagens clicáveis.
- Página de político (`/partidos/[slug]/politicos/[politicoSlug]`) exibindo:
  - Nome do político e partido ao qual pertence (com link de volta ao partido).
  - O mesmo componente de síntese alternável (Sobre/Elogios/Críticas), agora com dados do político.
  - Disclaimer obrigatório de IA.
- Componente compartilhado `SinteseTabs` (ou nome equivalente) reutilizado nas páginas de partido e político, recebendo os dados de síntese como props.
- Componente compartilhado `EntidadeAvatar` (ou nome equivalente) para os botões de imagem clicável, reutilizado na home (partidos) e na página de partido (políticos):
  - Para partidos: exibe a logo do partido (imagem mock).
  - Para políticos: exibe um círculo padrão (placeholder) com uma imagem dentro (foto mock, ou ícone genérico de pessoa se a imagem não existir).
  - Em ambos os casos, o hover exibe o nome da entidade (tooltip nativo via `title`, ou label visível abaixo/sobreposto à imagem).
- Dados mock tipados em um módulo local (ex.: `app/lib/mock-data.ts`), representando partidos, políticos e sínteses (Sobre/Elogios/Críticas) com trechos classificados como fato/opinião do autor/inferência do modelo, cada um linkando para uma "fonte" mock (URL fictícia). O conteúdo de "Sobre" é informativo (sem tom de elogio/crítica) e não precisa ser subdividido em fato/opinião/inferência.
- Diferenciação visual entre fato / opinião do autor / inferência do modelo dentro dos trechos de Elogios/Críticas (cores, ícones ou badges distintos).
- Cada trecho de síntese exibido (Sobre/Elogios/Críticas) linka para o artigo de origem mock (regra de rastreabilidade do AGENTS.md).
- Ordem de exibição de partidos e políticos: alfabética (não há ranking de categoria de viés envolvido nesta spec, mas a regra de não-ranqueamento se aplica a qualquer futura categoria de viés exibida).

## Fora de escopo
- Integração real com a API (`NEXT_PUBLIC_API_BASE_URL`) — fica para spec futura.
- Categorias de viés / taxonomia versionada e filtragem por período — não exibidas nesta spec (mock atual não simula múltiplas categorias de viés lado a lado).
- Comparação lado a lado entre categorias de viés (feature futura, mencionada no AGENTS.md como exemplo).
- Busca, paginação ou filtros de partidos/políticos.
- Autenticação ou personalização por usuário.
- Responsividade avançada além do básico (mobile-first simples com Tailwind, sem breakpoints customizados extensos).

## Contrato de dados
Nenhum endpoint real é consumido nesta spec. Estrutura mock local, desenhada para espelhar o formato esperado da API futura (a confirmar com o backend):

```ts
type TrechoTipo = "fato" | "opiniao_autor" | "inferencia_modelo";

interface Trecho {
  tipo: TrechoTipo;
  texto: string;
  fonteUrl: string;
  fonteTitulo: string;
}

interface TrechoInformativo {
  texto: string;
  fonteUrl: string;
  fonteTitulo: string;
}

interface Sintese {
  sobre: TrechoInformativo[];
  elogios: Trecho[];
  criticas: Trecho[];
}

interface Politico {
  slug: string;
  nome: string;
  cargo: string;
  imagemUrl?: string; // ausente → EntidadeAvatar usa ícone genérico de pessoa
  sintese: Sintese;
}

interface Partido {
  slug: string;
  nome: string;
  sigla: string;
  logoUrl: string;
  sintese: Sintese;
  politicos: Politico[];
}
```

## Critérios de aceite
- [ ] A home (`/`) exibe o título do produto e uma lista de partidos como imagens (logos) clicáveis.
- [ ] Passar o mouse sobre a imagem de um partido exibe seu nome.
- [ ] Clicar em um partido navega para `/partidos/[slug]` correspondente.
- [ ] A página de partido exibe nome do partido, disclaimer de IA, e abas/toggle que alternam a síntese exibida entre "Sobre", "Elogios" e "Críticas" sem recarregar a página, com "Sobre" selecionado por padrão.
- [ ] As três abas (Sobre/Elogios/Críticas) permanecem clicáveis a qualquer momento, incluindo a aba atualmente selecionada; é sempre possível voltar para "Sobre" a partir de Elogios ou Críticas clicando na aba correspondente.
- [ ] A página de partido lista os políticos do partido como imagens (foto ou avatar circular padrão) clicáveis.
- [ ] Passar o mouse sobre a imagem de um político exibe seu nome.
- [ ] Clicar em um político navega para `/partidos/[slug]/politicos/[politicoSlug]` correspondente.
- [ ] A página de político exibe nome do político, partido (com link de volta), disclaimer de IA, e o mesmo componente de abas Sobre/Elogios/Críticas, com dados próprios do político, respeitando a mesma regra de retorno livre entre abas.
- [ ] Cada trecho de síntese exibido (nos três estados) possui um link visível para a fonte mock.
- [ ] Trechos de Elogios/Críticas do tipo fato, opinião do autor e inferência do modelo são visualmente diferenciados (não usam o mesmo estilo). O estado "Sobre" não precisa dessa diferenciação, por ser informativo.
- [ ] Acessar um slug de partido ou político inexistente resulta em página 404 (via `notFound()`).
- [ ] Partidos e políticos são listados em ordem alfabética.

## Casos de borda
- Slug de partido não encontrado em `/partidos/[slug]` → 404.
- Slug de político não encontrado, ou não pertencente ao partido do slug pai, em `/partidos/[slug]/politicos/[politicoSlug]` → 404.
- Partido sem políticos cadastrados → lista de políticos exibe estado vazio ("Nenhum político cadastrado para este partido.").
- Síntese sem trechos em uma das visões (ex.: partido sem críticas registradas, ou sem conteúdo em "Sobre") → estado vazio ("Nenhum trecho de crítica disponível.", "Nenhuma informação disponível.") em vez de lista em branco.
- Político sem `imagemUrl` → `EntidadeAvatar` exibe o círculo padrão com ícone genérico de pessoa, sem quebrar o layout.

## Fora do escopo desta versão (futuro)
- Múltiplas categorias de viés por entidade e comparação lado a lado entre elas.
- Filtro por período/data de análise.
- Integração com API real e loading/error states de rede.
- Busca e paginação de partidos/políticos.
