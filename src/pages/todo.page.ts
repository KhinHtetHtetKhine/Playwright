import { expect, Locator, Page } from '@playwright/test';

export class TodoPage {
  readonly page: Page;
  readonly input: Locator;
  readonly addButton: Locator;
  readonly items: Locator;
  readonly emptyState: Locator;

  constructor(page: Page) {
    this.page = page;
    this.input = page.getByTestId('todo-input');
    this.addButton = page.getByTestId('add-button');
    this.items = page.getByTestId('todo-item');
    this.emptyState = page.getByTestId('empty-state');
  }

  async goto(): Promise<void> {
    await this.page.goto('/');
  }

  async addTask(text: string): Promise<void> {
    await this.input.fill(text);
    await this.addButton.click();
  }

  itemByText(text: string): Locator {
    return this.items.filter({ hasText: text });
  }

  async expectCount(count: number): Promise<void> {
    await expect(this.items).toHaveCount(count);
  }
}
