import type { Page } from 'playwright';
import { wrapperUrl } from '../../constants.js';
import type { InsolvencyType } from '../../models/insolvency.js';
import FootedPage from '../bases/footed.js';
// Sections
import ApplicationSubmissionSection from '../sections/application-submission.js';
import AssetsSection from '../sections/assets/assets.js';
import AttachedDocumentsSection from '../sections/attached-documents.js';
import AvailableResourcesSection from '../sections/available-resources/available-resources.js';
import CausesSection from '../sections/causes.js';
import ChildSupportObligationsSection from '../sections/child-support-obligations.js';
import CreditorSection from '../sections/creditor.js';
import DebtNegotiationSection from '../sections/debt-negotiation.js';
import DebtorSection from '../sections/debtor.js';
import JAOPPSection from '../sections/judicial-administrative-or-private-proceedings.js';
import SiteSection from '../sections/site.js';

class CreateInsolvencyPage extends FootedPage {
  protected readonly url: URL = new URL('/insolvencia/crear', wrapperUrl);

  // TODO: Check if is it possible to optimice by agruping section and doin a for loop like section.send(value).
  private readonly siteSection: SiteSection;
  private readonly debtorSection: DebtorSection;
  private readonly causesSection: CausesSection;
  private readonly creditorSection: CreditorSection;
  private readonly assetsSection: AssetsSection;
  private readonly jaoppSection: JAOPPSection;
  private readonly childSupportObligationsSection: ChildSupportObligationsSection;
  private readonly availableResourcesSection: AvailableResourcesSection;
  private readonly debtNegotiationSection: DebtNegotiationSection;
  private readonly attachedDocumentsSection: AttachedDocumentsSection;
  private readonly applicationSubmissionSection: ApplicationSubmissionSection;

  constructor(page: Page) {
    super(page);
    this.siteSection = new SiteSection(page);
    this.debtorSection = new DebtorSection(page);
    this.causesSection = new CausesSection(page);
    this.creditorSection = new CreditorSection(page);
    this.assetsSection = new AssetsSection(page);
    this.jaoppSection = new JAOPPSection(page);
    this.childSupportObligationsSection = new ChildSupportObligationsSection(page);
    this.availableResourcesSection = new AvailableResourcesSection(page);
    this.debtNegotiationSection = new DebtNegotiationSection(page);
    this.attachedDocumentsSection = new AttachedDocumentsSection(page);
    this.applicationSubmissionSection = new ApplicationSubmissionSection(page);
  }

  public async createInsolvency(insolvency: InsolvencyType): Promise<void> {
    const page = this.page;
    await this.goto();

    await this.siteSection.send(insolvency.site);
    await this.debtorSection.send(insolvency.debtor);

    if (await page.locator('h2', { hasText: 'CAUSAS' }).isVisible()) {
      await this.causesSection.send(insolvency.causes);
    }
    if (await page.locator('h2', { hasText: 'ACREEDOR' }).isVisible()) {
      await this.creditorSection.send(insolvency.creditors);
    }
    if (await page.locator('h2', { hasText: 'BIENES' }).isVisible()) {
      await this.assetsSection.send(insolvency.assets);
    }
    const jaoppTitle = 'PROCESOS JUDICIALES, ADMINISTRATIVOS O PRIVADOS';
    if (await page.locator('h2', { hasText: jaoppTitle }).isVisible()) {
      await this.jaoppSection.send(insolvency.jaopp);
    }

    if (await page.locator('h2', { hasText: 'OBLIGACIONES ALIMENTARIAS' }).isVisible()) {
      await this.childSupportObligationsSection.send(insolvency.childSupportObligations);
    }

    if (await page.locator('h2', { hasText: 'RECURSOS DISPONIBLES' }).isVisible()) {
      await this.availableResourcesSection.send(insolvency.availableResources);
    }

    if (await page.locator('h2', { hasText: 'NEGOCIACIÓN DE DEUDAS' }).isVisible()) {
      await this.debtNegotiationSection.send(insolvency.debtNegotiations);
    }

    if (await page.locator('h2', { hasText: 'DOCUMENTOS ANEXOS' }).isVisible()) {
      await this.attachedDocumentsSection.send(insolvency.attachedDocuments);
    }

    try {
      // NOTE: Not automated because it requires a legal representative signature.
      await this.applicationSubmissionSection.send(insolvency.applicationSubmission);
    } catch (error) {
      console.log(
        'Cannot submit the application, requires manual signature from a legal representative.',
      );
    }

    console.log('Insolvency draft created successfully');
  }
}

export default CreateInsolvencyPage;
