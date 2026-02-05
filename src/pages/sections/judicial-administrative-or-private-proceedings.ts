import BaseSection from '../bases/section.js';

/** TODO: Judicial, Administrative, or Private Proceedings (feat: extend create insolvency method with judicial, administrative, or private proceedings section) */
class JudicialAdministrativeOrPrivateProceedingsSection extends BaseSection<[unknown]> {
  public async send(judicialAdministrativeOrPrivateProceedings: unknown): Promise<void> {
    throw new Error('Method not implemented.');
  }
}

class JAOPPSection extends JudicialAdministrativeOrPrivateProceedingsSection {}

export default JAOPPSection;
