# Retícula nos sentimentos

## Objetivo
Decisão de Bea (27/09/2026): os três sentimentos passam a se diferenciar também por textura (retícula), e não só pelo tom de cinza. Os cinzas vizinhos ficam em cerca de 3:1 entre si, e o neutro, em 1,6:1 contra o papel. A textura ajuda quem tem baixa visão, telas com pouco brilho, impressão e prints compartilhados, e combina com os gráficos de livro didático da direção "Livro de Ciências".

## Escopo
1. Cada sentimento ganha uma retícula própria, desenhada em CSS sobre o cinza atual (sem imagem):
   - **Negativo:** cinza sólido (`sent-negativo`), sem textura;
   - **Neutro:** pontos (`sent-neutro` com pontos de 1,5px em `tinta-2`, a cada 6px);
   - **Positivo:** listras diagonais (`sent-positivo` com listras de 2px em `papel`, a 45°, a cada 7px).
2. A mesma retícula aparece na barra de sentimento (Fig. 1) e na amostra da legenda, que passa de 12px para 16px para a textura ser visível.
3. As texturas não sugerem juízo: nenhuma parece alerta, "vazio" ou destaque. A ordem e os nomes continuam os mesmos (Negativo, Neutro, Positivo, com a explicação ao lado).
4. Funciona nos dois temas, com os tokens de cada um. Em `forced-colors` (alto contraste do sistema), o navegador remove os fundos, e o nome ao lado de cada amostra continua carregando a informação.

## Fora de escopo
- Retícula em outros gráficos (as barras de temas são uma série só, em `grafico`).

## Critérios de aceite
- [ ] `SENTIMENTO_COR` combina o token de cor com a classe de retícula de cada sentimento.
- [ ] `globals.css` define as três retículas, e neutro e positivo usam `background-image` diferentes; negativo não tem textura.
- [ ] A barra e a legenda usam as mesmas classes.
- [ ] A amostra da legenda tem 16px.
- [ ] Verificação visual em 1440px e 390px, claro e escuro: as três faixas se distinguem sem depender do tom.
