# Tema do sistema e botão de tema compacto no celular

## Objetivo
Pedido de Bea (27/09/2026): o modo claro ou escuro deve seguir automaticamente o sistema operacional do usuário, e no celular o botão de tema mostra só o ícone (lua ou sol), sem o texto.

## Escopo
1. **O sistema manda** (decisão de Bea: "o sistema manda; o botão vale só na visita"):
   - ao abrir o site, o tema é o de `prefers-color-scheme`;
   - se o sistema mudar com o site aberto (ex.: modo escuro automático à noite), o site muda junto;
   - o botão troca o tema só até a aba ser fechada (`sessionStorage`, chave `prisma-theme`); numa visita nova, volta a valer o sistema;
   - a escolha antiga salva em `localStorage` (versão anterior) é apagada na primeira visita, para não prender ninguém num tema.
2. **Botão compacto no celular:** abaixo de `sm` (640px), a pílula mostra só o ícone (lua no claro, sol no escuro), com 48×48px e o mesmo `aria-label` ("Modo escuro" / "Modo claro"). A partir de `sm`, continua com ícone e texto.
3. Sem tema piscando no carregamento: o script inline do `<head>` passa a ler `sessionStorage` e o sistema.

## Fora de escopo
- Opção "Automático" explícita no botão.

## Critérios de aceite
- [x] Sem escolha na sessão, o `data-theme` segue `prefers-color-scheme` no carregamento.
- [x] Mudar `prefers-color-scheme` com a página aberta muda o `data-theme`, se não houver escolha na sessão.
- [x] Clicar no botão troca o tema e grava em `sessionStorage`, não em `localStorage`; com escolha na sessão, a mudança do sistema não sobrescreve.
- [x] Um `prisma-theme` antigo em `localStorage` é removido e ignorado.
- [x] No celular, o botão não mostra o texto, mas mantém o nome acessível; no desktop, mostra.
