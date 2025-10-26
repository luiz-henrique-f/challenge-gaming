# apps/web/Dockerfile.dev
FROM node:20-alpine as development

WORKDIR /app

# ⭐️ Copia APENAS arquivos necessários para npm install
COPY package*.json ./
COPY turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/ ./packages/

# ⭐️ Instala com cache otimizado
RUN npm install --prefer-offline --no-audit

RUN npx turbo build --filter=@repo/types

# ⭐️ O resto do código via VOLUMES (não COPY)
WORKDIR /app/apps/web

EXPOSE 3000

CMD ["npm", "run", "dev"]