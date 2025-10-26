# apps/tasks-service/Dockerfile.dev
FROM node:20-alpine as development

WORKDIR /app

# ⭐️ Copia APENAS arquivos necessários para npm install
COPY package*.json ./
COPY turbo.json ./
COPY apps/tasks-service/package.json ./apps/tasks-service/
COPY packages/ ./packages/

# ⭐️ Instala com cache otimizado
# RUN npm install --prefer-offline --no-audit

RUN npm ci --prefer-offline --no-audit --no-fund

# COPY . .


# RUN npm ci --prefer-offline --no-audit

# RUN npx turbo build --filter=@repo/types...

# ⭐️ O resto do código via VOLUMES (não COPY)
WORKDIR /app/apps/tasks-service

EXPOSE 3003

CMD ["npm", "run", "dev"]