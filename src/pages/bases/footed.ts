import type { Page } from 'playwright';
import Footer from '../components/footer.js';
import BasePage from './base.js';

abstract class FootedPage extends BasePage {
  public readonly footer: Footer;

  public constructor(page: Page) {
    super(page);
    this.footer = new Footer(page);
  }
}

export default FootedPage;
