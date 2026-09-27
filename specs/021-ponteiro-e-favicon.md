# Ponteiro de mão e favicon do prisma

## Objetivo
Pedidos de Bea (27/09/2026): ao passar o mouse sobre botões, o ponteiro não vira a "mãozinha"; e a aba do navegador ainda mostra o ícone padrão, não o prisma.

## Escopo
1. **Ponteiro:** o Tailwind v4 deixa o cursor padrão em `button`. Todo elemento clicável passa a usar `cursor: pointer`: `button`, `summary`, `select`, `[role="option"]`, `[role="tab"]` e `label` que envolve campo. Desabilitados (`:disabled`, `[aria-disabled="true"]`) ficam com `cursor: not-allowed`. Links já têm a mão.
2. **Favicon:** o ícone da marca (feixe, prisma em contorno e leque do espectro) vira `app/icon.svg` (convenção do Next), legível em 16px nos temas claro e escuro do navegador. Sai o `app/favicon.ico` do template. Também entra `app/apple-icon.png` (180px) para atalho no celular.

## Critérios de aceite
- [ ] `globals.css` define `cursor: pointer` para os elementos do escopo e `not-allowed` para os desabilitados.
- [ ] `app/icon.svg` existe e `app/favicon.ico` foi removido; o `<head>` aponta para o ícone novo.
- [ ] Verificação visual do ícone na aba, em 16px e 32px.
