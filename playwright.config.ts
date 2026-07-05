import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration.
 * See https://playwright.dev/docs/test-configuration.
 *
 * The app is a static SPA served under the GitHub-Pages base path `/Ahmed-SR/`.
 * `webServer` builds and previews it, and `baseURL` points at that base so tests
 * can navigate with `page.goto('/')`.
 *
 * PW_EXECUTABLE_PATH lets an environment with a pre-installed Chromium (that
 * doesn't match this Playwright build's pinned browser) run the suite without a
 * download — leave it unset in CI so Playwright uses its own managed browsers.
 */
const executablePath = process.env.PW_EXECUTABLE_PATH || undefined;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:4173/Ahmed-SR/',
    trace: 'on-first-retry',
    launchOptions: executablePath ? { executablePath } : {},
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  /* Build once and preview it for the whole run. */
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://localhost:4173/Ahmed-SR/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
