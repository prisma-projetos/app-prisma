# Segurança do front e carregamento das imagens

## Objetivo
A revisão de segurança de 26/09/2026 encontrou três lacunas no front:
- o proxy `/api/prisma` não tem limite de requisições, então qualquer pessoa pode usá-lo para martelar a API e o banco sem precisar da chave;
- o site não envia cabeçalhos de segurança (só a API envia);
- as imagens carregam todas de uma vez, inclusive as que estão fora da tela.

Esta spec fecha essas três lacunas sem mudar nada no backend.

## Escopo
1. **Limite de requisições no proxy** (`app/api/prisma/[...path]/route.ts`):
   - janela deslizante por IP de 60 requisições por minuto;
   - o IP vem do primeiro valor de `x-forwarded-for`, depois de `x-real-ip`; sem nenhum dos dois, todas as requisições caem no mesmo balde "desconhecido";
   - acima do limite, responde **429** com `{ "erro": "Muitas requisições. Tente de novo em instantes." }`, o cabeçalho `Retry-After` (segundos até liberar) e `Cache-Control: no-store`, sem chamar o backend;
   - o limitador fica em memória, com limpeza das entradas vencidas. Vale por instância do servidor, o que basta para o container único de hoje. Com várias instâncias, o limite precisa ir para um proxy reverso ou um store compartilhado (fora de escopo).
2. **Cabeçalhos de segurança** em todas as rotas, via `headers()` no `next.config.ts`:
   - `Content-Security-Policy`:
     - `default-src 'self'`, `script-src 'self' 'unsafe-inline'` (mais `'unsafe-eval'` só em desenvolvimento), `style-src 'self' 'unsafe-inline'`;
     - `img-src 'self' data: {origem das imagens}`, `font-src 'self'`, `connect-src 'self'`;
     - `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`;
   - `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`;
   - `Strict-Transport-Security: max-age=31536000; includeSubDomains`, só em produção (em desenvolvimento, o acesso pela rede local é HTTP);
   - `poweredByHeader: false` (sem `X-Powered-By`);
   - a origem das imagens vem de `IMAGENS_ORIGEM`, com padrão `https://api-minio.ajvale.com.br` (MinIO onde ficam logos e fotos).
3. **Imagens** (`EntidadeAvatar`): `loading="lazy"`, `decoding="async"` e `width`/`height` iguais ao tamanho exibido, para o navegador reservar o espaço e só baixar o que está perto da tela.

## Fora de escopo
- Rate limit, desligar o Swagger em produção e índice trigram na API (backend, registrados para o MD do back).
- Otimizar a logo do PRTB (1,6 MB): é arquivo de dados.
- CSP com nonce (removeria o `'unsafe-inline'`): exige renderização dinâmica de todas as páginas; fica para depois.
- `next/image`: o otimizador buscaria as imagens no servidor e mudaria a origem; `loading="lazy"` resolve o problema medido.

## Contrato de dados
Nenhum endpoint novo. O 429 é resposta do próprio proxy.

## Critérios de aceite
- [ ] A 61ª requisição do mesmo IP dentro de 60 segundos recebe 429 com `Retry-After`, a mensagem de erro e `Cache-Control: no-store`, e o backend não é chamado.
- [ ] Outro IP não é afetado pelo limite do primeiro.
- [ ] Depois de 60 segundos, o mesmo IP volta a ser atendido.
- [ ] O IP é lido do primeiro valor de `x-forwarded-for` (ex.: `"1.1.1.1, 10.0.0.1"` → `1.1.1.1`) e, na falta dele, de `x-real-ip`.
- [ ] Toda rota responde com os cabeçalhos do item 2; a CSP permite imagens da origem configurada e proíbe ser embutida em frame.
- [ ] `Strict-Transport-Security` aparece em produção e não aparece em desenvolvimento.
- [ ] Não há `X-Powered-By`.
- [ ] As imagens de logo e foto têm `loading="lazy"`, `decoding="async"`, `width` e `height`.
- [ ] O site continua funcionando com a CSP: tema sem piscar, busca, logos e fotos carregando, sem erros de CSP no console (verificação no navegador).

## Casos de borda
- `x-forwarded-for` vazio ou com espaços: é aparado; vazio cai para `x-real-ip`.
- Relógio: a janela usa o tempo do servidor; nada vem do cliente.
- Muitos IPs diferentes: entradas vencidas são removidas a cada verificação, para a memória não crescer sem limite.

## Fora do escopo desta versão (futuro)
- Limite no proxy reverso ou na CDN, compartilhado entre instâncias.
- CSP com nonce e `strict-dynamic`.
