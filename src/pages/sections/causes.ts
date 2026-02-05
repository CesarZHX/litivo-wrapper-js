import BaseSection from '../bases/section.js';

/** TODO: Causes (feat: extend create insolvency method with causes section) */
class CausesSection extends BaseSection<[unknown]> {
  public async send(causes: unknown): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default CausesSection;
