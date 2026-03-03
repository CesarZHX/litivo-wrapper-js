import type { Locator, Page } from 'playwright';
import { getInputSelector } from '../../helpers.js';
import type { CausesType } from '../../models/causes.js';
import BaseSection from '../bases/section.js';

class CausesSection extends BaseSection<[CausesType]> {
  private readonly departmentInput: Locator;
  private readonly cityInput: Locator;
  private readonly addCauseButton: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.departmentInput = page.locator(getInputSelector('departamento'));
    this.cityInput = page.locator(getInputSelector('ciudad'));
    this.addCauseButton = page.locator('button:has-text("AGREGAR CAUSA")');
    this.submitButton = page.locator('button.btn-guardar:not([disabled]):has-text("Siguiente")');
  }

  public async send(causes: CausesType): Promise<void> {
    const page: Page = this.page;

    try {
      await this.fillInput(this.departmentInput, causes.department);
      await this.fillInput(this.cityInput, causes.city);
      
      for (const cause of causes.causes) {
        // TODO: Skip cause if it already exists (Now wrapper can continue drafts) .

        await this.addCauseButton.click();

        const CauseTypeInput: Locator = page.locator(getInputSelector('claseCausa'));
        const CauseDescriptionDiv: Locator = page.locator(
          "div.fr-element.fr-view[aria-disabled='false']",
        );
        const SaveCauseButton: Locator = page.locator('button:has-text("GUARDAR")');

        await this.fillInput(CauseTypeInput, cause.type);
        await CauseDescriptionDiv.fill(cause.description);

        await SaveCauseButton.click();
        await SaveCauseButton.waitFor({ state: 'detached' });
      }
      await this.submitButton.click();
      await page.locator('h2', { hasText: 'ACREEDOR' }).waitFor();
    } catch (e) {
      await this.deleteDraft().catch((deleteError) => {
        console.error('Failed to delete draft after error in send:', deleteError);
      });

      console.error('Error in CausesSection.send:', e);
      throw e;
    }
  }
}

export default CausesSection;
