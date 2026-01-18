# Playwright Test Suite

A concise, easy-to-use Playwright test suite template for automated end-to-end testing. Ready to drop into a repository and run locally or in CI.

## Features
- Cross-browser tests (Chromium, Firefox, WebKit)
- TypeScript support (or JavaScript if preferred)
- Page Object Model (POM) structure
- Test fixtures and environment configuration
- Parallel test execution and retries
- CI-ready (examples for GitHub Actions)

## Quick Start

Prerequisites:
- Node.js 18+ installed
- npm or yarn

Install dependencies:
```bash
npm install
# or
yarn
```

Install Playwright browsers (only required once):
```bash
npx playwright install
```

Run tests:
```bash
npx playwright test
```

Run tests in headed mode (visual debugging):
```bash
npx playwright test --headed
```

Run tests in a specific browser:
```bash
npx playwright test --project=firefox
```

Run a single test file:
```bash
npx playwright test tests/example.spec.ts
```

Open Playwright Test Runner UI:
```bash
npx playwright show-report
npx playwright test --reporter=html && npx playwright show-report
```

Record a test:
```bash
npx playwright codegen https://example.com
```

Generate traces and videos (useful for flaky tests):
- Enable traces: add `trace: 'on-first-retry'` to your config or run with `--trace on`.
- Save videos/screenshots via config or test hooks.

## Recommended Structure
- tests/               — test files (e.g., *.spec.ts)
- src/pages/           — Page Object Model classes
- fixtures/            — custom fixtures and test data
- playwright.config.ts — Playwright configuration
- package.json

Example test (TypeScript):
```ts
import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/home.page';

test('homepage has expected title', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await expect(page).toHaveTitle(/Example Domain/);
});
```

Example Page Object:
```ts
import { Page } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  constructor(page: Page) { this.page = page; }
  async goto() { await this.page.goto('https://example.com'); }
}
```

## Configuration Tips
- playwright.config.ts: define projects, retries, timeout, reporter(s), outputDir for artifacts.
- Use environment variables for secrets and base URLs (e.g., BASE_URL, API_KEY).
- Group slow tests separately and tag tests with `.slow` or custom metadata.

Sample config snippet:
```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'firefox',  use: { browserName: 'firefox' } },
    { name: 'webkit',   use: { browserName: 'webkit' } },
  ],
  reporter: [['list'], ['html', { open: 'never' }]]
});
```

## CI Integration (GitHub Actions)
Workflow example (.github/workflows/playwright.yml):
```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with: node-version: '18'
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test --reporter=dot
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report
```

## Best Practices
- Use Page Objects to encapsulate selectors and actions.
- Keep tests deterministic: mock external APIs where possible.
- Use data-driven tests for variants.
- Capture traces/videos for intermittent failures.
- Run tests in CI in parallel but limit concurrency for resource-heavy tests.

## Troubleshooting
- Use `npx playwright test --debug` to run tests with inspector.
- Re-run failing tests locally with `--project` and `--grep` to isolate.
- Check playwright-report for traces, screenshots, and logs.

## Contributing
- Open an issue for bugs or feature requests.
- Follow repo coding style and add tests for new features.
- Submit pull requests with clear descriptions and test coverage.
