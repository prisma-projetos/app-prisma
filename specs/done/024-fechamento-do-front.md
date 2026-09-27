# Fechamento do front: glossário na margem, índice por letra e lista do partido

## Objetivo
Fechar os pontos de frontend que ficaram pendentes na revisão das fases 3 e 4 ("teto" apontado pelo revisor e itens da direção "Livro de Ciências"), a pedido de Bea em 27/09/2026 ("terminar 100% do que falta do front").

## Escopo
1. **Glossário na margem** (páginas de partido e de político):
   - a análise passa a usar a grade de livro de `DESIGN.md`: coluna de texto de até 792px, medianiz de 96px e margem de 360px a partir de `lg`;
   - na margem, o bloco "Palavras desta página" (`<aside>`, Título 3, fio de 3px) com os termos do glossário do `CLAUDE.md` e a explicação simples de cada um, em `<dl>`:
     - Parágrafo: parte de uma matéria que cita o partido ou o candidato; é o que se conta no sentimento;
     - Sentimento: negativo se o parágrafo critica, neutro se só informa, positivo se elogia;
     - Tema: assunto identificado na matéria; uma matéria pode ter vários;
     - Janela: o mês das matérias consideradas;
     - Panorama: resumo, gerado por IA, do que as matérias de cada sentimento dizem;
     - Fonte: a matéria de um veículo que sustenta um panorama;
   - no desktop, o bloco acompanha a leitura (`position: sticky`); no celular, ele vem depois da análise.
2. **Índice por letra na home:** acima da grade de partidos, a navegação "Ir para a letra" com as letras iniciais que existem nas siglas (ex.: A, C, D, M, N, P, R, S, U). Cada letra é um link de 48px para a primeira ficha daquela letra (âncora `#letra-{X}`). Ao ser alcançada pelo link, a ficha fica visível abaixo do cabeçalho.
3. **Lista de candidatos do partido no formato de `/candidatos`:** a grade de fotos com nomes centralizados vira a mesma lista em linhas de `/candidatos` (foto de 64px, nome como link que cobre a linha, cargo). A linha vira um componente compartilhado (`LinhaCandidato`). Busca, filtro de cargo e paginação continuam como estão.
4. **Foco que "desliza":** fica registrado como **descartado** no `DESIGN.md`. A regra de um só momento de movimento (correção 10 da fase 1) vale mais que a promessa do contrato de direção.

## Fora de escopo
- Letras como cabeçalhos dentro da grade (as fichas continuam numa grade única).
- Glossário na home e em `/candidatos`.

## Critérios de aceite
- [x] Partido e político mostram o `aside` "Palavras desta página" com os 6 termos e as definições, depois da análise na ordem do documento.
- [x] A partir de `lg`, a análise e a margem ficam lado a lado; no celular, a margem vem depois da análise.
- [x] A home mostra "Ir para a letra" com uma letra por inicial de sigla, sem letras repetidas e em ordem alfabética; cada link aponta para `#letra-{X}` e existe um elemento com esse id na primeira ficha da letra.
- [x] A lista de candidatos do partido mostra, para cada candidato, a foto, o nome formatado como link para `/politicos/{tituloEleitoral}` e o cargo.
- [x] `DESIGN.md` registra o foco que desliza como descartado, com o motivo.
- [x] Testes, lint e build passam; verificação visual em 390px e 1440px, claro e escuro.
