import type { Page } from '@playwright/test';

class SideBar {
  public constructor(private readonly page: Page) {}
}

export default SideBar;
