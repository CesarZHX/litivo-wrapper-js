import type { Page } from 'playwright';

abstract class Paged {
  protected constructor(protected readonly page: Page) {}
}

export default Paged;
