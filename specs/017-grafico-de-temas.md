# Gráfico de temas com tabela equivalente (M01)

## Objetivo
Hoje os temas só aparecem dentro do panorama, como lista recolhida, e não dá para comparar quais assuntos aparecem mais na cobertura. As páginas de partido e de político ganham a seção "Temas mais citados", com um gráfico de barras e a mesma informação em tabela.

## Escopo
1. **Seção "Temas mais citados"** nas páginas de partido e de político, entre "Sentimento da cobertura" e "Panorama", aberta com fio de 3px (componente `Secao`).
2. **Figura (Fig. 2)** com os 10 temas de maior contagem, na ordem da API (maior contagem primeiro):
   - cada linha: nome do tema, barra horizontal em `grafico` proporcional ao maior valor e o número de matérias ao fim da barra, com algarismos tabulares;
   - as barras são decorativas (`aria-hidden`); nome e número são texto;
   - no celular, o nome do tema fica acima da barra.
3. **Alternar para tabela:** dois botões "Gráfico" e "Tabela" (`aria-pressed`), com 48px de altura. A tabela tem as colunas "Tema", "Matérias" e "% das matérias", com os mesmos temas e valores do gráfico.
4. **Ver todos:** com mais de 10 temas, o botão "Ver todos os {n} temas" mostra a lista completa na visão escolhida, e "Mostrar só os 10 primeiros" volta.
5. **Legenda:** "Fig. 2  Em quantas matérias cada tema aparece, {em todo o período | em {mês por extenso}}. Base: {totalMaterias} matérias; {semTema} sem tema identificado. Uma matéria pode ter mais de um tema." "Fig. 2" em versalete.
6. **Estados:** carregando (esqueleto de barras), erro ("Não foi possível carregar os temas." com "Tentar de novo") e vazio desenhado ("Ainda não há temas identificados sobre {nome}.", contorno tracejado).
7. **Número das figuras:** "Fig. 1" continua no sentimento e "Fig. 2" é a dos temas, nas duas páginas.

## Fora de escopo
- Gráfico de "citações" ou menções: a métrica ainda não foi definida (M01, dependência registrada).
- Temas por sentimento (cruzamento tema × sentimento).
- Cores diferentes por tema: as barras usam só o token `grafico`, porque cor não codifica dado.

## Contrato de dados
`GET /api/analise/por-tema` com a mesma consulta da página (`nrPartido` ou `tituloEleitoral`, mais o período da spec 018) → `{ nome, totalMaterias, semTema, temas[{ tema, total, percentual }] }`. Validado: PSD em todo o período → 423 matérias, 4 sem tema, 943 temas. O hook `useAnalisePorTema` já existe.

## Critérios de aceite
- [ ] As páginas de partido e de político mostram a seção "Temas mais citados" depois de "Sentimento da cobertura".
- [ ] O gráfico mostra no máximo 10 temas, na ordem da API, cada um com nome e número visíveis.
- [ ] A largura de cada barra é proporcional ao total dela dividido pelo maior total exibido.
- [ ] O botão "Tabela" troca para a tabela com os mesmos temas, totais e percentuais do gráfico; `aria-pressed` acompanha a visão ativa.
- [ ] Com mais de 10 temas, "Ver todos os {n} temas" mostra todos, e "Mostrar só os 10 primeiros" volta.
- [ ] A legenda começa com "Fig. 2" e mostra o total de matérias, as sem tema e o período.
- [ ] Sem temas, aparece o estado vazio desenhado com o nome da entidade; com erro, a mensagem e "Tentar de novo".
- [ ] Nenhuma barra usa o espectro nem cor além de `grafico`.
- [ ] Verificação visual em 390px e 1440px, claro e escuro.

## Casos de borda
- Temas com o mesmo total: mantêm a ordem da API.
- Tema com nome muito longo: quebra linha sem empurrar o número para fora da tela.
- `totalMaterias` zero com temas presentes: o percentual aparece como "0,0%".

## Fora do escopo desta versão (futuro)
- Clicar num tema para ver as matérias dele (depende de filtrar `/analise/materias` por tema na página).
- Definir e mostrar a métrica de citações.
