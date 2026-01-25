import type { Locator, Page } from '@playwright/test';

export class Header {
  public readonly appPerfil: Locator;
  public readonly logoutButton: Locator;

  public constructor(private readonly page: Page) {
    this.appPerfil = page.locator('app-perfil');
    this.logoutButton = page.locator('a.btn-salir');
  }

  /** Logs out of the application */
  public async logout(): Promise<void> {
    const page: Page = this.page;
    await this.appPerfil.click();
    const url = page.url();
    await this.logoutButton.click();
    await page.waitForURL((newUrl) => newUrl.toString() !== url); // TODO: May be and interface method.
  }
}
