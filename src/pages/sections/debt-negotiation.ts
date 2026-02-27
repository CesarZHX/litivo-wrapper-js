import type { Locator, Page } from 'playwright';
import { getDateInputSelector, getInputSelector } from '../../helpers.js';
import type { DebtNegotiationsType, DebtNegotiationType } from '../../models/debt-negotiation.js';
import BaseSection from '../bases/section.js';

/** TODO: Debt Negotiation (feat: extend create insolvency method with debt negotiation section) */
class DebtNegotiationSection extends BaseSection<[DebtNegotiationType[]]> {
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.locator('button.btn-guardar:not([disabled])', {
      hasText: 'Siguiente',
    });
  }

  public async send(debtNegotiations: DebtNegotiationsType | undefined = []): Promise<void> {
    const page = this.page;

    const installmentsTable = page.locator('nz-table');
    const creditTypeInput: Locator = page.locator(getInputSelector('tipo_credito'));
    const startDateInput = page.locator(getDateInputSelector('fecha'));
    const installmentsInput = page.locator('nz-input-number[formcontrolname="cuotas"] input');
    const recalculateProjectionButton = page.locator(
      'button:has-text("Guardar datos y calcular proyección"), button:has-text("Recalcular proyección")',
    );
    const confirmButton = page.locator('button', { hasText: 'Confirmar' });

    for (const debtNegotiation of debtNegotiations || []) {
      await this.fillInput(creditTypeInput, debtNegotiation.creditType);
      await installmentsTable.waitFor({state:"detached"});
      await this.fillDateInput(startDateInput, debtNegotiation.startDate);
      await installmentsInput.fill(debtNegotiation.installments.toString());
      await recalculateProjectionButton.click();
      await page.waitForTimeout(1000) // TODO: Find a better way to wait for the page to load
    }

    await this.submitButton.click();
    await confirmButton.click();

    await page.locator('h2', { hasText: 'DOCUMENTOS ANEXOS' }).waitFor();
  }
}

export default DebtNegotiationSection;
