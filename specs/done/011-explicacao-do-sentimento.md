# Explicação acessível do sentimento (M03)

## Objetivo
Hoje o bloco de sentimento mostra "método lexicon-baseline-v1 (versão v1)" e não explica como ler os números. Esta spec troca o identificador técnico por uma explicação simples e verdadeira do método, em "Saiba mais", e apresenta o resultado como uma figura com legenda.

## Escopo
1. **Rótulos:** os termos do glossário continuam como rótulo principal, com a explicação simples ao lado: "Negativo (critica)", "Neutro (só informa)", "Positivo (elogia)". Ordem fixa Negativo, Neutro, Positivo.
2. **Figura com legenda** (`<figure>`):
   - barra de sentimento (spec 009) com `role="img"` e `aria-label` "Negativo {p}%, Neutro {p}%, Positivo {p}%";
   - legenda em tabela: cor, rótulo com explicação, "{n} parágrafos" e percentual, com algarismos tabulares;
   - `figcaption`: "Fig. 1  Parágrafos sobre {nome} por sentimento, {em todo o período | em {janela por extenso}}. Base: {total} parágrafos de matérias que citam {nome}." `{nome}` vem de `resumo.nome`; sem nome, "esta entidade". "Fig. 1" em versalete.
3. **Linha de contexto** acima da figura: "Análise automática de {total} parágrafos, baseada em palavras positivas e negativas. O resultado pode conter erros."
4. **"Saiba mais: como esta análise funciona"** (`<details>`, fechado por padrão, fundo `papel-2` com fio lateral de 1px em tinta):
   - "O sistema compara a quantidade de palavras positivas e negativas em cada parágrafo que cita o partido ou o candidato. Quando as contagens empatam, ou quando nenhuma palavra da lista aparece, o parágrafo conta como neutro."
   - "A classificação vale para o parágrafo inteiro. Se um parágrafo cita mais de um partido ou candidato, todos recebem a mesma classificação."
   - "Positivo não quer dizer que o partido ou o candidato é bom, e negativo não quer dizer que é ruim. Isso também não mede opinião pública nem imparcialidade da imprensa: mostra só o tom das palavras no texto."
   - "O método é experimental: a lista de palavras não foi validada cientificamente e pode errar com ironia, negação ou citações."
   - "Detalhes técnicos: método {metodo}, versão {pipelineVersion}." (uma linha por proveniência; é aqui que método e versão continuam consultáveis).
5. **Estado vazio desenhado:** sem parágrafos, a figura aparece em contorno tracejado com "Ainda não há parágrafos analisados sobre {nome}." e "Quando o PRISMA encontrar e analisar matérias que citam {nome}, o sentimento da cobertura aparece aqui."

## Fora de escopo
- Mudar o texto obrigatório do aviso de IA (decisão pendente com Bea; ele continua exato).
- Seletor de janela (M04, Fase 4). Nesta spec a legenda diz "em todo o período" porque a consulta não envia `janela`.
- Retícula para os sentimentos.

## Contrato de dados
`GET /api/analise/sentimento` (sem mudança): `{ nome, totalParagrafos, periodoInicio, periodoFim, porSentimento[{ sentimento, total, percentual }], proveniencia[{ metodo, pipelineVersion, total }] }`.

Base do texto do método: `classifier-prisma/README.md` e `config/lexicon.yaml` (baseline v1, contagem de termos positivos e negativos por parágrafo com entidade).

## Critérios de aceite
- [x] A tela, com "Saiba mais" fechado, não mostra "lexicon", "baseline" nem o código da versão.
- [x] Os rótulos aparecem como "Negativo (critica)", "Neutro (só informa)" e "Positivo (elogia)", nessa ordem.
- [x] A linha de contexto mostra o total de parágrafos da resposta, formatado em pt-BR.
- [x] A `figcaption` começa com "Fig. 1", cita o nome da entidade da resposta e o total de parágrafos; sem `nome`, usa "esta entidade".
- [x] A barra tem `role="img"` e `aria-label` com os três percentuais na ordem fixa.
- [x] "Saiba mais" começa fechado; aberto, mostra os textos do escopo, incluindo que a classificação é compartilhada entre entidades do mesmo parágrafo e que não mede opinião pública.
- [x] Método e versão de cada proveniência aparecem dentro de "Saiba mais".
- [x] Sem parágrafos, aparece o estado vazio desenhado com o nome da entidade.
- [x] Nenhum texto do bloco de sentimento diz que o sentimento é feito por "IA" ou "modelo" (só o aviso obrigatório, que não muda).

## Casos de borda
- `porSentimento` sem algum sentimento: a linha aparece com 0 parágrafos e 0,0%.
- `proveniencia` vazia: "Detalhes técnicos" diz "método não informado".
- Percentuais que somam 99,9% ou 100,1% por arredondamento: exibidos como vieram da API.

## Fora do escopo desta versão (futuro)
- Anotação direta na figura ("9 em cada 10") e frase-resumo gerada a partir dos números.
- Página "Como funciona" completa.
