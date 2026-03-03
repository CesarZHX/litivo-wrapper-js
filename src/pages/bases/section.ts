import type { Locator, Page } from 'playwright';
import { expect } from 'playwright/test';
import { z } from 'zod';
import { listarInsolvenciesUrl, strongOptionDivSelector } from '../../constants.js';
import { DraftDeletionException, MoreThanOneDraftWithTheSameDebtorException } from '../../exceptions.js';
import { getInputSelector } from '../../helpers.js';
import Paged from './paged.js';

const isoDateSchema = z.iso.date();

const BASE_DRAFT_URL = 'https://www.litivo.com/insolvencia/crear/';
const DRAFT_URL_PATTERN = new RegExp(`^${BASE_DRAFT_URL.replace(/\//g, '\\/')}\\d+$`);

// TODO: Do not fill if already selected

abstract class BaseSection<T extends unknown[]> extends Paged {
  public constructor(page: Page) {
    super(page);
  }

  protected async uploadFile(uploadTextButton: string, filePath: string): Promise<void> {
    const page = this.page;
    const uploadButton = page.locator('span', { hasText: uploadTextButton });
    const fileInput = page.locator('input[type="file"]#undefined');
    const uploadFileButton = page.locator('button:not([disabled])', { hasText: 'Subir' });

    await uploadButton.click();
    await fileInput.setInputFiles(filePath);
    await uploadFileButton.click();
  }

  private getOptionDiv(title: string): Locator {
    return this.page.locator(`nz-option-item[title="${title}"]`);
  }

  protected async searchDraft(by:"Código de Insolvencia"|"Nombre del Deudor"|"Identificación del Deudor", value:string):Promise<Locator> {
    const page = this.page;

    await page.goto(listarInsolvenciesUrl.href  );
    await page.waitForURL(listarInsolvenciesUrl.href);

    const solicitudStateInput = page.locator(getInputSelector('estado_busqueda'));
    const searchFilterInput = page.locator(getInputSelector('filtrobusqueda'));
    const searchInput = page.locator('input[formcontrolname="search"]');
    const searchButton = page.locator('i[nztype="search"]');
    const rows = page.locator("tbody tr.ant-table-row")

    await this.fillInput(solicitudStateInput, 'BORRADORES');
    await this.fillInput(searchFilterInput, by);
    await searchInput.fill(value);
    await searchButton.click();
    await page.waitForURL(listarInsolvenciesUrl.href);

    return rows;
  }

  protected async getDraftCode(): Promise<string> {
    const page: Page = this.page;
    const shareLink = page.locator('a', { hasText: 'Compartir expediente digital' });
    const copyLinkButton = page.locator('span[nz-tooltip="Click para copiar enlace"]');

    await page.keyboard.press('Escape'); // Close modal if open
    await shareLink.click();
    await copyLinkButton.click();
    const clipboardContent = await page.evaluate(() => navigator.clipboard.readText());

    // TODO: Find why this fails sometimes giving urls like notFoundUrl
    // const notFoundUrl = 'https://www.litivo.com/auth/404';
    if (clipboardContent.includes('auth/404')) {
        await page.waitForTimeout(1_000); // TODO: Find a better way to wait for the page to load
        await copyLinkButton.click();
        const clipboardContent2 = await page.evaluate(() => navigator.clipboard.readText());
        if (clipboardContent2.includes('auth/404')) {
            throw new Error('Failed to copy draft link to clipboard');
        }
    }

    const url = new URL(clipboardContent);
    const segments = url.pathname.split('/').filter(Boolean);
    const code = segments[segments.length - 1] || ''; // Never ''

    console.log(`Draft ${code} loaded`);

    return code;
  }

  protected async goToDraft(): Promise<void> {
    const page: Page = this.page;

    if (DRAFT_URL_PATTERN.test(page.url())) {
      await page.reload();
    } else {
      const code = await this.getDraftCode();
      const currentUrl = page.url();
      const newUrl = `${currentUrl}/${code}`;

      await page.goto(newUrl);
    }
    await page.locator('h2').waitFor(); // NOTE: Section title

    await page.waitForTimeout(1_000); // TODO: Find a better way to wait for the page to load
  }

  protected async deleteDraft(): Promise<void> {
    const page: Page = this.page;
    const code = await this.getDraftCode();
    let rows = await this.searchDraft( "Código de Insolvencia", code);

    try {
        await expect(rows).toHaveCount(1, { timeout: 10_000 });
    } catch (e) {
        throw new DraftDeletionException(`Failed to find the row to delete in the table`);
    }

    const lastRow = rows.last()
    const idCell = lastRow.locator('td').first();
    const trashButton = lastRow.locator('td').locator('a').last();
    const deleteButton = page.locator('button', { hasText: 'Eliminar' });

    if (await idCell.textContent() !== code) {
        throw new DraftDeletionException(`Failed to find the draft with code ${code}`);
    }

    await trashButton.click();
    await deleteButton.click();
    await deleteButton.waitFor({
        state: 'detached',
        timeout: 10_000,
    })

    rows = await this.searchDraft("Código de Insolvencia", code);
    await expect(rows).toHaveCount(0, { timeout: 10_000 });
}

  protected async  validateDraftHasOneDebtor(fullName: string): Promise<void> {
    const rows = await this.searchDraft("Nombre del Deudor", fullName);

    try {
        await expect(rows).toHaveCount(0, { timeout: 10_000 });
    } catch (e) {
        throw new MoreThanOneDraftWithTheSameDebtorException(`Exists more than one draft with this debtor ${fullName}, rows count: ${await rows.count()}`);
    }
}

  /** Fills the input with the provided value selecting the first option. */
  protected async fillInput(nzSelect: Locator, value: string): Promise<void> {
    const input: Locator = nzSelect.locator('input');
    await nzSelect.click();
    // NOTE: this allows to use thisf function like selectOption
    // NOTE: This may replace selectOption methods that may fails if too many options because does not scrolls to make options visible.
    await input.evaluate((el: HTMLInputElement) => {
      el.removeAttribute('readonly');
    });
    await input.fill(value);

    const optionDiv: Locator = this.getOptionDiv(value);
    await optionDiv.click();
    await this.page.waitForTimeout(500); // TODO: find a better way to wait for the input to be filled.
  }

  /** date value should be in YYYY-MM-DD format. Fill in "yyyy/mm/dd" format.
   */
  protected async fillDateInput(nzDatePicker: Locator, value: string): Promise<void> {
    const input: Locator = nzDatePicker.locator('input');
    const date: string = isoDateSchema.parse(value);
    const slashedDate: string = date.replace(/-/g, '/');

    await input.click();
    await input.fill(slashedDate);
    await input.press('Tab'); // NOTE: Close calendar.
    await this.page.waitForTimeout(500); // TODO: find a better way to wait for the input to be filled.
  }

  protected async selectOption(nzSelect: Locator, value: string): Promise<void> {
    await nzSelect.click();
    const optionDiv: Locator = this.getOptionDiv(value);
    await optionDiv.click();
  }

  /**
   * TODO: Do not fill if the value is already selected
   */
  protected async selectDescriptedOption(input: Locator, value: string): Promise<void> {
    await input.click();
    const optionDiv: Locator = this.page.locator(strongOptionDivSelector, { hasText: value });
    await optionDiv.click();
  }

  abstract send(...params: T): Promise<void>;
}

export default BaseSection;
