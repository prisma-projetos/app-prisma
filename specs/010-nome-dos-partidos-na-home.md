# Nome e sigla dos partidos na home (M10)

## Objetivo
Quem não reconhece os símbolos não consegue achar um partido só pela logo. A home passa a mostrar, para cada partido, uma ficha com logo, sigla, nome por extenso e número, num índice em ordem alfabética.

## Escopo
1. **Título da home:** `h1` "Partidos, de A a Z" e a linha "{N} partidos, em ordem alfabética pela sigla." (N = quantidade recebida da API).
2. **Grade de fichas** (substitui os avatares da home):
   - cada ficha é **um único link** para `/partidos/{numero}`, contendo: logo sobre a placa `placa-logo` (a logo aparece como veio, com `object-fit: contain`), sigla (Título 3), nome por extenso (Apoio, `tinta-2`) e "nº {numero}" (Apoio, `tinta-3`);
   - nome acessível do link: "{sigla}, {nome por extenso}, número {numero}";
   - fios de 1px entre as fichas; hover em `papel-2`; foco da spec 009;
   - a linha cresce até a ficha mais alta: sem altura fixa e sem texto cortado;
   - 2 colunas até 639px, 3 a partir de `sm`, 4 a partir de `md`, 6 a partir de `xl`.
3. **Nome por extenso legível:** a API manda o nome em caixa alta (ex.: "PARTIDO SOCIALISMO E LIBERDADE"). Uma função `nomeProprio()` em `app/lib/formatacao.ts` converte para "Partido Socialismo e Liberdade": primeira letra maiúscula em cada palavra, preposições e artigos (`a`, `à`, `e`, `o`, `da`, `das`, `de`, `do`, `dos`) em minúscula quando não são a primeira palavra, espaços repetidos reduzidos a um.
4. **Sem logo ou logo quebrada:** a placa mostra a sigla em texto; a ficha continua com sigla, nome e número visíveis.
5. **Ordem:** alfabética pela sigla (`localeCompare` pt-BR), como hoje. Nunca por volume de menções.

## Fora de escopo
- Busca na home e o feixe do prisma (M08, Fase 3).
- Saltar para uma letra do índice.
- Corrigir a logo do PSDB (o SVG da API tem letras brancas sobre fundo transparente e some na placa clara): pendência de dados, registrada abaixo.

## Contrato de dados
`GET /api/partidos` (sem mudança): `PartidoResponse` = `{ numero, sigla, nome, descricao, urlLogo }`.

## Critérios de aceite
- [ ] A home mostra o `h1` "Partidos, de A a Z" e a contagem de partidos recebidos.
- [ ] Cada partido aparece como um link com nome acessível "{sigla}, {nome por extenso}, número {numero}" apontando para `/partidos/{numero}`.
- [ ] Sigla, nome por extenso e "nº {numero}" ficam visíveis sem hover.
- [ ] As fichas seguem a ordem alfabética da sigla.
- [ ] Quando `urlLogo` é nulo ou a imagem falha, a sigla aparece na placa e o restante da ficha continua visível.
- [ ] `nomeProprio("PARTIDO SOCIALISTA  DOS TRABALHADORES UNIFICADO")` retorna "Partido Socialista dos Trabalhadores Unificado"; `nomeProprio("REDE SUSTENTABILIDADE")` retorna "Rede Sustentabilidade"; `nomeProprio("DEMOCRACIA CRISTÃ")` retorna "Democracia Cristã"; `nomeProprio(null)` retorna "".
- [ ] Carregando, erro e lista vazia continuam com os estados de hoje ("Nenhum partido encontrado."), no visual da spec 009.
- [ ] Verificação visual em 390px e 1440px, claro e escuro: nenhum "nº" cortado, nenhuma rolagem horizontal.

## Casos de borda
- Nome nulo: a ficha mostra só a sigla e o número; o nome acessível omite a parte do nome.
- Nome muito longo (ex.: "Partido Renovador Trabalhista Brasileiro"): quebra em várias linhas e a linha da grade cresce.
- Sigla nula: a ficha usa o número como identificação ("Partido nº {numero}").

## Fora do escopo desta versão (futuro)
- Pedido de dados: uma versão da logo do PSDB para fundo claro.
- Índice com letras (A, C, D…) como cabeçalhos da grade.
