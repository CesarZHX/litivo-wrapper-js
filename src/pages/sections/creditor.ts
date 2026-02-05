import BaseSection from '../bases/section.js';

/** TODO: Creditor (feat: extend create insolvency method with creditor section) */
class CreditorSection extends BaseSection<[unknown]> {
  public async send(creditor: unknown): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default CreditorSection;
