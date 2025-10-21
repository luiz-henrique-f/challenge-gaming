# ----------------------------------------------------
# Stage 1: Dependency Install (Monorepo Cache)
# Este bloco é repetido, mas o Docker usará o cache após a primeira execução.
FROM node:20-slim as monorepo_deps
WORKDIR /app
COPY package.json package-lock.json turbo.json ./ 
COPY apps/*/package.json apps/
COPY packages/*/package.json packages/
RUN npm install
# ----------------------------------------------------

# --- Stage 2: Desenvolvimento/Execução ---
FROM node:20-slim as development

# Copia os node_modules do estágio 1 (CACHE HIT)
COPY --from=monorepo_deps /app /app

WORKDIR /app

# Copia o código fonte. Esta linha invalida o cache, mas o npm install já está pronto.
COPY . .

# Se você precisar rodar um build antes de executar (ex: tsc), descomente:
# RUN npx turbo run build --filter=api-gateway

# Configuração e Execução Específica para este serviço
EXPOSE 3003
CMD ["npm", "run", "dev"]