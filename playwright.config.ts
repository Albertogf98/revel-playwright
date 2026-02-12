import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

const env = process.env.NODE_ENV || 'prod';
dotenv.config({ path: `./env/.env.${env.toLowerCase()}` });

export default defineConfig({
    testDir: './specs',
    fullyParallel: !!process.env.CI_FULLY_PARALLEL,
    forbidOnly: !!process.env.CI_FORBID,
    retries: 0,
    workers: process.env.CI_WORKERS || 1,
    reporter: [['./src/custom/Report.ts'], ['html', { open: 'never' }]],
    use: {
        baseURL: process.env.BASE_URL,
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        headless: Boolean(process.env.CI_HEADLESS) || false,
    },
    projects: [
        {
            name: 'chrome',
            use: { ...devices['Desktop Chrome'], channel: 'chrome' },
        },
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'safari',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'android',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'ios',
            use: { ...devices['iPhone 12'] },
        },
    ],

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   url: 'http://localhost:3000',
    //   reuseExistingServer: !process.env.CI,
    // },
});
