import { test, expect } from '@playwright/test';
import { TodoPage } from '../src/pages/todo.page';

test.describe('Todo app', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('creates todos and shows them in the list', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await todo.addTask('Write first Playwright test');
    await todo.addTask('Refactor selectors');

    await todo.expectCount(2);
    await expect(todo.itemByText('Write first Playwright test')).toBeVisible();
    await expect(todo.emptyState).toBeHidden();
  });

  test('validates empty input', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await todo.addButton.click();

    await expect(page.getByTestId('error')).toHaveText('Task cannot be empty.');
    await todo.expectCount(0);
  });

  test('toggles complete and deletes a task', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await todo.addTask('Flaky test investigation');

    const item = todo.itemByText('Flaky test investigation');
    await item.getByTestId('toggle').check();
    await expect(item).toHaveClass(/completed/);

    await item.getByTestId('delete').click();
    await todo.expectCount(0);
    await expect(todo.emptyState).toBeVisible();
  });

  test('persists todos in localStorage after reload', async ({ page }) => {
    const todo = new TodoPage(page);
    await todo.goto();

    await todo.addTask('Persist me');
    await page.reload();

    await expect(todo.itemByText('Persist me')).toBeVisible();
  });
});
