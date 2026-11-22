# Página de candidatos (M09)

## Objetivo
Hoje só dá para chegar a um candidato pela página do partido dele. A nova página `/candidatos` lista todas as candidaturas da eleição configurada, com busca por nome e filtros de cargo e partido, e recebe o envio da busca da home (spec 015).

## Escopo
1. **Rota `/candidatos`**:
   - `h1` "Candidatos em {ANO_ELEICAO}";
   - linha: "{total} candidaturas registradas na eleição de {ANO_ELEICAO}, em ordem alfabética." O total vem da consulta sem filtros.
2. **Filtros** (rótulos visíveis, campos de 56px de altura e borda de 2px em tinta):
   - **Nome**: campo de texto, espera de 300ms, a partir de 2 caracteres (com 1, o filtro não é aplicado);
   - **Cargo**: select com "Todos os cargos" e a lista fixa de `app/lib/cargos.ts`, na ordem da spec 008;
   - **Partido**: select com "Todos os partidos" e os partidos de `GET /partidos`, em ordem alfabética da sigla, no formato "{sigla} · {nome por extenso}";
   - "Limpar filtros" como link sublinhado, visível só com algum filtro ativo;
   - todos os filtros ficam na URL (`q`, `cargo`, `partido`, `pagina`); abrir a URL restaura os campos; valor inválido de `cargo` ou `partido` é ignorado; mudar qualquer filtro volta para a página 1.
3. **Contagem de resultados**, logo abaixo do fio de 3px: "{n} candidaturas" e, com filtros, "com {filtros}" (ex.: "1.125 candidaturas com Partido: PSD"). Anunciada em `aria-live="polite"`.
4. **Lista de resultados** (48 por página, da API):
   - cada linha: foto de 64px (círculo; sem foto, o ícone de pessoa), nome com `nomeProprio()` como link sublinhado para `/politicos/{tituloEleitoral}` e cargo (rótulo de `cargos.ts`);
   - no desktop, cabeçalho de colunas "Nome" e "Cargo" com fio de 1px; linhas separadas por fio de 1px, hover em `papel-2`;
   - no celular, a mesma linha empilha nome e cargo ao lado da foto, sem rolagem horizontal.
5. **Paginação:** "Anterior", "Página {x} de {y}" e "Próxima", botões com 48px de altura, desabilitados nas pontas e enquanto a página nova carrega. Ao trocar de página, o foco vai para a contagem de resultados.
6. **Estados:** carregando (linhas de esqueleto), erro ("Não foi possível carregar os candidatos." com "Tentar de novo"), vazio ("Nenhuma candidatura encontrada com esses filtros." com "Limpar filtros").
7. **Navegação:**
   - o cabeçalho ganha o link "Candidatos" (`/candidatos`), com `aria-current="page"` em `/candidatos`;
   - a home ganha, abaixo do índice de partidos, o botão secundário "Ver todos os candidatos".

## Fora de escopo
- Estado (UF) na lista e filtro por estado: a listagem da API não traz a UF, e o filtro é a M02 (depende do backend).
- Partido de cada candidato na lista: a listagem não traz o partido. Com o filtro de partido ativo, a contagem já diz qual é.
- Candidaturas de outras eleições (M07).

## Contrato de dados
- `GET /api/politicos?anoEleicao=2026&q=&cargo=&nrPartido=&pagina=&tamanho=48` → página Spring (`content`, `totalElements`, `totalPages`, `number`). Ordem alfabética do nome (validado). `tamanho` acima de 100 é recusado pelo proxy.
- `GET /api/partidos` → `PartidoResponse[]` para o select.
- O parâmetro da URL da página é `partido` (número); na API, vira `nrPartido`.

## Critérios de aceite
- [x] `/candidatos` mostra o `h1` com o ano de `ANO_ELEICAO` e o total da consulta sem filtros.
- [x] A primeira requisição envia `anoEleicao=2026`, `pagina=0` e `tamanho=48`, sem `q`, `cargo` nem `nrPartido`.
- [x] Digitar "maria" no campo Nome envia `q=maria` depois de 300ms, grava `?q=maria` e volta para a página 1; digitar só "m" não envia `q`.
- [x] Escolher um cargo envia `cargo` com o valor da API e grava `?cargo=`; escolher um partido envia `nrPartido` e grava `?partido=`; os filtros se combinam na mesma requisição.
- [x] Abrir `/candidatos?q=maria&cargo=SENADOR&partido=55&pagina=2` restaura os três campos e pede `pagina=1` (a URL conta a partir de 1; a API, de 0).
- [x] `?cargo=INVALIDO` e `?partido=abc` são ignorados.
- [x] A contagem mostra "{n} candidaturas" e, com filtros, os filtros ativos por extenso.
- [x] Cada linha tem a foto, o nome formatado como link para `/politicos/{tituloEleitoral}` e o cargo.
- [x] Anterior fica desabilitado na página 1, e Próxima na última; trocar de página leva o foco para a contagem.
- [x] Vazio mostra a mensagem e "Limpar filtros", que zera os filtros e a URL.
- [x] O cabeçalho mostra "Candidatos" com `aria-current="page"` em `/candidatos`; a home mostra "Ver todos os candidatos" apontando para `/candidatos`.
- [x] Verificação visual em 390px e 1440px, claro e escuro, sem rolagem horizontal.

## Casos de borda
- Partidos ainda carregando: o select mostra só "Todos os partidos" e fica desabilitado até a lista chegar.
- `?pagina=` maior que o total de páginas: mostra o estado vazio com "Voltar para a página 1".
- Candidato sem foto ou com foto quebrada: ícone de pessoa.
- Candidato sem nome: a linha não é exibida.

## Fora do escopo desta versão (futuro)
- Pedido ao backend: incluir UF e partido na listagem de `/politicos`, para mostrar estado e partido em cada linha.
- Filtro por estado com mapa (M02).
