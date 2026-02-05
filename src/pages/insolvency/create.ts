import type { Page } from 'playwright';
import { wrapperUrl } from '../../constants.js';
import type { InsolvencyType } from '../../models/insolvency.js';
import FootedPage from '../bases/footed.js';
// Sections
import ApplicationSubmissionSection from '../sections/application-submission.js';
import AssetsSection from '../sections/assets.js';
import AttachedDocumentsSection from '../sections/attached-documents.js';
import AvailableResourcesSection from '../sections/available-resources.js';
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
    await this.goto();
    await this.siteSection.send(insolvency.site);
    await this.debtorSection.send(insolvency.debtors);

    throw new Error('Method not fullyimplemented yet.');

    await this.causesSection.send(insolvency.causes);
    await this.creditorSection.send(insolvency.creditor);
    await this.assetsSection.send(insolvency.assets);
    await this.jaoppSection.send(insolvency.jaopp);
    await this.childSupportObligationsSection.send(insolvency.childSupportObligations);
    await this.availableResourcesSection.send(insolvency.availableResources);
    await this.debtNegotiationSection.send(insolvency.debtNegotiation);
    await this.attachedDocumentsSection.send(insolvency.attachedDocuments);
    await this.applicationSubmissionSection.send(insolvency.applicationSubmission);
  }
}

export default CreateInsolvencyPage;
