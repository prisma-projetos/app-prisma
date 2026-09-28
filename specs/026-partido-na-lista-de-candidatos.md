# Partido na lista de candidatos

## Objetivo
Em `/candidatos`, cada linha mostra só foto, nome e cargo. Quem percorre a lista não sabe de que partido é cada candidato sem abrir a página dele. A lista passa a mostrar o partido de cada linha, na lista paginada e na lista dividida por cargo (com filtro de estado, spec 023).

## Escopo
1. **Backend** (`api-prisma`, branch própria): cada item de `GET /api/politicos` (`CandidatoResumoResponse`) ganha `nrPartido` e `siglaPartido` da candidatura da eleição consultada. Filtros, ordem e paginação não mudam. Teste cobrindo os campos novos.
2. **Tipos do front:** `CandidatoResumoResponse` ganha `nrPartido?: number` e `siglaPartido?: string`. O snapshot `test/fixtures/openapi-v1.json` ganha os dois campos, antecipando o contrato; quando a API publicar a mudança, atualizar o snapshot com o OpenAPI real.
3. **`LinhaCandidato`** (componente compartilhado, `app/components/linha-candidato.tsx`):
   - nova coluna **Partido**, entre Nome e Cargo, com a sigla do partido como link sublinhado para `/partidos/{nrPartido}`;
   - o link do nome continua cobrindo a linha inteira; o link do partido fica por cima dele (clicar na sigla vai para o partido, clicar no resto da linha vai para o candidato);
   - `CabecalhoLista` ganha o rótulo "Partido" na mesma coluna;
   - no celular, a linha empilha ao lado da foto: nome, e abaixo "{sigla} · {cargo}" (ou só a sigla quando o cargo está oculto), sem rolagem horizontal.
4. **Lista paginada** (`/candidatos`, com ou sem filtros): mostra a coluna Partido.
5. **Lista dividida por cargo** (`/candidatos?uf=RO`, sem cargo): as linhas de cada seção mostram o partido. Como o cargo já está no título da seção e a coluna Cargo é omitida, a linha fica foto, nome e partido. As seções ganham o cabeçalho de colunas "Nome / Partido" no desktop, para que a coluna não fique sem rótulo.
6. **Lista de candidatos do partido** (`/partidos/{nrPartido}`, que usa a mesma `LinhaCandidato`, spec 024): **não** mostra a coluna Partido, já que todos são do mesmo partido. `LinhaCandidato` ganha a prop `mostrarPartido` com padrão `false`: quem quer a coluna liga explicitamente, então a lista do partido não muda.

## Fora de escopo
- Filtrar ou ordenar pela coluna Partido (o filtro de partido já existe no select).
- Logo do partido na linha.
- Mostrar a UF na linha.
- Federação ou coligação.

## Contrato de dados
- `GET /api/politicos?anoEleicao=2026&…` → `content[]` passa a ser `{ tituloEleitoral, nome, cargo, urlFoto, nrPartido, siglaPartido }`. **A confirmar com o backend:** hoje a API publicada devolve só `tituloEleitoral`, `nome`, `cargo` e `urlFoto` (conferido em 28/09/2026 com `uf=RO&cargo=SENADOR`).
- Os campos vêm da candidatura do `anoEleicao` consultado, e não da filiação atual.
- O proxy não muda: a mudança é só na resposta.
- **Antes de a mudança da `api-prisma` ir para o ar**, os campos não vêm. O front deve continuar funcionando sem eles (ver casos de borda), então não precisa de flag de build.

## Critérios de aceite
- [ ] Backend: cada item de `GET /api/politicos?anoEleicao=2026` traz `nrPartido` e `siglaPartido` da candidatura de 2026; filtros `q`, `cargo`, `nrPartido` e `uf` continuam funcionando.
- [x] Na lista paginada de `/candidatos`, cada linha mostra a sigla do partido como link para `/partidos/{nrPartido}`, e o cabeçalho mostra "Nome / Partido / Cargo".
- [x] Em `/candidatos?uf=RO`, as linhas das seções por cargo mostram a sigla do partido como link, sem a coluna Cargo, com cabeçalho "Nome / Partido".
- [x] Em `/candidatos?uf=RO&cargo=SENADOR`, a lista paginada mostra a coluna Partido.
- [x] Clicar na sigla navega para o partido; o nome continua sendo o link para `/politicos/{tituloEleitoral}` e cobre o resto da linha.
- [x] Na lista de candidatos de `/partidos/{nrPartido}`, a coluna Partido não aparece.
- [x] Se nenhum item da página traz `siglaPartido` (API ainda sem a mudança), a coluna Partido e o rótulo no cabeçalho não aparecem, e a lista fica como hoje.
- [x] Se um item traz `siglaPartido` sem `nrPartido`, a sigla aparece como texto, sem link.
- [x] Se um item não traz `siglaPartido` mas outros itens da mesma página trazem, a célula mostra "—" (com rótulo acessível "Partido não informado").
- [x] Carregando, erro e vazio continuam como nas specs 016 e 023.
- [ ] Verificação visual em 390px e 1440px, claro e escuro, sem rolagem horizontal.

## Estado (28/09/2026)
Front implementado na branch `feat/partido-na-lista` e coberto por testes (`linha-candidato.test.tsx`, `candidatos.test.tsx`, `partido.test.tsx`). Faltam a mudança da `api-prisma` e a verificação visual com dados reais. A spec só vai para `done/` depois disso.

## Casos de borda
- API sem os campos novos (antes do deploy do backend): a lista fica igual à de hoje, sem coluna vazia.
- Item sem partido no meio de itens com partido: "—".
- `siglaPartido` sem `nrPartido`: texto sem link.
- Sigla longa (ex.: "PC do B", "SOLIDARIEDADE"): a coluna quebra linha em vez de empurrar o cargo para fora da tela.
- Com o filtro de partido ativo, todas as linhas mostram a mesma sigla. Aceitável e coerente com o resto da lista, então a coluna não é escondida.

## Fora do escopo desta versão (futuro)
- Esconder a coluna Partido quando o filtro de partido está ativo.
- Mostrar a UF em cada linha quando não há filtro de estado.
- Logo do partido ao lado da sigla.
