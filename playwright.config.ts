import { defineConfig } from '@playwright/test';
import { config } from 'dotenv';

export default defineConfig({
  testDir: './tests/e2e', // Folder where Playwright will look for tests
  testMatch: '**/*.spec.ts', // Only files that end with .spec.ts will be treated as tests

  // Allows all tests to run in parallel (faster execution)
  // Good only if tests do not depend on each other
  fullyParallel: true,

  // If running in CI, fail the build if test.only is found
  // Prevents accidentally running only one test in production
  forbidOnly: !!process.env.CI,

  // Retry failed tests only in CI
  // CI environments can be slow or unstable
  retries: process.env.CI ? 2 : 0,

  // Limit workers in CI to avoid instability
  // Locally, Playwright will decide automatically
  workers: process.env.CI ? 1 : undefined,

  // Generate an HTML report after tests finish
  // You can open it with: npx playwright show-report
  reporter: 'html',
});

config();
