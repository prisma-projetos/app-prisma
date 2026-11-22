# Candidatos por estado com mapa interativo (M02)

## Objetivo
Pedido de Bea (27/09/2026): uma aba "Estados" com o mapa do Brasil. Ao clicar num estado, a pessoa vai para os candidatos daquele estado, divididos por cargo. Depende de a API filtrar por UF, o que ela não fazia; o parâmetro `uf` entra na `api-prisma` junto (decisão de Bea).

## Escopo
1. **Backend** (`api-prisma`, branch própria): `GET /api/politicos` aceita `uf` (duas letras, sem diferenciar maiúsculas), que filtra pela UF da candidatura. O resto do endpoint não muda. Teste cobrindo o filtro.
2. **Proxy do front:** aceita `uf` em `politicos`, validado como duas letras.
3. **Página `/estados`** (link "Estados" no cabeçalho, com `aria-current` nela):
   - `h1` "Candidatos por estado" e a linha "Escolha um estado no mapa ou na lista.";
   - mapa SVG das 27 unidades (malha do IBGE, embutida no código), cada estado um link com nome acessível "{nome} ({UF})", com fios de 1px em tinta e sem cor por estado;
   - **emenda de 27/09/2026 (pedido de Bea):** ao passar o mouse ou focar um estado, o fundo fica em `papel-2` e o contorno ganha o espectro contínuo (3px), redesenhado por cima dos vizinhos para não ficar coberto pela borda deles. É destaque de estado ativo, não dado;
   - ao lado do mapa (abaixo no celular), a lista das 27 unidades em ordem alfabética, cada uma um link: é a alternativa ao mapa para teclado, leitor de tela e toque em estados pequenos (DF, SE, AL);
   - o mapa não é a única forma de escolher.
4. **Candidatos de um estado** (`/candidatos?uf=RO`):
   - `/candidatos` ganha o filtro "Estado" (select com "Todos os estados" e as 27 unidades) e o parâmetro `uf` na URL, combinável com os outros;
   - com `uf` e sem cargo escolhido, a lista vira **dividida por cargo**: uma seção por cargo estadual (Governador, Vice-governador, Senador, 1º suplente, 2º suplente, Deputado federal, Deputado estadual ou distrital), cada uma com a contagem, os 6 primeiros candidatos e o link "Ver os {n} candidatos a {cargo} em {UF}" (`/candidatos?uf=RO&cargo=GOVERNADOR`); cargos sem candidatos não aparecem;
   - com `uf` e cargo, volta a lista paginada normal;
   - a contagem cita o estado ("… com Estado: Rondônia").
5. Candidaturas nacionais (Presidente e Vice, UF "BR") não aparecem no mapa nem nos cargos estaduais.

## Fora de escopo
- UF e partido em cada linha da lista (a listagem da API não traz esses campos).
- Colorir o mapa por volume de candidatos (seria ranking).

## Contrato de dados
- `GET /api/politicos?uf=RO&anoEleicao=2026&cargo=GOVERNADOR&tamanho=6`: o novo `uf` só filtra; a resposta não muda.
- **Só funciona depois de a mudança da `api-prisma` ir para o ar.** Antes disso, a API ignora `uf` e devolveria o país inteiro. Por isso a página `/estados` e o filtro "Estado" ficam desligados até `NEXT_PUBLIC_FILTRO_UF=1` ser definido no build.

## Critérios de aceite
- [x] Backend: `uf=RO` restringe às candidaturas de RO; `uf=ro` também; sem `uf`, nada muda. (Branch `feat/filtro-uf-politicos` da `api-prisma`, commit 210f556, 32 testes passando; ainda não publicada.)
- [x] O proxy repassa `uf` válido e responde 400 para `uf=abc`.
- [x] `/estados` mostra o mapa com 27 estados clicáveis e a lista alfabética; cada link aponta para `/candidatos?uf={UF}`.
- [x] `/candidatos?uf=RO` mostra seções por cargo com contagem, até 6 candidatos e o link "Ver os …"; cargo sem resultado não aparece.
- [x] `/candidatos?uf=RO&cargo=SENADOR` mostra a lista paginada normal com o filtro de estado.
- [x] O select "Estado" grava `?uf=` e se combina com nome, cargo e partido.
- [x] Com o recurso desligado, não há link "Estados" nem filtro "Estado", e `/estados` responde 404.
- [x] Passar o mouse ou focar um estado desenha o contorno dele em espectro, por cima dos vizinhos.
- [x] Verificação visual em 390px e 1440px, claro e escuro, com teclado.

## Ativação (27/09/2026)
A `api-prisma` publicada passou a filtrar por `uf` (conferido: `uf=RO` devolve 432 candidaturas). O `docker/Dockerfile` passou a buildar com `NEXT_PUBLIC_FILTRO_UF=1` por padrão. Para desligar, use `--build-arg NEXT_PUBLIC_FILTRO_UF=0`.
