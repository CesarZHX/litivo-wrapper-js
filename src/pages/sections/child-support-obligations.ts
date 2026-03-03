import type { Locator, Page } from 'playwright';
import { plusSpanSelector } from '../../constants.js';
import { checkCheckBox, getInputSelector } from '../../helpers.js';
import type {
  BeneficiaryType,
  ChildSupportObligationsType,
} from '../../models/child-support-obligation.js';
import BaseSection from '../bases/section.js';

/** TODO: Child Support Obligations (feat: extend create insolvency method with child support obligations section)
 * Check that this schema is documented within the example insolvency json file before committing
 */
class ChildSupportObligationsSection extends BaseSection<[ChildSupportObligationsType]> {
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.locator('button.btn-guardar:not([disabled])', {
      hasText: 'Siguiente',
    });
  }
  private async addBeneficiary(beneficiary: BeneficiaryType): Promise<void> {
    const page = this.page;
    const addBeneficiaryButton = page.locator('button', {
      hasText: 'AGREGAR PERSONA',
    });
    const idDocTypeInput = page.locator(getInputSelector('tipoIdentificacion'));
    const idDocNumberInput = page.locator("input[formcontrolname='numeroIdentificacion']");
    const searchButton = page.locator('button', {
      hasText: 'BUSCAR',
    });
    const originCountryInput = page.locator(getInputSelector('paisOrigen'));
    const nameInput = page.locator("input[formcontrolname='nombre1']");
    const lastNameInput = page.locator("input[formcontrolname='apellido1']");
    const genderInput = page.locator(getInputSelector('genero'));
    const saveBeneficiaryButton = page
      .locator('button', {
        hasText: 'GUARDAR',
      })
      .last();

    await addBeneficiaryButton.click();

    await this.fillInput(idDocTypeInput, beneficiary.idDoc.type);
    await idDocNumberInput.fill(beneficiary.idDoc.value);
    await searchButton.click();

    await this.fillInput(originCountryInput, beneficiary.originCountry);
    await nameInput.fill(beneficiary.firstName);
    await lastNameInput.fill(beneficiary.lastName);
    await this.selectOption(genderInput, beneficiary.gender);

    // TODO: Convertir en reutilizable, se repite en debtorSection
    const contactInformation = beneficiary.contactInformation;

    const residenceCountryInput = page.locator(getInputSelector('paisResidencia'));
    const departmentInput = page.locator(getInputSelector('departamento'));
    const cityInput = page.locator(getInputSelector('ciudad'));
    const unknownEmailButton: Locator = page.locator('label[formcontrolname="conoceEmail"]');
    const reasonIsChecked: boolean = await unknownEmailButton.locator('input').isChecked();
    const emailsOrReason = contactInformation.emailsOrReason;

    await this.fillInput(residenceCountryInput, contactInformation.residenceCountry);
    await this.fillInput(departmentInput, contactInformation.department);
    await this.fillInput(cityInput, contactInformation.city);

    if (Array.isArray(emailsOrReason)) {
      // value is string[]
      if (reasonIsChecked) {
        await unknownEmailButton.click();
      }
      let emailIndex: number = 0; // TODO: Up to 3.
      for (const email of emailsOrReason) {
        emailIndex++;
        const emailInput: Locator = page.locator(`[formcontrolname="email${emailIndex}"]`);
        await emailInput.fill(email);
        if (emailIndex === 1) {
          await emailInput.locator(plusSpanSelector).click();
        }
      }
    } else {
      // value is string
      if (!reasonIsChecked) {
        await unknownEmailButton.click();
      }
      const textareaReason = page.locator('textarea[formcontrolname="razonDesconoceEmail"]');
      await textareaReason.fill(emailsOrReason);
    }

    await saveBeneficiaryButton.click();
  }

  public async send(
    childSupportObligations: ChildSupportObligationsType | undefined = [],
  ): Promise<void> {
    const page = this.page;
    const addChildSupportObligationButton = page.locator('button', {
      hasText: 'AGREGAR OBLIGACIÓN ALIMENTARIA',
    });

    try {
      for (const childSupportObligation of childSupportObligations || []) {
        await addChildSupportObligationButton.click();

        const cuantiaInput = page.locator("input[formcontrolname='cuantiaObligacion']");
        const paymentFrequencyInput = page.locator(getInputSelector('periodoPago'));
        const parentalRelationshipInput = page.locator(getInputSelector('relacionDeudor'));
        const saveButton = page.locator('button', {
          hasText: 'GUARDAR',
        });

        await this.addBeneficiary(childSupportObligation.beneficiary);
        if (childSupportObligation.isSued) {
          await checkCheckBox(page, 'swObligacion');
        }
        await cuantiaInput.fill(childSupportObligation.amount.toString());
        await this.selectOption(paymentFrequencyInput, childSupportObligation.paymentFrequency);
        await this.uploadFile('ANEXAR CERTIFICADO REDAM', childSupportObligation.redamFilePath);
        await this.selectOption(
          parentalRelationshipInput,
          childSupportObligation.parentalRelationship,
        );

        await saveButton.click();
      }

      await this.submitButton.click();
      await page.locator('h2', { hasText: 'RECURSOS DISPONIBLES' }).waitFor();
    } catch (e) {
      await this.deleteDraft().catch((deleteError) => {
        console.error('Failed to delete draft after error in send:', deleteError);
      });
      console.error('Error in ChildSupportObligationsSection.send:', e);
      throw e;
    }
  }
}
export default ChildSupportObligationsSection;
