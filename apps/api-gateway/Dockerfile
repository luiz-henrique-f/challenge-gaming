# apps/api-gateway/Dockerfile.dev
FROM node:20-alpine as development

WORKDIR /app

# ⭐️ Copia APENAS arquivos necessários para npm install
COPY package*.json ./
COPY turbo.json ./
COPY apps/api-gateway/package.json ./apps/api-gateway/
COPY packages/ ./packages/

# ⭐️ Instala com cache otimizado
# RUN npm install --prefer-offline --no-audit

# RUN npm ci --prefer-offline --no-audit
RUN npm ci --prefer-offline --no-audit --no-fund

# COPY . .

# RUN npx turbo build --filter=@repo/types...

# ⭐️ O resto do código via VOLUMES (não COPY)
WORKDIR /app/apps/api-gateway

EXPOSE 3001

CMD ["npm", "run", "dev"]