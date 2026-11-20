# Stage 1: Install production dependencies
FROM node:24-bookworm-slim AS prod-deps

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod --frozen-lockfile


# Stage 2: Production application runtime
FROM node:24-bookworm-slim AS runtime

ENV NODE_ENV=production

WORKDIR /app

COPY --from=prod-deps --chown=node:node /app/node_modules ./node_modules

COPY --chown=node:node . .

USER node

EXPOSE 8000

CMD ["node", "index.js"]


# Stage 3: Database migration runtime
FROM node:24-bookworm-slim AS migration

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY drizzle.config.js ./
COPY models ./models
COPY drizzle ./drizzle

CMD ["pnpm", "exec", "drizzle-kit", "migrate", "--config=./drizzle.config.js"]