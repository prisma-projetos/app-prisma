# Fundação visual "Livro de Ciências"

## Objetivo
Aplicar o sistema de `DESIGN.md` (direção "Livro de Ciências", aprovada por Bea em 25/09/2026) como base comum a todas as telas: tokens de cor claro/escuro sem preto nem branco puros, fonte Atkinson Hyperlegible Next, cabeçalho, rodapé com o aviso de IA e foco de teclado único. As specs 010 a 013 constroem sobre esta base.

## Escopo
1. **Tokens de cor** em `app/globals.css`, com os valores exatos de `DESIGN.md` (claro em `:root`, escuro em `[data-theme="dark"]`): `papel`, `papel-2`, `tinta`, `tinta-2`, `tinta-3`, `fio`, `placa-logo`, `sent-negativo`, `sent-neutro`, `sent-positivo`, `grafico`. Expostos ao Tailwind via `@theme` (`bg-papel`, `text-tinta-2`, `border-fio` etc.). O gradiente do espectro vira a variável `--espectro`.
2. **Fonte:** Atkinson Hyperlegible Next via `next/font/google` (eixo variável, subsets `latin` e `latin-ext`), substituindo Geist. Corpo em 18px/28px, `font-feature-settings: "tnum"` no `body`. Escala tipográfica de `DESIGN.md` como utilitários (`text-display`, `text-titulo-1`, `text-titulo-2`, `text-titulo-3`, `text-corpo-grande`, `text-corpo`, `text-apoio`, `text-legenda`).
3. **Cabeçalho** em todas as páginas (no `layout.tsx`), substituindo o botão de tema flutuante:
   - marca: o prisma em SVG (feixe, triângulo e leque com o espectro) + "PRISMA", com link para `/` e nome acessível "PRISMA, página inicial";
   - navegação com "Partidos" (`/`), marcado com `aria-current="page"` na home e nas páginas de partido; o indicador ativo é o fio de 4px em espectro **junto** com peso bold;
   - botão de tema como pílula com texto visível: "Modo escuro" no claro e "Modo claro" no escuro. A lógica e a chave `prisma-theme` da spec 002 não mudam.
   - fio de 1px abaixo do cabeçalho.
4. **Rodapé** em todas as páginas: fio de 1px acima, o texto exato de `TEXTO_DISCLAIMER` e a marca.
5. **Aviso de IA dentro da página** (`Disclaimer`): texto igual; visual troca a caixa âmbar por borda de 1px em tinta com um ícone "i" desenhado. Continua em toda tela com sentimento ou panorama.
6. **Foco de teclado único** para links, botões, `summary`, campos e abas: anel interno de 2px em tinta e contorno de 3px em espectro, com offset, aplicado em `:focus-visible`. Nada de `outline: none` sem substituto.
7. **Superfícies do navegador:** cor da seleção de texto, `caret-color`, `accent-color` e `text-underline-offset` tirados dos tokens.
8. **`Pagina`:** fundo `papel`, margens laterais de 20px no celular e 96px a partir de `lg`, largura máxima de 1248px; cada seção da página abre com um fio de 3px em tinta (componente `Secao`, com `h2` e `aria-labelledby`).
9. **Cores de sentimento** (`app/lib/sentimento.ts`): `SENTIMENTO_COR` passa a usar `bg-sent-negativo`, `bg-sent-neutro` e `bg-sent-positivo`. A barra de sentimento ganha contorno de 1px em tinta e cantos retos. Ordem e rótulos não mudam.
10. **Limpeza do visual antigo:** saem as classes `zinc-*`, `slate-*`, `amber-*`, `black` e `white` de `app/`; cantos arredondados só em fotos de candidato (círculo) e na pílula de tema.

## Fora de escopo
- Conteúdo novo das telas (specs 010 a 013 e fases seguintes).
- Links "Candidatos" e "Como funciona" no cabeçalho: entram quando essas páginas existirem (Fase 3).
- O feixe do prisma na abertura da home e sua animação (entra com a busca, M08).
- Retícula nos sentimentos (decisão pendente com Bea).

## Contrato de dados
Nenhum endpoint novo nem alterado.

## Critérios de aceite
- [x] `app/globals.css` define os 11 tokens com os valores de `DESIGN.md` para claro e escuro e não contém `#000`, `#000000`, `#fff`, `#ffffff`, `black` nem `white` como valor de cor.
- [x] Nenhum arquivo `.tsx` em `app/` usa as classes `zinc-`, `slate-`, `amber-`, `bg-black`, `bg-white`, `text-black` ou `text-white`.
- [x] O `<html>` carrega a variável da Atkinson Hyperlegible Next e o `body` usa essa família.
- [x] Toda página renderiza um cabeçalho (`banner`) com o link "PRISMA, página inicial", a navegação "Partidos" e o botão de tema com texto visível.
- [x] Na home e em `/partidos/[nrPartido]`, o link "Partidos" tem `aria-current="page"`; em `/politicos/[tituloEleitoral]`, não tem.
- [x] O botão de tema mostra "Modo escuro" com `data-theme="light"` e "Modo claro" com `data-theme="dark"`, alterna o tema e grava `prisma-theme` (comportamento da spec 002 preservado).
- [x] Toda página renderiza um rodapé (`contentinfo`) com o texto exato de `TEXTO_DISCLAIMER`.
- [x] `Disclaimer` mantém o texto exato e não usa classes âmbar.
- [x] `SENTIMENTO_COR` usa só os tokens `sent-*`; a ordem continua Negativo, Neutro, Positivo.
- [x] Os testes existentes continuam passando; `pnpm run build`, `pnpm run lint` e `pnpm run test` passam.
- [x] Verificação visual (Playwright) da home, de um partido com dados e de um político, em 1440px e 390px, nos temas claro e escuro: sem rolagem horizontal, foco visível ao navegar por Tab.

## Casos de borda
- Sem JavaScript: o script inline de tema continua aplicando `data-theme` antes da pintura; o texto do botão reflete o tema após a hidratação.
- `prefers-reduced-motion`: nenhuma transição acima de 150ms nesta spec.
- Fonte ainda carregando: `display: swap` com fallback `system-ui, sans-serif`.

## Fora do escopo desta versão (futuro)
- Retícula (pontos e hachura) para diferenciar sentimentos além do cinza.
- Menu recolhível no celular quando houver mais itens de navegação.
