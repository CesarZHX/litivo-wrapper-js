import type { BrowserContext, Page } from 'playwright';
import { AuthenticatedPage } from './pages/bases/authenticated.js';
import { DashboardPage } from './pages/dashboard.js';
import { LoginPage } from './pages/login.js';

/** Wrapper class for Litivo interactions using Playwright. */
export class Litivo {
  private authenticatedPage!: AuthenticatedPage; // TODO: Unknown loggin session time, in the future may need to handle re-login.
  private page!: Page;

  public constructor(private readonly context: BrowserContext) {}

  /** Logs into Litivo with the provided credentials.
   *
   * TODO: Throws an error if already logged in with this wrapper.
   */
  public async login(email: string, password: string): Promise<void> {
    const page: Page = await this.context.newPage();

    const loginPage = new LoginPage(page);
    await loginPage.login(email, password);

    const dashboardPage = new DashboardPage(page);

    this.authenticatedPage = dashboardPage;
    this.page = page;

    await dashboardPage.goto(); // Ensure we're on the dashboard page.
  }

  public async logout(): Promise<void> {
    await this.authenticatedPage.logout();
    await this.page.close();
  }

  /**
   * Checks if the Litivo session is logged in.
   *
   * Checked by verifying if cannot go to the dashboard page or login page or something like that.
   */
  public async isLoggedIn(): Promise<boolean> {
    throw new Error('Method not implemented.');
  }

  /** Wait for a specific timeout in milliseconds. */
  public waitforTimeout(timeout: number): Promise<void> {
    return this.authenticatedPage.waitForTimeout(timeout);
  }
}
