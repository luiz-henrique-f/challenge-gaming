# apps/auth-service/Dockerfile.dev
FROM node:20-alpine as development

WORKDIR /app

# ⭐️ Copia APENAS arquivos necessários para npm install
COPY package*.json ./
COPY turbo.json ./
COPY apps/auth-service/package.json ./apps/auth-service/
COPY packages/ ./packages/

# ⭐️ Instala com cache otimizado
# RUN npm install --prefer-offline --no-audit

# COPY . .


# RUN npm ci --prefer-offline --no-audit
RUN npm ci --prefer-offline --no-audit --no-fund

# RUN npx turbo build --filter=@repo/types...

# ⭐️ O resto do código via VOLUMES (não COPY)
WORKDIR /app/apps/auth-service

EXPOSE 3002

CMD ["npm", "run", "dev"]