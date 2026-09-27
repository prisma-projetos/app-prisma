---
name: PRISMA
description: O teor da cobertura da imprensa sobre partidos e candidatos, explicado como figura de livro de ciências.
colors:
  papel: "#F7F7F7"
  papel-2: "#EDEDED"
  tinta: "#1A1A1A"
  tinta-2: "#474747"
  tinta-3: "#666666"
  fio: "#D4D4D4"
  sent-negativo: "#1A1A1A"
  sent-neutro: "#C4C4C4"
  sent-positivo: "#6B6B6B"
  grafico: "#1A1A1A"
  placa-logo: "#EFEFEF"
  papel-escuro: "#141414"
  papel-2-escuro: "#1F1F1F"
  tinta-escuro: "#EDEDED"
  tinta-2-escuro: "#B0B0B0"
  tinta-3-escuro: "#8F8F8F"
  fio-escuro: "#333333"
  sent-negativo-escuro: "#F0F0F0"
  sent-neutro-escuro: "#3F3F3F"
  sent-positivo-escuro: "#8A8A8A"
  grafico-escuro: "#EDEDED"
typography:
  display: { fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif", fontSize: "64px", fontWeight: 800, lineHeight: "68px", letterSpacing: "-1.5px", fontFeature: "\"tnum\"" }
  titulo-1: { fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif", fontSize: "40px", fontWeight: 700, lineHeight: "46px", letterSpacing: "-0.8px", fontFeature: "\"tnum\"" }
  titulo-2: { fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif", fontSize: "28px", fontWeight: 700, lineHeight: "34px", letterSpacing: "-0.4px", fontFeature: "\"tnum\"" }
  titulo-3: { fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif", fontSize: "21px", fontWeight: 700, lineHeight: "28px", letterSpacing: "0px", fontFeature: "\"tnum\"" }
  corpo-grande: { fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif", fontSize: "21px", fontWeight: 400, lineHeight: "32px", fontFeature: "\"tnum\"" }
  corpo: { fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif", fontSize: "18px", fontWeight: 400, lineHeight: "28px", fontFeature: "\"tnum\"" }
  corpo-forte: { fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif", fontSize: "18px", fontWeight: 600, lineHeight: "28px", fontFeature: "\"tnum\"" }
  apoio: { fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif", fontSize: "16px", fontWeight: 400, lineHeight: "24px", fontFeature: "\"tnum\"" }
  legenda: { fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif", fontSize: "15px", fontWeight: 600, lineHeight: "22px", letterSpacing: "0.2px", fontFeature: "\"tnum\"" }
rounded:
  reto: "0px"
  pilula: "9999px"
  circulo: "50%"
spacing:
  "4": "4px"
  "8": "8px"
  "12": "12px"
  "16": "16px"
  "20": "20px"
  "24": "24px"
  "32": "32px"
  "40": "40px"
  "48": "48px"
  "64": "64px"
  "96": "96px"
components:
  button-primary: { backgroundColor: "{colors.tinta}", textColor: "{colors.papel}", typography: "{typography.corpo-forte}", rounded: "{rounded.reto}", padding: "0 32px", height: "48px" }
  button-secondary: { backgroundColor: "{colors.papel}", textColor: "{colors.tinta}", typography: "{typography.corpo-forte}", rounded: "{rounded.reto}", padding: "0 24px", height: "48px" }
  button-header: { backgroundColor: "{colors.papel}", textColor: "{colors.tinta}", typography: "{typography.apoio}", rounded: "{rounded.pilula}", padding: "0 20px", height: "48px" }
  input-busca: { backgroundColor: "{colors.papel}", textColor: "{colors.tinta}", typography: "{typography.corpo}", rounded: "{rounded.reto}", padding: "0 20px", height: "64px" }
  input-filtro: { backgroundColor: "{colors.papel}", textColor: "{colors.tinta}", typography: "{typography.corpo}", rounded: "{rounded.reto}", padding: "0 20px", height: "56px" }
  saiba-mais: { backgroundColor: "{colors.papel-2}", textColor: "{colors.tinta}", typography: "{typography.corpo}", rounded: "{rounded.reto}", padding: "24px 32px" }
  placa-logo: { backgroundColor: "{colors.placa-logo}", rounded: "{rounded.reto}", size: "64px" }
  foto-candidato: { rounded: "{rounded.circulo}", size: "64px" }
  legenda-figura: { textColor: "{colors.tinta-2}", typography: "{typography.legenda}" }
---

<!-- Fonte: protótipo Figma PRISMA-v2 (variáveis "PRISMA · Claro"/"PRISMA · Escuro" e estilos de texto), capturas em .impeccable/review/ e as correções aprovadas na revisão final, que prevalecem sobre as capturas. Ainda não há código desta direção; revalidar contra o build quando existir. -->

# Design System: PRISMA

## Overview

**Creative North Star: "O Livro de Ciências"**

O PRISMA explica a cobertura da imprensa como um bom livro didático explica um fenômeno: figura numerada, legenda que diz o que foi contado, e a fonte. Papel branco e tinta preta; no escuro, o inverso. A estrutura da página vem de fios, não de caixas: um fio grosso abre cada seção, um fio fino separa itens. Os dados ficam em cinzas neutros. A única cor é a luz decomposta pelo prisma.

A leitura é para quem tem pouco letramento digital: tipo grande, alvos de toque grandes, uma coisa por vez e o termo técnico sempre acompanhado de uma explicação simples. O sistema recusa o painel de dados: sem cards com sombra, sem gráficos coloridos e sem cantos arredondados decorativos.

**Key Characteristics:**
- Papel e tinta, planos, sem sombras; profundidade só por fio e por papel-2.
- Toda figura tem legenda "Fig. n" que diz o que conta, o período e a base.
- Sentimento em cinza, sempre com o nome do termo e a explicação ao lado.
- O espectro é luz, não dado: gradiente contínuo, só em lugares contados.
- Atkinson Hyperlegible Next em tudo, com algarismos tabulares.

## Colors

Monocromático em dois modos, com um único gradiente espectral fora da paleta de dados. Contrastes medidos (WCAG) contra papel, claro / escuro.

### Primary
- **Espectro** (gradiente linear contínuo: #FF3B30 0, #FF9F0A .17, #FFD60A .33, #30D158 .5, #64D2FF .66, #0A84FF .8, #BF5AF2 1): marca, feixe da abertura, foco e indicador ativo. Não é cor de texto nem de área. Contra o papel claro, as paradas medem de 1,41:1 (amarelo) a 3,65:1 (azul); por isso nunca carrega sozinho uma informação ou um estado.

### Neutral
- **Papel / papel-escuro**: fundo de página.
- **Papel-2**: fundo do box "Saiba mais", hover de linha de lista e esqueleto de carregamento.
- **Tinta** (16,2:1 / 15,7:1): texto, fio grosso, botão primário, borda de campo.
- **Tinta-2** (8,7:1 / 8,5:1): texto secundário, legendas, metadados.
- **Tinta-3** (5,4:1 / 5,7:1; sobre papel-2, 4,9:1 / 5,1:1): placeholder e texto terciário. Piso de uso; nada mais claro que isso é texto.
- **Fio** (1,4:1 / 1,5:1): fio de 1px entre itens. Decorativo; nunca é a única borda de um controle.
- **Placa-logo** (#EFEFEF nos dois modos): placa atrás das logos de partido, que aparecem como vieram.

### Dados
- **Sent-negativo** (16,2:1 / 16,6:1), **sent-neutro** (1,6:1 / 1,8:1), **sent-positivo** (5,0:1 / 5,3:1). Vizinhos entre si: neutro/positivo 3,1:1 / 3,05:1; negativo/positivo 3,3:1 / 3,0:1.
- **Gráfico**: barras do gráfico de temas, em tinta.

### Named Rules
**A Regra do Papel e da Tinta.** Nenhuma cor da interface é preto puro (#000000) ou branco puro (#FFFFFF). O papel claro é #F7F7F7, o papel escuro é #141414, a tinta é #1A1A1A / #EDEDED. Decisão de Bea em 25/09/2026. Vale também para texto sobre botão, placas e fundos de imagem.

**A Regra da Luz.** O espectro entra em cinco lugares: marca PRISMA, feixe da abertura, contorno de foco, indicador de item ativo (navegação e aba) e o contorno do estado em destaque no mapa (hover ou foco, spec 023). Não entra em barra, gráfico, sentimento, fundo de seção, card nem texto.

**A Regra do Gradiente Contínuo.** O espectro é sempre um gradiente contínuo. Faixas separadas de cor são proibidas: leem como bandeira.

**A Regra do Cinza Sem Juízo.** Sentimento usa só os três cinzas, sempre na ordem Negativo, Neutro, Positivo. O tom de cinza nunca é a única pista: o nome do termo e a explicação simples ficam sempre ao lado.

**A Regra da Neutralidade.** Nenhuma cor de partido na interface. A logo é a única cor partidária e fica sobre a placa-logo.

## Typography

**Fonte única:** Atkinson Hyperlegible Next (Regular, SemiBold, Bold, ExtraBold), com fallback system-ui.

**Character:** Sans do Braille Institute desenhada para baixa visão (I, l e 1 não se confundem; 0 e O também não). Títulos pesados e grandes, corpo folgado.

### Hierarchy
- **Display** (ExtraBold): abertura da home e nome da entidade no topo da página.
- **Título 1 / Título 2** (Bold): título de página e títulos de seção, logo abaixo do fio grosso.
- **Título 3** (Bold): título de box, grupo e item.
- **Corpo grande**: frase-resumo da figura e texto de abertura; até ~62ch.
- **Corpo / Corpo forte**: texto corrido, itens de lista, rótulos de controle; até ~70ch.
- **Apoio**: metadados, datas, explicação simples ao lado do termo.
- **Legenda de figura** (SemiBold): "Fig. n" em versalete seguido do texto em caixa de frase.

### Named Rules
**A Regra do Algarismo Tabular.** Números usam os algarismos tabulares da própria fonte ("tnum"). Atkinson Hyperlegible Mono não entra em legenda, lista nem resumo; no máximo, dentro da visão Tabela.

**A Regra do Termo Primeiro.** O termo do glossário (entidade, sentimento negativo/neutro/positivo, panorama, fonte, janela) é o rótulo principal. A explicação simples ("critica", "só informa", "elogia") vem ao lado em Apoio, nunca no lugar dele.

## Layout

Grade de livro. Desktop com 1440px e margens de 96px (home, 64px). Páginas de entidade em três colunas: 792px de texto, 96px de medianiz e 360px de margem para glossário e fontes laterais. No celular (390px) com margens de 20px, a margem de glossário desce para depois do conteúdo e cada figura ocupa a largura toda.

Ritmo de espaçamento em 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 e 96px. Entre seções, 64 a 96px; entre título e conteúdo, 24px; entre itens de lista, 20 a 24px de cada lado do fio fino. Grade de partidos: seis colunas no desktop, com a linha crescendo até a célula mais alta (sem altura fixa).

Movimento: um só momento autoral. O feixe se abre uma vez no carregamento; com prefers-reduced-motion, aparece já aberto. O resto da interface troca de estado sem animação.

## Elevation & Depth

Plano. Não há sombras. A hierarquia vem de fios (3px em tinta abre cada seção; 1px em fio separa itens) e de papel-2 para destacar um box ou uma linha em hover.

### Named Rules
**A Regra do Papel Plano.** Nenhuma sombra, em nenhum estado. Se algo precisa se destacar, usa fio ou papel-2.

## Shapes

Cantos retos em tudo. Duas exceções: fotos de candidato em círculo e a pílula "Modo escuro"/"Modo claro" do cabeçalho. Bordas de controle em tinta: 2px no campo de busca e nos filtros, 2px nos botões secundários. Estado vazio usa contorno tracejado de 1px.

## Components

### Cabeçalho
- Wordmark PRISMA com o prisma e o leque espectral à esquerda; à direita, "Partidos", "Candidatos" e a pílula "Modo escuro"/"Modo claro". No celular, os mesmos três itens quebram para a linha de baixo (não há menu recolhível). Item ativo em bold com o fio espectral de 4px.
- Item ativo: indicador espectral de 4px sob o item, sempre junto de peso SemiBold/Bold ou sublinhado. Nunca só cor.
- Fio de 1px separa o cabeçalho do conteúdo.

### Busca com sugestões
- Campo de 64px de altura, borda 2px em tinta, ícone de lupa em SVG, placeholder em tinta-3; botão "Buscar" primário colado à direita. Exemplos em Apoio abaixo.
- Sugestões (desenhadas no celular, em `.impeccable/review/mobile.png`): painel colado ao campo, com borda de 2px em tinta. Os resultados ficam agrupados por tipo, "Partidos" e depois "Candidatos", com o título do grupo em Apoio SemiBold tinta-2. Cada item mostra a sigla ou o nome em Corpo forte e a descrição em Apoio tinta-2, com 48px no mínimo e destaque em papel-2. Grupo vazio mostra uma frase de orientação, como opção desabilitada, por exemplo: "Nenhum candidato com “psd” no nome. Tente o nome completo da pessoa." Desktop e celular usam o mesmo painel, colado ao campo; com o painel aberto, o contorno de foco fica rente ao campo (sem outset) para o painel continuar a borda. A opção ativa pelas setas rola para ficar visível.

### Ficha de partido
- Célula da grade: placa-logo de 64px com a logo em object-fit contain; sigla em Título 3, nome por extenso em Apoio, "nº" em tinta-2. Fios de 1px entre células; a célula inteira é o alvo.

### Figura com legenda
- Toda figura (feixe, barra de sentimento, gráfico de temas) termina com "Fig. n" em versalete + texto em caixa de frase dizendo o que conta, a janela e a base.

### Barra de sentimento com legenda-tabela
- Barra horizontal empilhada em Negativo, Neutro, Positivo, com contorno de 1px em tinta (o neutro tem só 1,6:1 contra o papel).
- Abaixo, legenda em forma de tabela: amostra de cor, termo ("Negativo") em Corpo forte, explicação ("critica") em Apoio, contagem e percentual alinhados à direita em algarismos tabulares. Fio de 1px entre linhas. Acima, frase-resumo em Corpo grande.

### Saiba mais
- Box recolhível em papel-2 com fio lateral de 1px em tinta. Título em Título 3 com chevron em SVG. Dentro, texto simples primeiro; detalhe técnico por último em Apoio.

### Gráfico de temas
- Barras horizontais em "gráfico", rótulo à esquerda, valor tabular à direita da barra. Alternância Gráfico/Tabela em controle segmentado reto com borda 2px; opção ativa em tinta com texto papel. No celular, o rótulo sobe acima da barra.

### Abas do panorama
- Abas na ordem Negativo, Neutro, Positivo, cada uma com a contagem de matérias em Apoio. Aba ativa: indicador espectral de 4px mais peso Bold. Sob as abas, rótulo "Gerado por IA · {modelo} · {janela}" em Legenda, e o panorama em Corpo, separado da lista de fontes por fio.

### Item de matéria
- Veículo em Corpo forte, data em Apoio, sentimento como etiqueta de texto com o termo, contorno de 1px e canto reto (a pílula das capturas contraria a regra de formas). Parágrafo em Corpo. Link "Ler matéria no {veículo}" sublinhado em repouso, com seta SVG. Fio de 1px entre itens.

### Lista paginada
- Margem de glossário (partido e político, spec 024): `<aside>` "Palavras desta página" na coluna de 360px, com fio de 3px e `<dl>` dos termos do glossário (Parágrafo, Sentimento, Tema, Janela, Panorama, Fonte) e a explicação simples; `sticky` no desktop, depois da análise no celular.
- Índice por letra (home, spec 024): "Ir para a letra" com uma letra por inicial de sigla, cada uma com alvo de 48px, apontando para a primeira ficha da letra.
- Lista de candidatos (/candidatos e lista do partido, componente `LinhaCandidato`): foto circular de 64px, nome como link sublinhado em repouso que cobre a linha inteira (alvo grande), e cargo. Sem estado nem partido: a listagem da API não traz esses campos. Linha de 1px entre itens, hover em papel-2. Rodapé com "Anterior", "Página n de N" e "Próxima" em botões secundários de 48px.

### Seletor de janela
- Rótulo "Janela (mês das matérias)" + select de 56px com borda 2px em tinta e chevron SVG (`CampoSelect`, sem a seta nativa). Opções: "Todo o período" e os 12 últimos meses; um mês mais antigo vindo de link entra como opção extra. Sem texto de ajuda: a API não informa quais meses têm dados.

### Rodapé com aviso
- Em toda página, o aviso com o texto exato do CLAUDE.md em Apoio, tinta-2, e o wordmark à direita. Fio de 1px acima.

### Estados
- **Foco** (todos os controles, dois modos): anel interno de 2px em tinta mais contorno externo de 3px em espectro, com offset de 2px. O espectro sozinho mede de 1,41:1 a 3,65:1 contra o papel, por isso o anel em tinta é obrigatório.
- **Hover**: papel-2 em linhas e células; sublinhado mais grosso em links; botão primário mantém tinta.
- **Desabilitado**: borda e texto em fio/tinta-3, sem preenchimento, cursor padrão; o texto continua legível.
- **Carregando**: esqueleto em blocos de papel-2 dentro da forma final, com a frase "Carregando…" em Apoio.
- **Erro**: box com borda 2px em tinta, título em Corpo forte, causa em Apoio e link "Tentar de novo".
- **Vazio desenhado**: a figura aparece em contorno tracejado de 1px com uma frase dizendo o que falta e quando aparece.

## Do's and Don'ts

### Do:
- **Do** abrir cada seção com fio de 3px em tinta e separar itens com fio de 1px.
- **Do** numerar toda figura com "Fig. n" em versalete e dizer o que conta, a janela e a base.
- **Do** manter o termo do glossário como rótulo e a explicação simples ao lado.
- **Do** usar alvo de toque de 48px no mínimo.
- **Do** pôr o aviso de IA com o texto exato no rodapé de toda página.

### Don't:
- **Don't** usar o espectro em dado, fundo, texto ou em faixas separadas de cor.
- **Don't** marcar item ativo, sentimento ou estado só com cor.
- **Don't** usar sombra, card elevado ou canto arredondado fora de fotos e das pílulas do cabeçalho.
- **Don't** pôr Atkinson Hyperlegible Mono em legenda, lista ou resumo.
- **Don't** fixar a altura das células da grade de partidos.

## Decisões em aberto

- **Retícula para sentimentos**: padrões de pontos ou hachura além do cinza. Não decidido.
- **Posição do feixe**: decidida na spec 015. Fica abaixo da busca, como Fig. 1 com legenda na medida de leitura (760px), e não como fio de abertura junto ao wordmark.
- **Texto do aviso**: se continua dizendo "gerados por modelos de IA", já que o classificador atual é uma lista de palavras (baseline v1). O texto só muda no CLAUDE.md.
- **Foco que desliza** (contrato de direção): descartado em 27/09/2026 (spec 024). A regra de um só momento autoral de movimento (o feixe da home) vale mais; o indicador ativo e o foco aparecem parados.
- **Versalete**: confirmar que a Atkinson Hyperlegible Next tem versalete de verdade (smcp); versalete sintetizado pelo navegador não serve.
