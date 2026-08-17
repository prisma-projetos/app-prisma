<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CLAUDE.md

Este arquivo orienta o Claude Code ao trabalhar neste repositório. Leia antes de implementar qualquer funcionalidade.

## O projeto

Frontend Next.js do **PRISMA** (nome de trabalho) — uma plataforma que classifica o viés político de notícias com base no conteúdo do texto (nunca na reputação da fonte) e apresenta, lado a lado, como diferentes perspectivas do espectro político descrevem, elogiam ou criticam um mesmo político ou partido, com rastreabilidade completa até os artigos de origem.

Este repositório é **apenas a camada de apresentação**. Classificação de viés, agregação e síntese acontecem em um pipeline separado, consumido via API REST (`NEXT_PUBLIC_API_BASE_URL`).

- **Stack**: Next.js, TypeScript
- **Estilos**: _Tailwind CSS_
- Contexto completo do produto/backend: ver `contexto-projeto-prisma.md` na raiz do projeto, se presente.

## Workflow: Spec-Driven Development (SDD)

Este projeto segue SDD. **Nenhuma funcionalidade é implementada sem uma spec aprovada primeiro.** O código deve ser uma consequência da spec, não o contrário.

### Fluxo obrigatório

1. **Spec primeiro.** Antes de escrever qualquer código para uma funcionalidade nova, crie ou atualize um arquivo em `specs/` seguindo o template abaixo. Não pule esta etapa mesmo para mudanças que pareçam pequenas na superfície — se afeta comportamento visível ou contrato de dados, tem spec.
2. **Pare para revisão.** Depois de escrever a spec, pare e apresente-a para o usuário antes de implementar. Não implemente e escreva a spec na mesma resposta.
3. **Implemente only o que está na spec.** Se durante a implementação você perceber que precisa de algo fora do escopo descrito (um novo endpoint, um novo estado, um comportamento não coberto), pare e atualize a spec primeiro — não decida silenciosamente por conta própria.
4. **Derive os testes da seção de critérios de aceite.** Cada critério de aceite vira pelo menos um teste. Se um critério não é testável como escrito, isso é sinal de que a spec precisa ser mais específica — sinalize isso em vez de escrever um teste vago.
5. **Marque a spec como implementada** (mover para `specs/done/` ou atualizar o status no front-matter, conforme convenção do projeto) só depois que os testes derivados dela passarem.

### Onde ficam as specs

```
specs/
├── template.md          # template abaixo, copiado para cada spec nova
├── 001-nome-da-feature.md
├── 002-outra-feature.md
└── done/                 # specs já implementadas e validadas
```

Nomeie specs com prefixo numérico sequencial + slug curto (`003-comparacao-lado-a-lado.md`), para manter ordem cronológica e referência fácil em commits/PRs.

### Template de spec

```markdown
# [Nome da funcionalidade]

## Objetivo
O que esta funcionalidade resolve e por quê. 1-3 frases.

## Escopo
O que está incluído nesta spec.

## Fora de escopo
O que explicitamente NÃO está incluído (evita scope creep e leituras erradas depois).

## Contrato de dados
Quais endpoints da API são consumidos, formato de request/response esperado.
Se o endpoint ainda não existe, marcar como "a confirmar com o backend".

## Critérios de aceite
- [ ] Critério testável 1
- [ ] Critério testável 2
- [ ] Comportamento de erro/estado vazio/loading coberto

## Casos de borda
Estados vazios, erros de API, dados ausentes ou malformados, etc.

## Fora do escopo desta versão (futuro)
Ideias relacionadas que ficam para depois, para não se perderem mas também não inflarem esta spec.
```

## Conceitos de domínio (usar exatamente estes termos)

- **Entidade** — um político ou partido político sendo analisado.
- **Categoria de viés** — uma posição dentro da taxonomia de espectro político (versionada — ver `taxonomy_versions` na API).
- **Síntese** — o resumo gerado para uma entidade dentro de uma categoria de viés e um período específico. Sempre exibida com link para os artigos de origem.
- **Fato / opinião do autor / inferência do modelo** — os três tipos de trecho que compõem uma síntese. A UI deve deixar essa distinção visível.

Não introduza sinônimos ou traduções alternativas desses termos em specs, código ou copy — a consistência entre API, frontend e documentação é um requisito do produto, não só estilo.

## Regras de UI que toda spec/implementação deve respeitar

Estas regras são requisitos de produto, não sugestões — qualquer spec que as viole deve ser corrigida antes da implementação:

1. **Nunca ranquear categorias de viés como certas ou erradas.** Ordem de exibição sempre neutra (alfabética ou pela ordem definida na taxonomia).
2. **Toda síntese exibida precisa linkar para os artigos de origem.** Nenhum resumo deve ser mostrado sem rastreabilidade até a fonte.
3. **Disclaimer obrigatório** em qualquer tela que mostre classificações de viés ou sínteses:
   > "As classificações de viés são geradas por modelos de IA e podem conter erros. Os resumos representam o que diferentes fontes argumentam, não fatos verificados por esta plataforma."
4. **Fato/opinião/inferência sempre visualmente diferenciados** — nunca com o mesmo peso visual.

## Convenção de commits

Conventional Commits simplificado:

```
tipo(escopo opcional): descrição breve no imperativo
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`. Referencie o número da spec quando aplicável, ex.: `feat(comparacao): implementa spec 003 — comparação lado a lado`.

## Comandos

```bash
pnpm run dev       # ambiente de desenvolvimento
pnpm run build     # build de produção
pnpm run lint      # lint
pnpm run test      # testes
```

_(ajustar conforme scripts reais do `package.json`)_

## Checklist antes de abrir um PR

- [ ] Existe uma spec em `specs/` cobrindo esta mudança
- [ ] Todos os critérios de aceite da spec têm teste correspondente
- [ ] Nenhuma das regras de UI da seção acima foi violada
- [ ] Glossário de domínio usado corretamente (sem sinônimos)
- [ ] Spec movida para `specs/done/` (ou status atualizado) após testes passarem