import type { BrowserContext, Page } from 'playwright';

import { InsolvencySchema, type InsolvencyType } from './models/insolvency.js';
import AuthenticatedPage from './pages/bases/authenticated.js';
import DashboardPage from './pages/dashboard.js';
import CreateInsolvencyPage from './pages/insolvency/create.js';
import LoginPage from './pages/login.js';

/** Wrapper class for Litivo interactions using Playwright.
 *
 * TODO: Check if multiple pages can be handled at the same time.
 */
class Litivo {
  private page!: Page;
  private authenticatedPage!: AuthenticatedPage; // TODO: Unknown loggin session time, in the future may need to handle re-login.
  private createInsolvencyPage!: CreateInsolvencyPage;

  public constructor(private readonly context: BrowserContext) {}

  /** Logs into Litivo with the provided credentials.
   *
   * NOTE: This method acts as an async constructor.
   *
   * TODO: Throws an error if already logged in with this wrapper.
   */
  public async login(email: string, password: string): Promise<void> {
    const page: Page = await this.context.newPage(); // TODO: Check if it will be good to close former pagge if it setted up yet.

    const loginPage = new LoginPage(page);
    await loginPage.login(email, password);

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.goto();

    this.page = page;
    this.authenticatedPage = dashboardPage;
    this.createInsolvencyPage = new CreateInsolvencyPage(page);
  }

  /** Creates a new insolvency.
   *
   * TODO: Abstract some actions into their own page models if needed.
   * TODO: check if it is responsability to check insolvency object here.
   * TODO: Find a way to show input options.
   * TODO: Check bug where playwright vscode extension debugger does not raise timeout errors. May a general playwright problem.
   */

  public async createInsolvency(data: unknown): Promise<void> {
    const insolvency: InsolvencyType = InsolvencySchema.parse(data);
    await this.createInsolvencyPage.createInsolvency(insolvency);
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
    return this.page.waitForTimeout(timeout);
  }
}

export default Litivo;
