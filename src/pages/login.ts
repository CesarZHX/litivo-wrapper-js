import type { Locator, Page } from 'playwright';
import { wrapperUrl } from '../constants.js';
import FootedPage from './bases/footed.js';

/** Page object for the Litivo login page. */
class LoginPage extends FootedPage {
  protected readonly url: URL = new URL('/auth/login', wrapperUrl);

  private readonly emailInput!: Locator;
  private readonly passwordInput!: Locator;
  private readonly submitButton!: Locator;

  /** Creates a new LoginPage instance. */
  public constructor(page: Page) {
    super(page);
    this.emailInput = page.locator('input[formcontrolname="email"]');
    this.passwordInput = page.locator('input[formcontrolname="contrasena"]');
    this.submitButton = page.locator('button.btn-guardar');
  }

  /** Logs into Litivo with the provided credentials. */
  public async login(username: string, password: string): Promise<void> {
    await this.goto();
    await this.emailInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.page.waitForURL((url) => url.href !== this.url.href);
  }
}

export default LoginPage;
