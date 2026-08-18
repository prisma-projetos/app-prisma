# Reduzir uso de operadores ternários para diminuir complexidade cognitiva

## Objetivo
Ternários — especialmente aninhados ou usados só para renderizar algo vs. nada — são difíceis de ler e revisar, aumentando o risco de bugs em mudanças futuras. Esta spec define quando substituir um ternário por `&&` (curto-circuito) e quando um ternário continua sendo a melhor opção, reduzindo complexidade cognitiva no código existente e futuro.

## Escopo
- Auditoria de todos os ternários (`?`/`:`) em `app/**`.
- **Regra principal**: todo ternário cujo branch falso é "nada" (`null`, `undefined` ou string vazia usada apenas como placeholder em JSX) deve virar `condicao && <jsx/>` (ou `condicao && valor`).
  - Exemplo: `politico.viceRef ? (<>...</>) : null` → `politico.viceRef && (<>...</>)`.
  - Exemplo: `politico.viceNome ? \` · vice: ${politico.viceNome}\` : ""` → `politico.viceNome && \` · vice: ${politico.viceNome}\``.
- **Ternários com dois resultados reais (nenhum branch é "nada") permanecem ternários** — `&&` não se aplica de forma segura a esse caso (não dá para expressar "senão" com um único `&&` sem duplicar a condição negada, o que é mais confuso, não menos). Exemplos que continuam ternário: `circular ? "rounded-full" : "rounded-2xl"`, `tema === "dark" ? <SolIcon/> : <LuaIcon/>`.
- Ternário aninhado continua proibido nos casos de dois-resultados-reais restantes: deve virar if/else, early return ou componente extraído (já resolvido em `entidade-avatar.tsx` na iteração anterior desta spec — mantém-se).
- Regra de lint `no-nested-ternary` (já adicionada em `eslint.config.mjs`) permanece ativa.

## Fora de escopo
- Converter ternários de dois-resultados-reais em `&&` duplicado com condição negada (`cond && <A/>}{!cond && <B/>`) — considerado mais arriscado (bugs com valores falsy) e menos legível que o ternário simples, portanto não é o padrão adotado.
- Mudança de comportamento visual ou de dados das telas afetadas.
- Introdução de biblioteca externa de utilitários condicionais.

## Contrato de dados
Não aplicável — mudança interna ao código de apresentação.

## Critérios de aceite
- [ ] Todo ternário JSX com branch falso `null`/vazio foi convertido para `&&` (ex.: bloco do `vice` em `app/partidos/[slug]/politicos/[politicoSlug]/page.tsx`).
- [ ] Ternários com dois resultados reais permanecem como ternários simples (não aninhados) — não são forçados para `&&`.
- [ ] Nenhum ternário aninhado permanece no código.
- [ ] `pnpm run lint` passa sem erros.
- [ ] `pnpm run build` conclui sem erros.
- [ ] Nenhuma mudança de comportamento visual/textual para os mesmos props/estado.

## Casos de borda
- `condicao && string` em JSX: se `condicao` for um número `0` ou string vazia, React renderiza o valor falsy como texto/nada perceptível — checar caso a caso se a condição usada é sempre booleana ou string (não numérica) antes de converter, para evitar o bug clássico de `0 &&` renderizar "0".
- `??` (nullish coalescing) não é ternário e está fora do escopo desta spec.
- Ternários em arquivos gerados automaticamente (ex.: tipos do Prisma) não são tocados.

## Fora do escopo desta versão (futuro)
- Regra de lint automatizada para forçar `&&` em vez de `? : null` (ex.: `unicorn/no-lonely-if` ou regra customizada) — avaliar se compensa o custo de configuração.
- Métrica de complexidade cognitiva mais ampla (`eslint-plugin-sonarjs`).
