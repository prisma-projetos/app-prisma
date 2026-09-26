# Ajustes da revisão da fase 2

## Objetivo
A revisão independente do build das specs 009 a 013 encontrou problemas que ficam fora do escopo aprovado: nomes de pessoas e partidos em caixa alta, a tabela de candidaturas cortada no celular, um campo cinza vazio no panorama e um estado vazio só em texto. Esta spec reúne esses ajustes.

## Escopo
1. **Nomes fora da caixa alta:**
   - `nomeProprio()` passa a valer também para pessoas: o h1 do político, o nome no estado vazio do sentimento e a grade de candidatos do partido;
   - o nome por extenso no topo da página de partido ("Partido Social Democrático" em vez de "PARTIDO SOCIAL DEMOCRÁTICO");
   - `EntidadeAvatar` deixa de forçar maiúsculas no rótulo (`toUpperCase()`);
   - siglas e o nome de urna continuam como vieram da API.
2. **Topo do partido no celular:** "nº {numero}" nunca quebra sozinho em outra linha (`whitespace-nowrap`).
3. **Tamanho do nome do político:** usa os tokens de tipo (`text-titulo-1` no celular e `text-display` a partir de `sm`), igual à página de partido.
4. **Candidaturas no celular (complementa a spec 012):** abaixo de 640px, cada candidatura aparece como uma lista empilhada (`<dl>`: Ano, Cargo, Estado, Partido, Nº de urna, Resultado), sem rolagem horizontal. "Não informado¹" e a nota ficam visíveis juntos. A partir de 640px continua a tabela.
5. **Largura das caixas de texto:** o texto do panorama ("Gerado por IA · {modelo}") fica limitado à medida de leitura (cerca de 760px), sem campo cinza vazio à direita.
6. **Panorama vazio desenhado:** "Ainda não há panorama para esta entidade." vira o mesmo padrão do sentimento vazio, com contorno tracejado e o nome da entidade: "Ainda não há panorama sobre {nome}." e "Quando houver matérias analisadas sobre {nome}, o resumo de cada sentimento aparece aqui."

## Fora de escopo
- Glossário na margem do desktop (entra com o redesenho da página de partido, junto de M01 e M04).
- Transição de deslize do indicador ativo.
- Corrigir acentos e grafias que a API manda sem acento ("Renovacao", "PCDOB"): pedido ao backend.

## Contrato de dados
Nenhum endpoint novo. `nomeProprio()` só formata o que chega de `/politicos/detalhe`, `/politicos`, `/partidos/detalhe` e `/analise/*`.

## Critérios de aceite
- [x] O h1 do político mostra "Adailton Antunes Ferreira" para `nome: "ADAILTON ANTUNES FERREIRA"`; o nome de urna aparece como veio.
- [x] A grade de candidatos do partido mostra os nomes com `nomeProprio()` e sem `toUpperCase()`.
- [x] O topo do partido mostra "Partido Social Democrático · nº 55", e "nº 55" fica numa unidade que não quebra.
- [x] Em 390px, cada candidatura aparece como lista com os seis rótulos e o resultado "Não informado¹" visível, sem rolagem horizontal; em 1440px, a tabela continua.
- [x] A caixa "Gerado por IA" tem largura máxima de leitura.
- [x] Sem panorama, aparece o estado vazio tracejado com o nome da entidade.
- [x] Testes, lint e build passam; verificação visual em 390px e 1440px, claro e escuro.

## Casos de borda
- Nome com partícula ("MARIA DA SILVA", "JOÃO DOS SANTOS"): a partícula fica em minúscula.
- Nome com apóstrofo ou hífen ("SANT'ANNA", "ANA-LUÍSA"): cada parte começa com maiúscula.
- Nome nulo: nada é exibido, como hoje.

## Fora do escopo desta versão (futuro)
- Glossário na margem e ocupação da coluna lateral no desktop.
