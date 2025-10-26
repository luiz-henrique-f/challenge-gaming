# apps/api-gateway/Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Copia apenas os arquivos necessários
COPY ../../package*.json ./
COPY ../../apps/api-gateway ./apps/api-gateway

WORKDIR /app/apps/api-gateway
RUN npm install
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY ../../apps/api-gateway/package*.json ./
RUN npm install --omit=dev

EXPOSE 3000
CMD ["node", "dist/main.js"]
