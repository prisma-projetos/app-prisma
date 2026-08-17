# Alternância de modo claro/escuro

## Objetivo
Permitir que o usuário escolha manualmente entre modo claro e modo escuro, em vez de depender apenas da preferência do sistema operacional, com a escolha persistida entre visitas.

## Escopo
- Um botão de alternância de tema (ícone sol/lua), visível em todas as páginas via layout raiz (`app/layout.tsx`), posicionado de forma consistente (ex.: canto superior direito).
- Dois estados possíveis: **claro** e **escuro**. Sem estado "sistema" selecionável na UI (ver "Fora do escopo desta versão").
- Na primeira visita (sem escolha salva), o tema inicial reflete `prefers-color-scheme` do sistema operacional do usuário.
- Ao clicar no botão, o tema alterna instantaneamente (sem reload de página) e a escolha é persistida em `localStorage` (chave ex.: `prisma-theme`), prevalecendo sobre a preferência do sistema em visitas futuras.
- Nenhum flash de tema incorreto (FOUC) no carregamento inicial — resolvido via script inline bloqueante no `<head>` que aplica a classe de tema ao `<html>` antes da hidratação.
- Migração da estratégia de dark mode do Tailwind de `prefers-color-scheme` (media query) para estratégia baseada em classe (`@custom-variant dark (&:where(.dark, .dark *));` em `app/globals.css`), para que a alternância manual controle efetivamente as classes `dark:` já usadas em todo o app (`EntidadeAvatar`, `Disclaimer`, `SinteseTabs`, páginas de partido/político).
- Verificação de que os badges de fato/opinião do autor/inferência do modelo em `SinteseTabs` permanecem visualmente diferenciáveis (contraste adequado) em ambos os modos, preservando a regra de UI do AGENTS.md.

## Fora de escopo
- Temas além de claro/escuro (ex.: alto contraste, temas de cor customizados por usuário).
- Sincronização da preferência entre dispositivos ou contas (não há autenticação no projeto).
- Alteração da paleta de cores da marca — reaproveita os tokens já existentes (`--background`, `--foreground`) e as classes `dark:` já presentes no código, apenas trocando o mecanismo que as ativa.

## Contrato de dados
Não há integração com a API. Estado é inteiramente local:
- `localStorage["prisma-theme"]`: `"light" | "dark"` (ausente = segue `prefers-color-scheme` do sistema).

## Critérios de aceite
- [ ] Um botão de alternância de tema está visível e acessível em todas as páginas (home, partido, político).
- [ ] Clicar no botão alterna instantaneamente entre modo claro e escuro, sem reload da página.
- [ ] Na primeira visita, sem preferência salva, o tema inicial corresponde ao `prefers-color-scheme` do sistema.
- [ ] Após alternância manual, a escolha é persistida em `localStorage` e mantida em reloads e novas visitas, prevalecendo sobre a preferência do sistema.
- [ ] Não há flash de tema incorreto perceptível no carregamento inicial da página.
- [ ] O botão reflete visualmente o estado atual (ex.: ícone de sol quando em modo escuro — indicando ação de alternar para claro — e ícone de lua quando em modo claro).
- [ ] O botão possui rótulo acessível (`aria-label`) descrevendo a ação (ex.: "Alternar para modo escuro" / "Alternar para modo claro").
- [ ] Componentes existentes (`Disclaimer`, `EntidadeAvatar`, `SinteseTabs`, páginas de home/partido/político) permanecem legíveis, com contraste adequado, em ambos os modos.
- [ ] Os badges de fato/opinião do autor/inferência do modelo continuam visualmente distintos entre si em ambos os modos.

## Casos de borda
- JavaScript desabilitado: não há como alternar; o tema cai para o comportamento de `prefers-color-scheme` do sistema via CSS (fallback gracioso, sem quebrar o layout).
- `localStorage` indisponível ou bloqueado (ex.: modo privado restritivo): a alternância funciona durante a sessão atual (estado em memória), mas não persiste entre recarregamentos — sem lançar erro visível ao usuário.
- Usuário altera a preferência do sistema operacional após já ter feito uma escolha manual: a escolha manual salva prevalece; não há re-sincronização automática com o sistema.

## Fora do escopo desta versão (futuro)
- Terceira opção explícita "Seguir sistema" no seletor de tema (hoje esse comportamento só existe implicitamente antes da primeira escolha manual).
- Persistência da preferência de tema no backend/perfil do usuário, caso autenticação seja introduzida futuramente.
