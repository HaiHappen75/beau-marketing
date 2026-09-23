import { defineConfig, devices } from '@playwright/test'

// Smoke tests against a RUNNING server (pnpm start) — no webServer block, the
// server needs a seeded database and SMTP pointed at Mailpit:
//   docker run -d -p 1025:1025 -p 8025:8025 axllent/mailpit
//   SMTP_HOST=localhost SMTP_PORT=1025 pnpm start
//   pnpm test:e2e
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
