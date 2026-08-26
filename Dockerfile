# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Enable corepack for modern package managers if needed, but we use npm here
# RUN corepack enable

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

EXPOSE 3000

ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3000
ENV NODE_ENV=production

CMD ["node", ".output/server/index.mjs"]
