# Seletor de janela (mês) nas análises (M04)

## Objetivo
Hoje as análises mostram sempre todo o período, e o panorama mostra o mês mais recente sem dizer isso com clareza. As páginas de partido e de político ganham um seletor de janela (mês) que filtra todas as análises da página e deixa visível qual período cada figura cobre.

## Escopo
1. **Seletor** logo abaixo do cabeçalho da entidade:
   - `<select>` com rótulo visível "Janela (mês das matérias)", 56px de altura, borda de 2px em tinta;
   - opções: "Todo o período" (padrão) e os 12 últimos meses de calendário até o mês atual (fuso de Brasília), do mais recente para o mais antigo, por extenso ("setembro de 2026");
   - a escolha fica na URL como `?janela=AAAA-MM`, preservando os outros parâmetros da página (`q`, `cargo`, `pagina` da lista de candidatos do partido); valor inválido ou fora da lista é ignorado.
2. **O que a janela filtra:**
   - sentimento (spec 011), temas (spec 017) e fontes/veículos recebem `de` = primeiro dia e `ate` = último dia do mês;
   - o panorama recebe `janela=AAAA-MM`;
   - com "Todo o período", nada disso é enviado (comportamento atual).
3. **Período visível em cada figura:**
   - legendas de Fig. 1 e Fig. 2 dizem "em todo o período" ou "em {mês por extenso}";
   - o panorama mostra, ao lado do título, "Janela: {mês por extenso}" e, com "Todo o período", "Janela: {mês} (a mais recente)", usando a `janela` que a API devolve;
   - a linha de contexto do sentimento passa a dizer "Análise automática de {n} parágrafos publicados em {mês}, …" quando há mês.
4. **Vazio por mês:** os estados vazios desenhados citam o mês, por exemplo "Ainda não há parágrafos analisados sobre {nome} em setembro de 2026."
5. **Troca de mês:** a página não volta ao topo; as seções mostram o carregamento no lugar, sem piscar o restante.

## Fora de escopo
- Listar só os meses com dados: a API não tem esse endpoint (pedido ao backend, já no plano).
- Agregação anual e intervalos personalizados (de/até livres).
- A lista de candidatos do partido não é filtrada pela janela.

## Contrato de dados
- `de` e `ate` (`AAAA-MM-DD`) filtram `/analise/sentimento`, `/analise/por-tema`, `/analise/por-midia` e `/analise/materias` (validado com o PSD: julho → 25 matérias e 271 parágrafos; agosto → 105 e 2.491; setembro → 59 e 7.079).
- `janela` (`AAAA-MM`) filtra só `/analise/panorama`. Nas outras análises ela é ignorada pela API (validado: o total do sentimento não muda com `janela`). Sem `janela`, o panorama vem do mês mais recente (hoje, agosto de 2026).
- O proxy já aceita `de`, `ate` e `janela` nesses caminhos.

## Critérios de aceite
- [ ] O seletor aparece nas páginas de partido e de político com "Todo o período" e os 12 últimos meses, do mais recente para o mais antigo.
- [ ] Escolher "agosto de 2026" grava `?janela=2026-08` sem apagar `q`, `cargo` e `pagina` existentes.
- [ ] Com `?janela=2026-08`, sentimento e temas são pedidos com `de=2026-08-01&ate=2026-08-31`, e o panorama com `janela=2026-08`.
- [ ] Fevereiro usa o último dia correto (`2026-02-28`); meses de 30 e 31 dias também.
- [ ] Sem `janela`, nenhuma análise recebe `de`, `ate` ou `janela`.
- [ ] `?janela=2026-13` e `?janela=abc` são ignorados (tratados como "Todo o período").
- [ ] As legendas das figuras e a linha de contexto dizem o mês escolhido ou "em todo o período".
- [ ] O panorama mostra "Janela: {mês}" e, sem mês escolhido, "(a mais recente)".
- [ ] Os estados vazios citam o mês quando há um escolhido.
- [ ] Verificação visual em 390px e 1440px, claro e escuro.

## Casos de borda
- Mês atual ainda em andamento: os números cobrem só os dias já publicados; nada muda na interface.
- Panorama sem eixos no mês (ex.: setembro de 2026 para o PSD): estado vazio do panorama com o mês.
- Mudança de ano: "janeiro de 2026" aparece depois de "fevereiro de 2026" e antes de "dezembro de 2025".

## Fora do escopo desta versão (futuro)
- Pedido ao backend: endpoint com os meses que têm dados para uma entidade, para o seletor só oferecer meses com análise.
- Comparar dois meses lado a lado.
