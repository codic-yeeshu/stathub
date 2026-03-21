FROM node:24.14.0-alpine AS builder

RUN npm i -g pnpm

RUN node -v
RUN pnpm -v

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY src ./src

RUN pnpm install --frozen-lockfile

FROM node:24.14.0-alpine AS production

WORKDIR /app

COPY --from=builder /app/ /app

EXPOSE 8000

CMD ["node", "src/index.js"]
