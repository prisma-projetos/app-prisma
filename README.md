# PRISMA — Frontend

> Nome de trabalho do projeto. Ajuste este README se o nome final for diferente.

Frontend do PRISMA, uma plataforma que classifica o viés político de notícias com base no conteúdo do texto — não na reputação da fonte — e apresenta, lado a lado, como diferentes perspectivas do espectro político descrevem, elogiam ou criticam um mesmo político ou partido, sempre com rastreabilidade até os artigos de origem.

Este repositório contém apenas a camada de apresentação (Next.js). A classificação de viés, agregação e síntese acontecem em um pipeline separado, exposto via API.

## Stack

- **Framework**: Next.js
- **Linguagem**: TypeScript
- **Estilos**: _Tailwind CSS_
- **Consumo de dados**: API REST do pipeline de síntese _(ver seção Variáveis de ambiente)_

## Pré-requisitos

- Node.js 20+
- pnpm

## Como rodar localmente

```bash
# instalar dependências
pnpm install

# copiar variáveis de ambiente de exemplo
cp .env.example .env.local

# rodar em modo de desenvolvimento
pnpm run dev
```

A aplicação sobe em `http://localhost:3000`.

## Variáveis de ambiente

| Variável | Descrição | Exemplo |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | URL base da API do pipeline (`/entities/{id}/perspectives`, `/syntheses/{id}/sources`, etc.) | `https://api.prisma.example.com` |
| `NEXT_PUBLIC_APP_ENV` | Ambiente da aplicação | `development` \| `staging` \| `production` |

_(ajustar conforme as variáveis reais do projeto)_

## Scripts disponíveis

```bash
pnpm run dev       # ambiente de desenvolvimento
pnpm run build     # build de produção
pnpm run start     # sobe o build de produção
pnpm run lint      # checagem de lint
```

## Estrutura de pastas

```
.
├── app/                    # rotas e páginas (App Router)
├── components/             # componentes de UI reutilizáveis
├── lib/                    # clientes de API, formatadores, utilitários
├── types/                  # tipos TypeScript compartilhados
│   ├── entity.ts           # Político / Partido
│   ├── bias-category.ts    # categoria da taxonomia de espectro político
│   └── synthesis.ts        # síntese por entidade + categoria de viés
└── public/                 # assets estáticos
```

_(ajustar para refletir a estrutura real assim que o projeto tiver código)_

## Conceitos de domínio usados na interface

Para manter a consistência entre frontend, API e documentação, os termos abaixo devem ser usados sempre com o mesmo significado:

- **Entidade**: um político ou partido político sendo analisado.
- **Categoria de viés**: uma posição dentro da taxonomia de espectro político (versionada — ver `taxonomy_versions` na API).
- **Síntese**: o resumo gerado para uma entidade dentro de uma categoria de viés e um período específico. Deve sempre ser exibida junto com o link para os artigos de origem (`synthesis_sources`).
- **Fato / opinião do autor / inferência do modelo**: os três tipos de trecho que compõem uma síntese. A UI deve deixar essa distinção visível — nunca apresentar uma inferência do modelo com o mesmo peso visual de um fato.

## Diretrizes de UI específicas do domínio

- **Nunca ranquear categorias de viés como certas ou erradas.** A ordem de exibição das categorias deve ser neutra (ex.: alfabética ou pela ordem definida na taxonomia), nunca por "qualidade" da perspectiva.
- **Toda síntese exibida precisa linkar para os artigos de origem.** Não exibir um resumo sem a possibilidade de o usuário verificar a fonte.
- **Disclaimer visível.** Toda tela que exibe classificações de viés ou sínteses deve deixar claro que são geradas por modelos de IA e podem conter erros — ex.: "As classificações de viés são geradas por modelos de IA e podem conter erros. Os resumos representam o que diferentes fontes argumentam, não fatos verificados por esta plataforma."

## Contribuindo
Convenção de commits

Seguimos uma versão simplificada do Conventional Commits:

tipo(escopo opcional): descrição breve no imperativo

Tipos:

Tipo	Quando usar
feat	Nova funcionalidade
fix	Correção de bug
docs	Alteração em documentação (README, comentários)
style	Formatação, espaçamento, ponto e vírgula — sem mudança de lógica
refactor	Mudança de código que não corrige bug nem adiciona funcionalidade
perf	Mudança que melhora performance
test	Adição ou ajuste de testes
chore	Manutenção geral (deps, configs, build) — sem impacto no código de produção

Exemplos:

feat(sintese): adiciona link para artigos de origem no card de síntese
fix(comparacao): corrige ordenação alfabética das categorias de viés
docs: atualiza instruções de setup no README
refactor(api-client): extrai lógica de fetch para hook compartilhado
chore: atualiza dependências do Next.js

Regras rápidas:

- Descrição no imperativo ("adiciona", não "adicionado" ou "adicionando").
- Sem ponto final na descrição.
- Escopo é opcional, mas ajuda a filtrar o histórico em projetos com várias áreas (sintese, comparacao, api-client, etc.).
- Commits grandes demais (mexendo em várias áreas ao mesmo tempo) devem ser quebrados em commits menores sempre que possível.

## Branches e PRs

convenção/task-number

exemplo:
feat/US-01
fix/US-12
chore/US-05

Idealmente utilizamos apenas uma branch por US.

## Licença

_a decidir_