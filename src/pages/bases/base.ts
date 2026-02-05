import type { Page } from 'playwright';
import Paged from './paged.js';

abstract class BasePage extends Paged {
  protected abstract readonly url: URL; // TODO: check if can be optimized by using base url and endpoints to avoid initialization of new URL objects. Check project constants URL as well.

  /** Navigate to the page's URL if not already there. */
  public async goto(url: URL = this.url): Promise<void> {
    const page: Page = this.page;
    const href: string = url.href;
    const pageUrl: string = page.url();
    if (pageUrl !== href) {
      await page.goto(href);
    }
    await page.waitForURL(href);
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

export default BasePage;
