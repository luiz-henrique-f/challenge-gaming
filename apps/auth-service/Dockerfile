# apps/Dockerfile (modelo genérico)
ARG SERVICE
FROM node:20-alpine AS builder
WORKDIR /app

COPY ../../package*.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY ../../apps/${SERVICE} ./apps/${SERVICE}
WORKDIR /app/apps/${SERVICE}
RUN pnpm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/apps/${SERVICE}/dist ./dist
COPY ../../apps/${SERVICE}/package*.json ./
RUN npm install --omit=dev

ARG PORT=3000
EXPOSE ${PORT}
CMD ["node", "dist/main.js"]
