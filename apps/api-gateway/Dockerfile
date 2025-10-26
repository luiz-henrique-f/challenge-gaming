# apps/api-gateway/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Copia o root e dependências
COPY ../../package*.json ./
RUN npm install

# Copia o pacote de types para dentro do container
COPY ../../packages/types ./packages/types

# Copia o código do microsserviço
COPY ../../apps/api-gateway ./apps/api-gateway

# Entra na pasta do microsserviço e faz o build
WORKDIR /app/apps/api-gateway
RUN npm run build

# --- Runtime ---
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY ../../apps/api-gateway/package*.json ./
RUN npm install --omit=dev
EXPOSE 3000
CMD ["node", "dist/main.js"]
