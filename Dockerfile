# syntax=docker/dockerfile:1
# Multi-stage build for Payload 3 + Next.js (standalone). Tuned for an 8 GB server.

# ---------- base ----------
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat
# pnpm exakt pinnen (gleiche Version wie packageManager in package.json).
# COREPACK_DEFAULT_TO_LATEST=0 verhindert, dass corepack je auf pnpm 11 hochzieht.
ENV COREPACK_DEFAULT_TO_LATEST=0
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable pnpm && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

# ---------- deps ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---------- builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# Cap the build heap so it never OOMs the 8 GB box (Payload default would try ~8 GB).
ENV NODE_OPTIONS="--no-deprecation --max-old-space-size=4096"
# NEXT_PUBLIC_* is inlined at build time → must be present here, not just at runtime.
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
# ERECHT24_API_KEY is deliberately NOT a build arg: the legal pages render per
# request and read the key at runtime (Coolify runtime variable). Without it the
# snapshot script skips and the committed content/legal/*.json is bundled — the
# build never needs the secret and never fails over it.
RUN pnpm build

# ---------- runner ----------
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Lean runtime heap; the standalone server is light.
ENV NODE_OPTIONS="--no-deprecation --max-old-space-size=1024"
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# su-exec lets the entrypoint chown the volume as root, then drop to the app user.
RUN apk add --no-cache su-exec
RUN addgroup -S nodejs -g 1001 && adduser -S nextjs -u 1001

# Standalone server + assets only (small image, low RSS).
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000
# Starts as root → entrypoint makes /app/media writable, then drops to `nextjs`.
# NODE_ENV=production + prodMigrations → pending DB migrations run automatically on init.
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]
