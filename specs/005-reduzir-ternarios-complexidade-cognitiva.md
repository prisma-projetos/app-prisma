# Reduzir uso de operadores ternários para diminuir complexidade cognitiva

## Objetivo
Ternários encadeados/aninhados e ternários com corpos complexos (JSX, múltiplas condições) são difíceis de ler e revisar, aumentando o risco de bugs em mudanças futuras. Esta spec define regras objetivas para quando um ternário é aceitável e quando deve ser substituído por alternativas mais legíveis (if/else, early return, objeto de mapeamento, componente extraído), reduzindo complexidade cognitiva no código existente e futuro.

## Escopo
- Auditoria de todos os ternários (`?`/`:`) presentes em `app/**` e `lib/**` (ou diretórios equivalentes do projeto).
- Definição de regra de estilo: ternário aninhado (ternário dentro do branch de outro ternário) é proibido — deve virar if/else, early return, `switch`, objeto de lookup, ou componente/função auxiliar extraída.
- Definição de regra de estilo: ternário simples (uma condição, dois resultados curtos, sem aninhamento) continua permitido — não é objetivo eliminar todo ternário, só os que aumentam complexidade cognitiva.
- Refatoração dos ternários aninhados/complexos já identificados no código (ex.: `app/components/entidade-avatar.tsx:36`, que teria três branches condicionais via ternário encadeado).
- Adição de regra de lint (ESLint) que bloqueie ternários aninhados em PRs futuros, se o projeto já usa ESLint (a confirmar configuração existente).

## Fora de escopo
- Reescrever ternários simples que já são legíveis (uma condição, sem aninhamento) só por preferência estética.
- Mudança de comportamento visual ou de dados das telas afetadas — a refatoração deve ser puramente estrutural/interna.
- Introdução de biblioteca externa de utilitários condicionais.

## Contrato de dados
Não aplicável — mudança é interna ao código de apresentação, sem alteração de endpoints, requests ou responses consumidos da API.

## Critérios de aceite
- [ ] Nenhum ternário aninhado (ternário dentro de outro ternário) permanece no código-fonte de `app/**`.
- [ ] `app/components/entidade-avatar.tsx` não possui mais ternário encadeado para decidir entre imagem / avatar circular / avatar quadrado.
- [ ] Regra de ESLint (ex.: `no-nested-ternary`) está ativa na configuração do projeto e falha o lint ao detectar novo ternário aninhado.
- [ ] `pnpm run lint` passa sem warnings/erros relacionados a ternários após a refatoração.
- [ ] `pnpm run build` conclui sem erros após as mudanças (garante que a refatoração não quebrou tipagem/JSX).
- [ ] Nenhuma mudança de comportamento visual: componentes refatorados devem renderizar exatamente os mesmos elementos/classes que antes para os mesmos props (validado manualmente ou via teste existente, se houver).

## Casos de borda
- Ternários dentro de template strings (ex.: `politico.viceNome ? \` · vice: ${politico.viceNome}\` : ""`) — permanecem permitidos por serem simples (uma condição, sem aninhamento).
- Uso de `??` (nullish coalescing) não é ternário e está fora do escopo desta spec.
- Ternários em arquivos gerados automaticamente (ex.: tipos gerados pelo Prisma) estão fora do escopo — não devem ser editados manualmente.

## Fora do escopo desta versão (futuro)
- Métrica automatizada de complexidade cognitiva por arquivo (ex.: integração com `eslint-plugin-sonarjs` para regra `cognitive-complexity` completa, não só ternários).
- Refatoração de outras formas de complexidade (funções longas, condicionais aninhadas com if/else) — pode virar spec própria se necessário.
