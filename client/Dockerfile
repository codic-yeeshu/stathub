FROM node:24.14.0-alpine AS build-step

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN corepack enable && pnpm install --frozen-lockfile

COPY . .

ARG VITE_API_BASE_URL
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN pnpm run build

# nginx-unprivileged runs as the non-root "nginx" user (uid 101) by default
# and listens on 8080 instead of 80, which avoids needing CAP_NET_BIND_SERVICE.
FROM nginxinc/nginx-unprivileged:1.28-alpine

USER root
RUN apk add --no-cache wget
USER nginx

COPY --chown=nginx:nginx nginx.conf /etc/nginx/nginx.conf
COPY --from=build-step --chown=nginx:nginx /usr/src/app/dist /usr/share/nginx/html

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --quiet --spider http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]
