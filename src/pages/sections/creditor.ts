import type { Locator, Page } from 'playwright';
import { plusSpanSelector } from '../../constants.js';
import { getDateInputSelector, getInputSelector } from '../../helpers.js';
import type {
  CreditorsType,
  LegalEntityCreditorSchemaType,
  NaturalPersonCreditorType,
} from '../../models/creditor.js';
import { LegalEntityCreditorSchema, NaturalPersonCreditorSchema } from '../../models/creditor.js';
import DebtSchema from '../../models/enums/debt-type.js';
import BaseSection from '../bases/section.js';

class CreditorSection extends BaseSection<[CreditorsType]> {
  private readonly addCreditorButton: Locator;
  private readonly unknownIdDocButton: Locator;
  private readonly submitButton: Locator;
  private readonly addIdDocFileButton: Locator;
  private readonly fileInput: Locator;
  private readonly uploadFileButton: Locator;

  constructor(page: Page) {
    super(page);
    this.addCreditorButton = page.locator('button', { hasText: 'AGREGAR ACREEDOR' });
    this.unknownIdDocButton = page.locator('button', { hasText: 'DESCONOZCO' });
    this.submitButton = page.locator('button.btn-guardar:not([disabled])', {
      hasText: 'Siguiente',
    });
    this.addIdDocFileButton = page.locator('span', { hasText: 'ANEXAR COPIA DE LA CÉDULA' }); // TODO: Find a better way to get the locator.
    this.fileInput = page.locator('input[type="file"]#undefined');
    this.uploadFileButton = page.locator('button:not([disabled])', { hasText: 'Subir' }); // TODO: Find a better way to get the locator.
  }
  public async send(creditors: CreditorsType): Promise<void> {
    const page = this.page;

    for (const creditor of creditors) {
      const linkButton: Locator = page.locator('button', { hasText: 'Vincular' });

      const personTypeInput = page.locator(getInputSelector('tipo_persona'));

      const parsedNaturalPersonCreditor = NaturalPersonCreditorSchema.safeParse(creditor);
      const isNaturalPerson = parsedNaturalPersonCreditor.success;
      const naturalPerson: NaturalPersonCreditorType | undefined = isNaturalPerson
        ? parsedNaturalPersonCreditor.data
        : undefined;

      const parsedLegalEntityCreditor = LegalEntityCreditorSchema.safeParse(creditor);
      const isLegalEntity = parsedLegalEntityCreditor.success;
      const legalEntity: LegalEntityCreditorSchemaType | undefined = isLegalEntity
        ? parsedLegalEntityCreditor.data
        : undefined;

      const naturalPersonFullName =
        [
          naturalPerson?.identificationData.firstName,
          naturalPerson?.identificationData.middleName,
          naturalPerson?.identificationData.lastName,
          naturalPerson?.identificationData.secondLastName,
        ]
          .filter(Boolean)
          .join(' ') || '';
      const fullName =
        legalEntity?.identificationData.name.replace(/\./g, ' ') || naturalPersonFullName;
      const fullNameStrong = page.locator('strong', { hasText: fullName });
      const descriptionDiv = page.locator('nz-list-item-meta-description > div > div', {
        has: fullNameStrong,
      });
      // NOTE: Find item by doc number is insecurey because the doc number is optional.
      // const docNumber = naturalPerson?.identificationData.idDoc?.number || legalEntity?.identificationData.nit;
      const itemNz = page.locator('nz-list-item', { has: descriptionDiv });
      const creditsButton = itemNz.locator(
        'nz-list-item-extra > a[nztooltiptitle="Click para ver Créditos"]',
      );

      // TODO: Check all properties before skiping, because can lack of properties when continuing a draft.
      // TODO: Another alternative if clean all and write again.
      if (await creditsButton.isVisible()) {
        continue;
      }

      const personType = isNaturalPerson ? 'Natural' : 'Jurídica';

      await this.addCreditorButton.click();
      await this.selectOption(personTypeInput, `Persona ${personType}`);

      const typeInput = page.locator(
        getInputSelector(isLegalEntity ? 'tipo_busqueda' : 'tipo_identificacion'),
      );
      const valueInput = page.locator(
        `input[formcontrolname="${isLegalEntity ? 'dato_busqueda' : 'identificacion'}"]`,
      );

      if (naturalPerson !== undefined) {
        // Identification Data

        const idData = naturalPerson.identificationData;
        const idDoc = idData.idDoc;

        if (idDoc === undefined) {
          await this.unknownIdDocButton.click();
        } else {
          await this.selectOption(typeInput, idDoc.type);
          // TODO: Min lenght is 2, allows just digits and a + or - at the start
          await valueInput.fill(idDoc.number);

          const addButton = page.locator('form button', { hasText: 'Agregar' });
          await addButton.click();
        }

        const originCountryInput = page.locator(getInputSelector('pais_origen'));
        await this.fillInput(originCountryInput, idData.originCountry);

        const DocumentIssueCityInput = page.locator(getInputSelector('ciudad_expedicion'));
        if (await DocumentIssueCityInput.isVisible()) {
          // Optional Input (goes before pais_origen, but it is more practical to put it here)
          // TODO: add issueCity property just if idDoc type is CÉDULA DE CIUDADANÍA
          // await this.fillInput(DocumentIssueCityInput, idData.idDoc.issueCity);
        }

        // NOTE: Delete all previous uploaded things, like docs or certain info with delete buttons.
        // NOTE: This is because once debtor is linked, page will always remember the debtor.
        const deleteButtons = await page.locator('i[nztype="delete"]').all();
        for (const deleteButton of deleteButtons) {
          await deleteButton.click();
        }

        const firstNameInput = page.locator('input[formcontrolname="primer_nombre"]');
        const middleNameInput = page.locator('input[formcontrolname="segundo_nombre"]');
        const lastNameInput = page.locator('input[formcontrolname="primer_apellido"]');
        const secondLastNameInput = page.locator('input[formcontrolname="segundo_apellido"]');

        await firstNameInput.fill(idData.firstName);
        if (idData.middleName) {
          await middleNameInput.fill(idData.middleName);
        }
        await lastNameInput.fill(idData.lastName);
        if (idData.secondLastName) {
          await secondLastNameInput.fill(idData.secondLastName);
        }

        // TODO: const docFilePath = idData.idDoc.filePath;
        const docFilePath = undefined;
        if (docFilePath !== undefined) {
          await this.addIdDocFileButton.click();
          await this.fileInput.setInputFiles(docFilePath);
          await this.uploadFileButton.click();
        }

        const genderInput = page.locator(getInputSelector('genero'));
        await this.selectOption(genderInput, idData.gender);

        const civilStatusInput = page.locator(getInputSelector('estado_civil'));
        if (idData.civilStatus !== undefined) {
          await this.selectOption(civilStatusInput, idData.civilStatus);
        }

        const birthDateInput = page.locator(getDateInputSelector('fecha_nacimiento'));
        await this.fillDateInput(birthDateInput, idData.birthDate);

        const ethnicityInput = page.locator(getInputSelector('etnia'));
        if (idData.ethnicity !== undefined) {
          await this.selectOption(ethnicityInput, idData.ethnicity);
        }

        const disabilityInput = page.locator(getInputSelector('discapacidad'));
        if (idData.disability !== undefined) {
          await this.selectOption(disabilityInput, idData.disability);
        }

        // Contact Information

        const contactInformation = naturalPerson.contactInformation;

        const residenceCountryInput = page.locator(getInputSelector('pais_residencia'));
        await this.fillInput(residenceCountryInput, contactInformation.residenceCountry);

        const departmentInput = page.locator(getInputSelector('departamento'));
        await this.fillInput(departmentInput, contactInformation.department);

        const cityInput = page.locator(getInputSelector('ciudad'));
        await this.fillInput(cityInput, contactInformation.city);

        const judicialnotificationAddress = contactInformation.judicialNotificationAddress;
        const addressOrReason = judicialnotificationAddress?.addressOrReason;

        const unknownAddressButton = page.locator('label[formcontrolname="conoce_direccion"]');
        const unknownAddressButtonIsChecked = await unknownAddressButton
          .locator('input')
          .isChecked();
        if (typeof addressOrReason === 'string') {
          if (!unknownAddressButtonIsChecked) {
            await unknownAddressButton.click();
          }

          if (addressOrReason.trim() !== '') {
            const unknownAddressReasonTextarea = page.locator(
              'textarea[formcontrolname="motivo_direccion"]',
            );
            await unknownAddressReasonTextarea.fill(addressOrReason);
          }
        } else if (addressOrReason && typeof addressOrReason === 'object') {
          const roadTypeInput = page.locator(getInputSelector('razon_social'));
          if (unknownAddressButtonIsChecked) {
            await unknownAddressButton.click();
          }
          if (addressOrReason.roadType !== undefined) {
            await this.selectOption(roadTypeInput, addressOrReason.roadType);
          }

          const roadNameInput = page.locator('input[formcontrolname="a1"]');
          if (addressOrReason.roadName) {
            await roadNameInput.fill(addressOrReason.roadName);
          }

          const roadNumberInput = page.locator('input[formcontrolname="a2"]');
          if (addressOrReason.roadNumber !== undefined) {
            await roadNumberInput.fill(addressOrReason.roadNumber);
          }

          const roadSubNumberInput = page.locator('input[formcontrolname="a3"]');
          if (addressOrReason.roadSubNumber !== undefined) {
            await roadSubNumberInput.fill(addressOrReason.roadSubNumber);
          }

          const roadDetailsInput = page.locator('input[formcontrolname="detalle_direccion"]');
          if (addressOrReason.roadDetails) {
            await roadDetailsInput.fill(addressOrReason.roadDetails);
          }
        }
        const roadStratumInput = page.locator(getInputSelector('estrato'));
        if (judicialnotificationAddress && judicialnotificationAddress.roadStratum !== undefined) {
          await this.selectOption(roadStratumInput, judicialnotificationAddress.roadStratum);
        }

        const telephones = contactInformation.telephones || [];
        let telephoneIndex: number = 0; // TODO: Up to 3.
        for (const telephone of telephones) {
          telephoneIndex++;
          const telephoneInput: Locator = page.locator(
            `[placeholder="Teléfono de contacto ${telephoneIndex}"]`,
          );
          await telephoneInput.fill(telephone);
          if (telephoneIndex === 1) {
            await telephoneInput.locator(plusSpanSelector).click();
          }
        }
        const cellphones = contactInformation.cellphones || [];
        let cellphoneIndex: number = 0; // TODO: Up to 3.
        for (const cellphone of cellphones) {
          cellphoneIndex++;
          const cellphoneInput: Locator = page.locator(
            `[placeholder="Celular de contacto ${cellphoneIndex}"]`,
          );
          await cellphoneInput.fill(cellphone);
          if (cellphoneIndex === 1) {
            await cellphoneInput.locator(plusSpanSelector).click();
          }
        }
        const unknownEmailButton: Locator = page.locator('label[formcontrolname="conoce_email"]');
        const reasonIsChecked: boolean = await unknownEmailButton.locator('input').isChecked();
        const emailsOrReason = contactInformation.emailsOrReason || [];
        if (Array.isArray(emailsOrReason)) {
          // value is string[]
          if (reasonIsChecked) {
            await unknownEmailButton.click();
          }
          let emailIndex: number = 0; // TODO: Up to 3.
          for (const email of emailsOrReason) {
            emailIndex++;
            const emailInput: Locator = page.locator(`[placeholder="Email ${emailIndex}"]`);
            await emailInput.fill(email);
            if (emailIndex === 1) {
              await emailInput.locator(plusSpanSelector).click();
            }
          }
        } else {
          // value is string
          if (!reasonIsChecked) {
            await unknownEmailButton.click();
            const textareaReason = page.locator('textarea[formcontrolname="motivo_email"]');
            await textareaReason.fill(emailsOrReason);
          }
        }
        const webPages = contactInformation.webPages || [];
        let webPageIndex: number = 0;
        for (const webPage of webPages) {
          webPageIndex++;
          const webPageInput: Locator = page.locator(`[placeholder="Pagina Web ${webPageIndex}"]`);
          await webPageInput.fill(webPage);
          if (webPageIndex === 1) {
            await webPageInput.locator(plusSpanSelector).click();
          }
        }

        // Study Data

        const schoolLevelInput: Locator = page.locator(getInputSelector('nivel_escolar'));
        await this.selectOption(schoolLevelInput, naturalPerson.schoolLevel);

        // TODO: === Profession Data ===

        const professions = naturalPerson.professions || [];

        const professionNameInput = page.locator('input[formcontrolname="nombre_profesion"]');
        const institutionInput = page.locator('input[formcontrolname="institucion"]');
        const professionalCardNumberInput = page.locator(
          'input[formcontrolname="tarjeta_profesional"]',
        );
        const degreeIssuingEntityInput = page.locator(
          'input[formcontrolname="entidad_emisora_titulo"]',
        );
        const graduationDateInput = page.locator('input[formcontrolname="fecha_graduacion"]');
        const addProfessionButton = page.locator('button', { hasText: 'AGREGAR PROFESIÓN' });

        for (const profession of professions) {
          await this.fillInput(professionNameInput, profession.name);
          if (profession.institution !== undefined) {
            await this.fillInput(institutionInput, profession.institution);
          }
          if (profession.professionalCardNumber !== undefined) {
            await professionalCardNumberInput.fill(profession.professionalCardNumber.toString());
          }
          if (profession.degreeIssuingEntity !== undefined) {
            await degreeIssuingEntityInput.fill(profession.degreeIssuingEntity);
          }
          if (profession.graduationDate !== undefined) {
            await this.fillDateInput(graduationDateInput, profession.graduationDate);
          }
          await addProfessionButton.click();
          await page.waitForTimeout(500); // TODO: find a better way to wait for profession to be added.
        }

        // TODO: === Extra Data ===

        // TODO: Optional: Debtor relationship
        // TODO: Optional: Debtor relationship description

        // NOTE: Sometimes link buttons works, but doesnt add the creditor.
        await linkButton.click();
        await graduationDateInput.waitFor({ state: 'detached' });
      } else if (legalEntity !== undefined) {
        // Identification Data

        if (legalEntity.identificationData.nit === undefined) {
          await this.unknownIdDocButton.click();
        } else {
          await this.selectOption(typeInput, 'NIT');
          // TODO: Min lenght is 2, allows just digits and a + or - at the start
          await valueInput.fill(legalEntity.identificationData.nit.toString());

          const addButton = page.locator('form button', { hasText: 'Agregar' });
          await addButton.click();
        }

        // NOTE: Delete all previous uploaded things, like docs or certain info with delete buttons.
        // NOTE: This is because once debtor is linked, page will always remember the debtor.
        const deleteButtons = await page.locator('i[nztype="delete"]').all();
        for (const deleteButton of deleteButtons) {
          await deleteButton.click();
        }

        // NOTE: Ignore identificativo input because it its needed, it is like document number, but it is set into the nit input.

        const identificationData = legalEntity.identificationData;

        const nameInput: Locator = page.locator('input[formcontrolname="nombre"]');
        await nameInput.fill(identificationData.name);

        const economicSectorInput: Locator = page.locator(getInputSelector('sector_economico'));
        await this.fillInput(economicSectorInput, identificationData.economicSector);

        const organizationTypeInput: Locator = page.locator(getInputSelector('tipo_organizacion'));
        await this.fillInput(organizationTypeInput, identificationData.organizationType);

        const originCountryInput: Locator = page.locator(getInputSelector('pais_origen'));
        await this.fillInput(originCountryInput, identificationData.originCountry);

        // TODO: Optional: Allow to upload 'CERTIFICADO DE EXISTENCIA Y REPRESENTACIÓN LEGAL'

        const contactInformation = legalEntity.contactInformation;

        const residenceCountryInput = page.locator(getInputSelector('pais_residencia'));
        await this.fillInput(residenceCountryInput, contactInformation.residenceCountry);

        const departmentInput = page.locator(getInputSelector('departamento'));
        await this.fillInput(departmentInput, contactInformation.department);

        const cityInput = page.locator(getInputSelector('ciudad'));
        await this.fillInput(cityInput, contactInformation.city);

        // conoce_direccion
        const unknownAddressButton: Locator = page.locator(
          'label[formcontrolname="conoce_direccion"]',
        );
        const unknownAddressButtonIsChecked: boolean = await unknownAddressButton
          .locator('input')
          .isChecked();
        if (contactInformation.judicialNotificationAddress !== undefined) {
          if (unknownAddressButtonIsChecked) {
            await unknownAddressButton.click();
          }
          const judicialNotificationAddressInput = page.locator(
            'input[formcontrolname="direccion"]',
          );
          await judicialNotificationAddressInput.fill(
            contactInformation.judicialNotificationAddress,
          );
        } else if (contactInformation.unknownJudicialNotificationAddressReason !== undefined) {
          if (!unknownAddressButtonIsChecked) {
            await unknownAddressButton.click();
          }
          const judicialNotificationAddressTextarea = page.locator(
            'textarea[formcontrolname="motivo_direccion"]',
          );
          await judicialNotificationAddressTextarea.fill(
            contactInformation.unknownJudicialNotificationAddressReason,
          );
        }

        const telephones = contactInformation.telephones || [];
        let telephoneIndex: number = 0; // TODO: Up to 3.
        for (const telephone of telephones) {
          telephoneIndex++;
          const telephoneInput: Locator = page.locator(
            `[placeholder="Teléfono de contacto ${telephoneIndex}"]`,
          );
          await telephoneInput.fill(telephone);
          if (telephoneIndex === 1) {
            await telephoneInput.locator(plusSpanSelector).click();
          }
        }
        const cellphones = contactInformation.cellphones || [];
        let cellphoneIndex: number = 0; // TODO: Up to 3.
        for (const cellphone of cellphones) {
          cellphoneIndex++;
          const cellphoneInput: Locator = page.locator(
            `[placeholder="Celular de contacto ${cellphoneIndex}"]`,
          );
          await cellphoneInput.fill(cellphone);
          if (cellphoneIndex === 1) {
            await cellphoneInput.locator(plusSpanSelector).click();
          }
        }
        const unknownEmailButton: Locator = page.locator('label[formcontrolname="conoce_email"]');
        const reasonIsChecked: boolean = await unknownEmailButton.locator('input').isChecked();
        const emailsOrReason = contactInformation.emailsOrReason || [];
        if (Array.isArray(emailsOrReason) && emailsOrReason.length > 0) {
          // value is string[]
          if (reasonIsChecked) {
            await unknownEmailButton.click();
          }
          let emailIndex: number = 0; // TODO: Up to 3.
          for (const email of emailsOrReason) {
            emailIndex++;
            const emailInput: Locator = page.locator(`[placeholder="Email ${emailIndex}"]`);
            await emailInput.fill(email);
            if (emailIndex === 1) {
              await emailInput.locator(plusSpanSelector).click();
            }
          }
        } else if (Array.isArray(emailsOrReason) && emailsOrReason.length === 0) {
          if (!reasonIsChecked) {
            await unknownEmailButton.click();
          }
        } else if (typeof emailsOrReason === 'string') {
          // value is string
          if (!reasonIsChecked) {
            await unknownEmailButton.click();
            const textareaReason = page.locator('textarea[formcontrolname="motivo_email"]');
            await textareaReason.fill(emailsOrReason);
          }
        } else {
          throw new Error('Assertion failed.');
        }
        const webPages = contactInformation.webPages || [];
        let webPageIndex: number = 0;
        for (const webPage of webPages) {
          webPageIndex++;
          const webPageInput: Locator = page.locator(`[placeholder="Pagina Web ${webPageIndex}"]`);
          await webPageInput.fill(webPage);
          if (webPageIndex === 1) {
            await webPageInput.locator(plusSpanSelector).click();
          }
        }

        await linkButton.click();
        await unknownEmailButton.waitFor({ state: 'detached' });
      } else {
        throw new Error('Assertion failed.');
      }

      // === Add credits ===

      await page.waitForTimeout(1_000); // TODO: find a better way to wait

      if (!(await creditsButton.isVisible())) {
        // Try to reload the page if the creditor is not visible by a bug.
        await this.goToDraft();

        if (!(await creditsButton.isVisible())) {
          throw new Error(
            'Added creditor is not visible, continue from the draft of the creditor (you must go out of this page first).',
          ); // TODO: Make the wrapper do this instead of throwing an error.
        }
      }

      await creditsButton.click();

      for (const credit of creditor.credits) {
        const addNewCreditButton: Locator = page.locator('button', {
          hasText: 'AÑADIR NUEVO CRÉDITO',
        });
        await addNewCreditButton.click();

        // === Credit Information ===
        const debtTypeResult = DebtSchema.safeParse(credit.debtType);
        const debtType: string = debtTypeResult.success ? debtTypeResult.data : 'Otro';

        const debtTypeInput: Locator = page.locator(getInputSelector('tipoAcreencia'));
        await this.selectOption(debtTypeInput, debtType);

        const typeNameInput: Locator = page.locator('input[formcontrolname="nombreTipoAcreencia"]');
        if (await typeNameInput.isVisible()) {
          await typeNameInput.fill(credit.debtType);
        }

        const creditNatureInput: Locator = page.locator(getInputSelector('naturalezaCredito'));
        await this.fillInput(creditNatureInput, credit.creditNature);
        

        // TODO: Condición de crédito legalmente postergado (Artículo 572A, Causal 1).

        // TODO: Description.

        // === Debt Amount ===

        const capitalInput: Locator = page.locator('input[formcontrolname="capital"]');
        await capitalInput.fill(credit.capital.toString());

        // TODO: Ordinary Interest: (total value, rate and type)

        // TODO: Grant Date.

        const expirationDateInput: Locator = page.locator(
          getDateInputSelector('fechaVencimientoCredito'),
        );

        //desconoceFechaVencimiento
        const unknownExpirationDate: Locator = page.locator(
          'label[formcontrolname="desconoceFechaVencimiento"]',
        );
        const unknownExpirationDateIsChecked = await unknownExpirationDate
          .locator('input')
          .isChecked();

        const creditExpirationDate: string =
          typeof credit.creditExpirationDateOrDaysPastDue === 'string'
            ? credit.creditExpirationDateOrDaysPastDue
            : '';
        const daysPastDue =
          typeof credit.creditExpirationDateOrDaysPastDue === 'number'
            ? credit.creditExpirationDateOrDaysPastDue
            : 0;

        if (creditExpirationDate === '') {
          if (!unknownExpirationDateIsChecked) {
            await unknownExpirationDate.click();
          }
        } else {
          if (unknownExpirationDateIsChecked) {
            await unknownExpirationDate.click();
          }
          await this.fillDateInput(expirationDateInput, creditExpirationDate);
        }

        // TODO: === Obligaciones derivadas de otros conceptos causados distintos al capital ===

        // === Loan Default Description ===

        // TODO: ¿El pago del crédito se está realizando mediante libranza o cualquier otro tipo de descuento por nómina?

        const daysPastDueInput: Locator = page.locator('input[formcontrolname="diasMora"]');
        const isDefaultCreditButton: Locator = page.locator('label[formcontrolname="creditoMora"]');
        const isDefaultCreditIsChecked = await isDefaultCreditButton.locator('input').isChecked();
        if (daysPastDue > 0) {
          if (!isDefaultCreditIsChecked) {
            await isDefaultCreditButton.click();
          }
          const isMoreThan90DaysButton: Locator = page.locator(
            'label[formcontrolname="mora90Dias"]',
          );
          const isMoreThan90DaysIsChecked = await isMoreThan90DaysButton
            .locator('input')
            .isChecked();
          if (daysPastDue > 90) {
            if (!isMoreThan90DaysIsChecked) {
              await isMoreThan90DaysButton.click();
            }
          } else {
            if (isMoreThan90DaysIsChecked) {
              await isMoreThan90DaysButton.click();
            }
            await daysPastDueInput.fill(daysPastDue.toString());
          }
        } else {
          if (isDefaultCreditIsChecked && creditExpirationDate === '') {
            await isDefaultCreditButton.click();
          }
        }

        const saveCreditButton: Locator = page.locator('button', { hasText: 'GUARDAR CRÉDITO' });
        await saveCreditButton.click();
        await debtTypeInput.waitFor({ state: 'detached' });

        // TODO: Add the posibility to add a existing credits (as an alternative to new credits).
      }

      const closeCreditsFormButton: Locator = page.locator('button[aria-label="Close"]');
      await closeCreditsFormButton.click();
      await closeCreditsFormButton.waitFor({ state: 'detached' });

      // NOTE: It is posibble to replace creditor's data, but won't be implemented for now because it is not needed.

      // TODO: Allow the posibility to add representatives.
      // TODO: Allow the posibility to add legal representatives.
    }
    await this.submitButton.click();
    await page.locator('h2', { hasText: 'BIENES' }).waitFor();
  }
}

export default CreditorSection;
