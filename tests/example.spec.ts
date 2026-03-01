import { test, expect } from '@playwright/test';
import { HomePage } from '../src/pages/home.page';

test('homepage has expected title', async ({ page }) => {
  const home = new HomePage(page);
  await home.goto();
  await expect(page).toHaveTitle(/Example Domain/);
  await expect(page.getByRole('heading', { name: 'Example Domain' })).toBeVisible();
});
