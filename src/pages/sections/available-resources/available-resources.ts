import type { Locator, Page } from 'playwright';
import type { AvailableResourceDefinedType, AvailableResourcesType, AvailableResourceType } from '../../../models/available-resources.js';
import BaseSection from '../../bases/section.js';

import { titleCase } from '../../../helpers.js';
import { isAvailableResourceDefined } from './helpers.js';
/** TODO: Available Resources (feat: extend create insolvency method with available resources section) */
class AvailableResourcesSection extends BaseSection<[AvailableResourcesType]> {
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.locator('button.btn-guardar:not([disabled])', {
      hasText: 'Siguiente',
    });
  }

  private async addAvailableResources(availableResources: AvailableResourceType[]): Promise<void> {
    for (const resource of availableResources) {
      const resourceInput = this.page.locator("input[formcontrolname='nuevoGasto']");
      const plusButton = resourceInput.locator("+ span[type='addon']");
      const amountInput = this.page.locator(`input[placeholder='${titleCase(resource.name)}']`);

      await resourceInput.fill(resource.name);
      await plusButton.click();
      await amountInput.fill(resource.amount.toString());
    }
  }

  private async addDefinedAvailableResources(availableDefinedResources: AvailableResourceDefinedType[]): Promise<void> {
    for (const resource of availableDefinedResources) {
      const resourceInput = this.page.locator(`input[placeholder="${resource.name}"]`);
      await resourceInput.fill(resource.amount.toString());
    }
  }

  public async send(availableResources: AvailableResourcesType | undefined = []): Promise<void> {
    const page = this.page;

    const availableBaseResources = availableResources.filter(
      resource=> !isAvailableResourceDefined(resource)
    );
    const availableDefinedResources = availableResources.filter(
      resource=> isAvailableResourceDefined(resource) 
    );

    await this.addDefinedAvailableResources(availableDefinedResources);
    await this.addAvailableResources(availableBaseResources);

    const saveButton = page.locator('button', { hasText: 'Guardar' });
    await saveButton.click();

    await this.submitButton.click();
    await page.locator('h2', { hasText: 'NEGOCIACIÓN DE DEUDAS' }).waitFor();
  }
}

export default AvailableResourcesSection;
