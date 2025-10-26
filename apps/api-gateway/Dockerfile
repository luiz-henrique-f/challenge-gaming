# apps/Dockerfile (modelo genérico)
ARG SERVICE
FROM node:20-alpine AS builder
WORKDIR /app

COPY ../../package*.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY ../../apps/api-gateway ./apps/api-gateway
WORKDIR /app/apps/api-gateway
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/api-gateway/dist ./dist
COPY ../../apps/api-gateway/package*.json ./
RUN npm install --omit=dev

ARG PORT=3000
EXPOSE ${PORT}
CMD ["node", "dist/main.js"]
