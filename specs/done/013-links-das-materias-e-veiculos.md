# Links das matérias e identificação dos veículos (M05)

## Objetivo
No panorama, os links de fonte mostram só o domínio do portal (ex.: "valor.globo.com") e se repetem, sem dizer que levam a uma matéria. Esta spec deixa claro que cada link abre uma matéria específica e mostra o veículo com link para a página inicial dele.

## Escopo
1. **Links de matéria** (fontes de cada tema e lista de fontes do panorama): o texto passa a ser "Ler matéria publicada por {veículo}", seguido da data ("10/09/2026"). `{veículo}` é `fonte.veiculo`; sem ele, o domínio da URL (`dominio()`); sem os dois, "Ler matéria". O destino continua sendo a URL específica da matéria.
2. **Fontes agrupadas por veículo:** a seção "Fontes ({N})" do panorama, que continua recolhível e fechada por padrão (spec 008), passa a agrupar as matérias por veículo:
   - cabeçalho do grupo: o nome do veículo como link para a página inicial do portal (origem da URL, ex.: `https://valor.globo.com/`), com o complemento "página inicial" em texto;
   - abaixo, as matérias daquele veículo, com o link do item 1, da mais recente para a mais antiga;
   - grupos em ordem alfabética do nome do veículo (ordem neutra, nunca por volume).
   - O contador "Fontes ({N})" continua contando matérias, não veículos.
3. **Links externos:** todos com `target="_blank"`, `rel="noopener noreferrer"`, ícone de seta desenhado (SVG, `aria-hidden`) e o texto "(abre em nova aba)" só para leitor de tela.
4. **Separação visual:** o texto do panorama "Gerado por IA · {modelo}" fica numa caixa `papel-2` separada das fontes, como pede a regra 4 do `CLAUDE.md`.

## Fora de escopo
- Título da matéria como texto do link: o analyser não guarda o título (pendência de backend registrada no plano).
- A lista "Matérias" do partido com `/analise/materias` (entra com o redesenho da página de partido).

## Contrato de dados
`GET /api/analise/panorama` (sem mudança): `eixos[{ eixo, modelo, texto, temas[{ tema, ocorrencias, fontes[] }], fontes[{ itemId, veiculo, url, dataPublicacao }] }]`.

## Critérios de aceite
- [x] Cada link de matéria tem o texto "Ler matéria publicada por {veículo}" e aponta para a URL original da fonte, sem alteração.
- [x] Com `veiculo: null`, o texto usa o domínio da URL; sem URL válida, "Ler matéria".
- [x] Em "Fontes", as matérias aparecem agrupadas por veículo; cada grupo tem o nome do veículo com link para a origem da URL (`https://{host}/`).
- [x] Os grupos seguem a ordem alfabética do nome do veículo e, dentro do grupo, a data mais recente vem primeiro.
- [x] Duas matérias do mesmo portal continuam como dois links distintos, cada um com a sua URL.
- [x] Todos os links externos têm `target="_blank"`, `rel="noopener noreferrer"` e o texto oculto "(abre em nova aba)".
- [x] O contador "Fontes ({N})" é igual ao número de matérias do eixo.
- [x] O bloco "Gerado por IA · {modelo}" continua visível e separado da lista de fontes.

## Casos de borda
- Fonte sem data: o link aparece sem a data.
- Veículo com grafias diferentes para o mesmo domínio: o agrupamento usa o nome exibido (`veiculo` ou domínio), sem tentar unificar.
- URL inválida: a matéria entra no grupo "Outros", sem link de página inicial, com o texto "Ler matéria" sem link.

## Fora do escopo desta versão (futuro)
- Pedido ao backend: guardar e expor o título da matéria, para usá-lo como texto do link.
