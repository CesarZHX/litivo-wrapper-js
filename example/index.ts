import { chromium, type Browser, type BrowserContext } from 'playwright';
import main from './main.js';

const browser: Browser = await chromium.launch({ channel: 'msedge', headless: false });
const browserContext: BrowserContext = await browser.newContext();
try {
  await main(browserContext);
} catch (error) {
  console.error('Error during execution:', error);
} finally {
  await browserContext.close();
  await browser.close();
}
