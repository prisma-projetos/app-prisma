---
version: 1
slug: "app-page-tsx"
primary_target: "app/page.tsx"
related_targets: ["app/partidos/[nrPartido]/page.tsx","app/politicos/[tituloEleitoral]/page.tsx"]
---

# Superfície: app PRISMA (home, partido, político, candidatos)

Modo: Operate. O eleitor encontra uma entidade, entende o que a cobertura diz e chega à matéria.

Escopo da etapa 1: M10, M03, M06, M05, M08, M09, M01, M04 (ver ../prisma-plano-frontend.md). Protótipo no Figma PRISMA-v2 antes do código.

Restrições: neutralidade partidária; espectro nunca codifica dado; sentimento em cinza; WCAG AA claro/escuro; disclaimer de IA visível; nunca ranquear entidades; toda análise linka a fonte.

## Direction contract

THESIS: O PRISMA explica a cobertura como um bom livro de ciências explica um fenômeno: figura numerada, legenda que diz o que conta, e fonte. Recusa o painel de dados com cards, sombras e gráficos coloridos.

OWN-WORLD: Papel branco e tinta preta (no escuro, invertido: papel preto, tinta branca). Cinzas de retícula para dados. Fios finos de 1px e fios grossos de 3px como estrutura de página. Tipografia de livro didático bem editado: sans humanista legível no corpo, títulos grandes e pesados, algarismos tabulares, legendas "Fig. n" em versalete. Boxes "Saiba mais" com fio lateral. Glossário na margem no desktop. O único lugar com cor é o feixe de luz que atravessa o prisma: gradiente contínuo, usado na marca, no foco e no item ativo.

STORY: O visitante entende em uma tela o que é o PRISMA, busca ou escolhe no índice um partido ou candidato, lê a figura da composição da cobertura com uma frase simples, abre "Saiba mais" se quiser o método e segue para as matérias.

FIRST VIEWPORT: Home como abertura de capítulo. No topo, à esquerda, o wordmark PRISMA com um feixe branco que entra num prisma e sai como espectro contínuo, cruzando a largura da página como fio de abertura. Abaixo, em corpo grande, a pergunta "Sobre quem você quer saber?" e um campo de busca largo (≥56px de altura) com botão "Buscar". Em seguida, "Índice de partidos, A–Z": grade de fichas com logo, sigla e nome por extenso, com fio fino entre elas. A ação principal é a busca.

FORM: Livro de Ciências, candidato 7 da lista ordenada; seed 596c2ddc. Sinal: figura da luz decomposta, o foco e a seleção acendendo o espectro. Movimento: o feixe se abre uma vez no carregamento; o foco desliza o fio espectral.

Raises: ausência desenhada (seven-segment); lei de cor (crt-arcade); rótulo fixo em toda figura (starship-terminal); navegação por índice A–Z (star-atlas); grid fixo de etiqueta na ficha (sneaker-boxes); gradiente só no estado ativo (cyclorama).

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance
