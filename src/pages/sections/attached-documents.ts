import BaseSection from '../bases/section.js';

/** TODO: Attached Documents (feat: extend create insolvency method with attached documents section) */
class AttachedDocumentsSection extends BaseSection<[unknown]> {
  public async send(AttachedDocuments: unknown): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default AttachedDocumentsSection;
