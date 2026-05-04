FROM node:24.14.0-alpine AS builder

RUN npm i -g pnpm@10.30.3

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod

COPY src ./src

FROM node:24.14.0-alpine AS production

RUN apk add --no-cache wget && \
	addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY --from=builder --chown=app:app /app/node_modules ./node_modules
COPY --from=builder --chown=app:app /app/package.json ./package.json
COPY --from=builder --chown=app:app /app/src ./src

USER app

ENV PORT=8000
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
	CMD wget --quiet --spider http://127.0.0.1:${PORT}/health || exit 1

CMD ["node", "src/index.js"]
