import type { Page } from 'playwright';
import { wrapperUrl } from '../constants.js';
import AuthenticatedPage from './bases/authenticated.js';

class DashboardPage extends AuthenticatedPage {
  protected readonly url: URL = new URL('/dashboard', wrapperUrl);

  public constructor(page: Page) {
    super(page);
  }
}
export default DashboardPage;
