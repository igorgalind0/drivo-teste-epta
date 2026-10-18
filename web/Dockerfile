FROM node:22-alpine AS base
WORKDIR /app

# Dependências
FROM base AS deps
COPY package*.json ./
RUN npm ci

# Build 
FROM deps AS build
COPY . .
# NEXT_PUBLIC_* é embutido no JS do navegador durante o build
ARG NEXT_PUBLIC_API_URL=http://localhost:3333
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Imagem final: servidor standalone do Next
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]