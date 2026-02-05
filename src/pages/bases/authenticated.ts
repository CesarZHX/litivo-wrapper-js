import type { Page } from '@playwright/test';

import Header from '../components/header.js';
import SideBar from '../components/sideBar.js';
import FootedPage from './footed.js';

/**
 * Base class for all pages that require a logged-in session.
 *
 * Provides a reusable Header component with logout functionality.
 */
abstract class AuthenticatedPage extends FootedPage {
  public readonly header: Header;
  public readonly sideBar: SideBar;

  public constructor(page: Page) {
    super(page);
    this.header = new Header(page);
    this.sideBar = new SideBar(page);
  }

  /** Logs out of the application using the Header component. */
  public async logout(): Promise<void> {
    await this.header.logout();
  }
}

export default AuthenticatedPage;
