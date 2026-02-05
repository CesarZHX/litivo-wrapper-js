import BaseSection from '../bases/section.js';

/** TODO: Available Resources (feat: extend create insolvency method with available resources section) */
class AvailableResourcesSection extends BaseSection<[unknown]> {
  public async send(availableResources: unknown): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default AvailableResourcesSection;
