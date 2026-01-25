import type { Page } from 'playwright';

export abstract class BasePage {
  protected abstract readonly url: string;

  public constructor(protected readonly page: Page) {}

  /** Navigate to the page's URL if not already there. */
  public async goto(url: string = this.url): Promise<void> {
    const page: Page = this.page;
    if (page.url() !== url) {
      await page.goto(url);
    }
    await page.waitForURL(url);
  }

  /** Take a screenshot of the current page. */
  public async takeScreenshot(path: string): Promise<void> {
    await this.page.screenshot({ path });
  }

  /** Pause the page. */
  public async pause(): Promise<void> {
    await this.page.pause();
  }

  /** Wait for a specific timeout in milliseconds. */
  public waitForTimeout(timeout: number): Promise<void> {
    return this.page.waitForTimeout(timeout);
  }
}
