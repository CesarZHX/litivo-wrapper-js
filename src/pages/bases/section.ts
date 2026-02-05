import type { Locator, Page } from 'playwright';
import { optionDivSelector } from '../../constants.js';
import Paged from './paged.js';

abstract class BaseSection<T extends unknown[]> extends Paged {
  private readonly firstOptionDiv: Locator;

  public constructor(page: Page) {
    super(page);
    const optionDiv: Locator = page.locator(optionDivSelector);
    this.firstOptionDiv = optionDiv.first();
  }

  protected async fillInput(input: Locator, value: string): Promise<void> {
    await input.click();
    await input.fill(value);
    this.firstOptionDiv.click();
    await this.page.waitForTimeout(500); // TODO: find a better way to wait for the input to be filled.
  }

  protected async selectOption(input: Locator, value: string): Promise<void> {
    await input.click();
    const optionDiv: Locator = this.page.locator(optionDivSelector, { hasText: value });
    await optionDiv.click();
  }

  abstract send(...params: T): Promise<void>;
}

export default BaseSection;
