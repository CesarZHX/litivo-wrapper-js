import type { Locator, Page } from '@playwright/test';

class Header {
  public readonly appPerfil: Locator;
  public readonly logoutButton: Locator;

  public constructor(private readonly page: Page) {
    this.appPerfil = page.locator('app-perfil');
    this.logoutButton = page.locator('a.btn-salir');
  }

  /** Logs out of the application */
  public async logout(): Promise<void> {
    const page: Page = this.page;
    const pageUrl: string = page.url();
    await this.appPerfil.click();
    await this.logoutButton.click();
    await page.waitForURL((newUrl) => newUrl.href !== pageUrl); // TODO: Consider refactoring into an interface method.
  }
}

export default Header;
