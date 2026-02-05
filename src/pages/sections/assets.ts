import BaseSection from '../bases/section.js';

/** TODO: Assets (feat: extend create insolvency method with assets section) */
class AssetsSection extends BaseSection<[unknown]> {
  public async send(assets: unknown): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default AssetsSection;
