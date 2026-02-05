import BaseSection from '../bases/section.js';

/** TODO: Application Submission (feat: extend create insolvency method with application submission section) */
class ApplicationSubmissionSection extends BaseSection<[unknown]> {
  public async send(applicationSubmission: unknown): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

export default ApplicationSubmissionSection;
