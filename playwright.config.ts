import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './e2e',
    timeout: 120000,
    expect: { timeout: 10000 },
    fullyParallel: false,
    retries: 0,
    use: {
        baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:8080',
        trace: 'retain-on-failure',
        video: 'retain-on-failure',
        screenshot: 'only-on-failure',
        headless: true,
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
    webServer: {
        command: 'npm run dev',
        url: 'http://localhost:8080',
        reuseExistingServer: true,
        timeout: 120000,
    },
});
