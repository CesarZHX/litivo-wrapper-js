import BaseSection from '../bases/section.js';

/** TODO: Child Support Obligations (feat: extend create insolvency method with child support obligations section) */
class ChildSupportObligationsSection extends BaseSection<[unknown]> {
  public async send(childSupportObligations: unknown): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default ChildSupportObligationsSection;
