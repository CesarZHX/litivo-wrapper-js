import BaseSection from '../bases/section.js';

/** TODO: Debt Negotiation (feat: extend create insolvency method with debt negotiation section) */
class DebtNegotiationSection extends BaseSection<[unknown]> {
  public async send(debtNegotiation: unknown): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default DebtNegotiationSection;
