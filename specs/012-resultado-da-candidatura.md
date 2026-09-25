# Resultado da candidatura com mensagem clara (M06)

## Objetivo
Na tabela de candidaturas do político, o traço "—" na coluna Resultado não diz se falta informação ou se a eleição ainda não terminou. Como a API não permite distinguir esses casos com segurança, o resultado ausente passa a aparecer como "Não informado", com uma nota explicando.

## Escopo
1. Coluna **Resultado**:
   - `resultado` preenchido: exibido exatamente como veio da API (fiel à fonte e ao turno da linha);
   - `resultado` nulo ou vazio: "Não informado" seguido da chamada de nota "¹".
2. **Nota abaixo da tabela**, só quando pelo menos uma linha tem resultado ausente: "¹ A base de dados ainda não traz o resultado desta candidatura. Quando ele for registrado, aparece aqui."
3. A tabela ganha o visual da spec 009: cabeçalho em Apoio `tinta-2` sem caixa alta, fio de 1px em tinta abaixo do cabeçalho e fios de 1px entre as linhas, rolagem horizontal própria no celular.
4. O cabeçalho "UF" passa a "Estado" (a célula continua mostrando a sigla, ex.: "RO").

## Fora de escopo
- "Eleição em andamento": exige uma fonte confiável que a API ainda não tem.
- Coluna de situação da candidatura (`situacaoCandidatura`): não é resultado e não entra aqui, para não confundir os dois.
- Outras células vazias da tabela continuam com "—".

## Contrato de dados
`GET /api/politicos/detalhe` (sem mudança): `candidaturas[{ anoEleicao, turno, cargo, uf, siglaPartido, nrPartido, numeroUrna, resultado, ... }]`. No backend, `resultado` deriva da situação do turno.

## Critérios de aceite
- [ ] Com `resultado: null`, a célula mostra "Não informado¹" e a nota aparece abaixo da tabela.
- [ ] Com `resultado: ""` (vazio ou só espaços), o comportamento é o mesmo do nulo.
- [ ] Com `resultado: "ELEITO"`, a célula mostra "ELEITO" e, se nenhuma outra linha estiver sem resultado, a nota não aparece.
- [ ] Nenhum valor nulo vira "em andamento" nem qualquer texto além de "Não informado".
- [ ] O cabeçalho da coluna de sigla do estado é "Estado".
- [ ] Com várias candidaturas, cada linha mostra o resultado do seu próprio registro (ordem de hoje: ano e turno decrescentes).

## Casos de borda
- Sem candidaturas: "Nenhuma candidatura registrada." (como hoje), sem nota.
- Todas as linhas sem resultado: uma única nota.

## Fora do escopo desta versão (futuro)
- Pedido ao backend: um campo que diga se a apuração do turno já terminou, para exibir "Eleição em andamento" com segurança.
