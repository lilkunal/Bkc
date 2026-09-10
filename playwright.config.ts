import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://127.0.0.1:4191/Bkc/",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npx vite --host 127.0.0.1 --port 4191",
    url: "http://127.0.0.1:4191/Bkc/",
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
