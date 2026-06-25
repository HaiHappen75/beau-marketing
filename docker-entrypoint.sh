#!/bin/sh
set -e

# Persistent volumes (and the Next cache) mount as root-owned. Make the runtime-
# writable paths owned by the non-root app user before dropping privileges, so
# Payload media uploads succeed.
mkdir -p /app/media /app/.next/cache
chown -R nextjs:nodejs /app/media /app/.next/cache 2>/dev/null || true

exec su-exec nextjs:nodejs "$@"
