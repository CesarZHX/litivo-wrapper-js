import type { Page } from 'playwright';
import { AuthenticatedPage } from './bases/authenticated.js';

export class DashboardPage extends AuthenticatedPage {
  protected readonly url: string = 'https://www.litivo.com/dashboard';

  public constructor(page: Page) {
    super(page);
  }
}
