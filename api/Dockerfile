# ---- Base: Node + openssl (exigido pelo Prisma no Alpine) ----
FROM node:22-alpine AS base
RUN apk add --no-cache openssl
WORKDIR /app

# ---- Dependências (camada cacheada enquanto o package-lock não mudar) ----
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ---- Build: gera o client do Prisma e compila o TypeScript ----
FROM deps AS build
COPY . .
RUN npx prisma generate \
  && npm run build \
  && npm prune --omit=dev \
  && npx prisma generate

# ---- Imagem final: só o necessário para rodar ----
FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
EXPOSE 3333
# Aplica as migrations pendentes antes de subir a API
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]