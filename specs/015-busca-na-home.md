# Busca de partidos e candidatos na home (M08)

## Objetivo
Hoje a home só lista partidos, e quem procura um candidato não tem por onde começar. A home passa a abrir com a pergunta "Sobre quem você quer saber?" e um campo de busca que sugere partidos e candidatos enquanto a pessoa digita, seguido da figura do feixe de luz passando pelo prisma, que é a marca da direção "Livro de Ciências".

## Escopo
1. **Abertura da home** (acima do índice A–Z da spec 010):
   - `h1` "Sobre quem você quer saber?" (Display no desktop, Título 1 no celular). O "Partidos, de A a Z" vira `h2`;
   - linha de apoio: "O PRISMA reúne o que a imprensa publica sobre partidos e candidatos e mostra o sentimento de cada parágrafo: se critica, se só informa ou se elogia. Toda informação leva à matéria original.";
   - rótulo visível "Nome do partido ou do candidato", campo de busca com 64px de altura e borda de 2px em tinta, e botão "Buscar" (tinta com texto papel). No celular, o botão fica abaixo do campo, na largura toda;
   - abaixo do campo: "Exemplos: PSD, Partido Verde, Maria da Silva. Para candidatos, use o nome completo, não o nome de urna."
2. **Sugestões enquanto digita** (a partir de 2 caracteres, com espera de 300ms após a última tecla):
   - padrão combobox acessível: campo com `role="combobox"`, painel com `role="listbox"`, `aria-expanded`, `aria-activedescendant` e grupos com rótulo;
   - grupo **Partidos**: até 5 resultados de `GET /partidos?q=`, cada um com a sigla (Corpo forte) e "{nome por extenso} · nº {numero}" (Apoio). Ordem da API;
   - grupo **Candidatos**: até 5 resultados de `GET /politicos?q=&anoEleicao={ANO_ELEICAO}&tamanho=5`, cada um com o nome (`nomeProprio`) e o cargo (rótulo de `app/lib/cargos.ts`). Com mais de 5 resultados, o último item do grupo é o link "Ver os {total} candidatos com "{termo}"", que leva a `/candidatos?q={termo}` (spec 016);
   - grupo sem resultado mostra uma frase de orientação: "Nenhum partido com "{termo}"." ou "Nenhum candidato com "{termo}" no nome. Tente o nome completo da pessoa.";
   - itens com 48px de altura mínima; o item ativo fica com fundo `papel-2`;
   - teclado: seta para baixo/cima percorre os itens dos dois grupos; Enter abre o item ativo; Esc fecha o painel e mantém o texto; Tab sai do campo e fecha o painel;
   - região `aria-live="polite"` anuncia "{p} partidos e {c} candidatos encontrados" quando a busca termina.
3. **Enviar a busca** (Enter sem item ativo ou botão "Buscar"):
   - se o termo for igual à sigla de um partido (sem diferenciar maiúsculas), abre `/partidos/{numero}`;
   - senão, abre `/candidatos?q={termo}` (spec 016);
   - termo vazio ou com menos de 2 caracteres: não navega e mostra, abaixo do campo, "Digite pelo menos 2 letras."
4. **Estados do painel:** carregando ("Buscando…"), erro ("Não foi possível buscar agora. Tente de novo em alguns segundos.", sem esconder o outro grupo, se ele tiver carregado) e sem resultados nos dois grupos.
5. **Figura do feixe (Fig. 1)** abaixo da busca: feixe em tinta entrando pela esquerda, prisma em contorno e o leque do espectro em gradiente contínuo saindo à direita até a borda da página, em SVG responsivo. Legenda: "Fig. 1  A luz branca atravessa o prisma e se separa em cores. O PRISMA faz o mesmo com a cobertura da imprensa: separa o que foi publicado pelo sentimento de cada parágrafo." A figura é decorativa para leitor de tela (`aria-hidden` no SVG); a legenda é texto normal.
6. **Movimento, um só momento:** ao carregar a home, o leque do espectro se abre uma vez (cerca de 600ms, ease-out). Com `prefers-reduced-motion: reduce`, a figura já aparece aberta.

## Fora de escopo
- Busca por nome de urna (a API não pesquisa esse campo; pedido ao backend).
- Página de resultados que misture partidos e candidatos: o envio leva ao partido (sigla exata) ou a `/candidatos`.
- Histórico de buscas e busca por estado (M02).

## Contrato de dados
- `GET /api/partidos?q=` → `PartidoResponse[]`. Pesquisa em sigla e nome (validado: `q=social` → PSB, PSD, PSDB, PSOL, PSTU).
- `GET /api/politicos?q=&anoEleicao=2026&tamanho=5` → página com `content[{ tituloEleitoral, nome, cargo, urlFoto }]` e `totalElements`. Pesquisa só no nome completo, sem diferenciar maiúsculas (validado: `q=maria` → 977; `q=furia` → 0, embora exista o nome de urna "ADAILTON FURIA").
- Nenhum endpoint novo. Os hooks `usePartidos({ q })` e `usePoliticos({ q, anoEleicao, tamanho })` já existem.

## Critérios de aceite
- [ ] A home mostra o `h1` "Sobre quem você quer saber?", a linha de apoio, o campo com rótulo visível e o botão "Buscar"; "Partidos, de A a Z" passa a ser `h2`.
- [ ] Com 1 caractere, nenhuma requisição de busca é feita; com 2 ou mais, uma requisição para `partidos` e uma para `politicos` com `q`, `anoEleicao=2026` e `tamanho=5`, depois de 300ms sem digitar.
- [ ] O painel mostra os grupos "Partidos" e "Candidatos", com no máximo 5 itens cada, nos formatos do escopo.
- [ ] Com `totalElements` maior que 5, aparece o link "Ver os {total} candidatos com "{termo}"" para `/candidatos?q={termo}`.
- [ ] Grupo vazio mostra a frase de orientação correspondente.
- [ ] Setas percorrem os itens (atualizando `aria-activedescendant`), Enter abre o item ativo e Esc fecha o painel sem apagar o texto.
- [ ] Enviar "psd" abre `/partidos/55`; enviar "maria" abre `/candidatos?q=maria`; enviar "a" mostra "Digite pelo menos 2 letras." e não navega.
- [ ] Erro na busca de um grupo mostra a mensagem de erro nesse grupo e mantém o outro.
- [ ] A região `aria-live` anuncia as quantidades encontradas.
- [ ] A Fig. 1 aparece com a legenda; com `prefers-reduced-motion`, sem animação.
- [ ] Verificação visual em 390px e 1440px, claro e escuro, com o painel aberto; foco visível em campo, botão e itens.

## Casos de borda
- Termo com espaços nas pontas: é aparado antes da busca e do envio.
- Termo com acento ou sem acento: é enviado como digitado; a API decide a correspondência.
- Digitar rápido: só o último termo gera requisição (espera de 300ms), e respostas antigas não sobrescrevem as novas (a query key inclui o termo).
- Candidato sem cargo: o item mostra só o nome.

## Fora do escopo desta versão (futuro)
- Pedido ao backend: pesquisar também no nome de urna e no nome social.
- Destacar no item o trecho que casou com o termo.
