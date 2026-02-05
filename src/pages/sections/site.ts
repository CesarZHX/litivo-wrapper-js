import type { Locator, Page } from 'playwright';
import { getInputSelector } from '../../helpers.js';
import type { SiteType } from '../../models/site.js';
import BaseSection from '../bases/section.js';

class SiteSection extends BaseSection<[SiteType]> {
  private readonly departmentInput: Locator;
  private readonly cityInput: Locator;
  private readonly sponsorEntityInput: Locator;
  private readonly branchCenterInput: Locator;
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.departmentInput = page.locator(getInputSelector('departamento'));
    this.cityInput = page.locator(getInputSelector('ciudad'));
    this.sponsorEntityInput = page.locator(getInputSelector('entidad'));
    this.branchCenterInput = page.locator(getInputSelector('sede'));
    this.submitButton = page.locator('button.btn-guardar:not([disabled])');
  }

  public async send(site: SiteType): Promise<void> {
    // TODO: Check if is it possible to optimice by creating a custom object or doing a for loop.
    await this.fillInput(this.departmentInput, site.department);
    await this.fillInput(this.cityInput, site.city);
    await this.fillInput(this.sponsorEntityInput, site.sponsorEntity);
    await this.fillInput(this.branchCenterInput, site.branchCenter);

    await this.submitButton.click();
    await this.branchCenterInput.waitFor({ state: 'detached' });
  }
}

export default SiteSection;
