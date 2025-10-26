FROM node:20-slim AS builder

WORKDIR /app

# Copia apenas os arquivos necessários para instalação
COPY package*.json ./
COPY turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

# Instala todas as dependências
RUN npm ci --only=production

# Copia o código fonte
COPY . .

# Build da aplicação
RUN npx turbo run build --filter=web

# Estágio de produção
FROM node:20-slim AS production

WORKDIR /app

# Copia apenas o necessário do estágio de build
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder /app/apps/web/public ./apps/web/public

# Usuário não-root para segurança
USER node

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

CMD ["node", "apps/web/server.js"]