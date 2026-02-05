import type { Locator, Page } from 'playwright';
import { getInputSelector } from '../../helpers.js';
import type { DebtorType, IdDocType } from '../../models/debtor.js';
import BaseSection from '../bases/section.js';

/**
 * TODO: Debtor (feat: extend create insolvency method with debtor section)
 * TODO: check the next BUSINESS LOGIC: Debtors can have just one insolvency application at a time.
 * TODO: Check if it is possible to used a tuple instead of an array.
 */
class DebtorSection extends BaseSection<[DebtorType[]]> {
  private readonly addDebtorButton: Locator;
  private readonly idTypeInput: Locator;
  private readonly idNumberInput: Locator;
  private readonly searchButton: Locator;
  private readonly debtorInput: Locator;

  public constructor(page: Page) {
    super(page);
    this.addDebtorButton = page.locator('app-insolvencia-deudor button.btn-guardar');
    this.idTypeInput = page.locator(getInputSelector('tipoDocumento'));
    this.idNumberInput = page.locator('input[formcontrolname="numeroIdentificacion"]');
    this.searchButton = page.locator('span', { hasText: 'Buscar' }); // TODO: Find a better way to get the search button.
    this.debtorInput = page.locator(getInputSelector('deudor'));
  }
  public async send(debtors: DebtorType[]): Promise<void> {
    const page = this.page;

    for (const debtor of debtors) {
      const idDoc: IdDocType = debtor.idDoc;
      const docType: string = idDoc.type;
      const docNumber: string = idDoc.number;

      await this.addDebtorButton.click();

      await this.selectOption(this.idTypeInput, docType);
      await this.idNumberInput.fill(docNumber);
      await this.searchButton.click();

      // Checking manually if the search was successful.
      await page.waitForTimeout(5_000);
      // await page.locator('app-formulario-participante').screenshot({ path: 'debtor.png' });

      this.debtorInput; // Breakpoint line. TODO: Use this locator.
    }
  }
}

export default DebtorSection;
