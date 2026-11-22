# syntax=docker/dockerfile:1

ARG NODE_VERSION=22-alpine

# ---------- base ----------
FROM node:${NODE_VERSION} AS base
WORKDIR /app
RUN corepack enable

# ---------- deps ----------
# Instala todas as dependências (incluindo dev) usando o lockfile do pnpm
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

# ---------- builder ----------
# Builda a aplicação Next.js (output: "standalone")
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Os cabeçalhos de segurança (CSP) são calculados no build: a origem das imagens
# entra aqui, e não no container em execução (spec 019).
ARG IMAGENS_ORIGEM=https://api-minio.ajvale.com.br
ENV IMAGENS_ORIGEM=${IMAGENS_ORIGEM}
# Aba "Estados" e filtro por UF (spec 023). NEXT_PUBLIC_* é gravado no build,
# então precisa estar aqui. Ligado porque a api-prisma publicada já filtra por
# `uf`; use --build-arg NEXT_PUBLIC_FILTRO_UF=0 para desligar.
ARG NEXT_PUBLIC_FILTRO_UF=1
ENV NEXT_PUBLIC_FILTRO_UF=${NEXT_PUBLIC_FILTRO_UF}
RUN pnpm run build

# ---------- runner ----------
# Imagem final, mínima, só com o necessário para rodar
FROM node:${NODE_VERSION} AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
