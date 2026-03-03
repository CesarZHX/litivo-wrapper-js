import type { Locator, Page } from 'playwright';
import { getInputSelector } from '../../helpers.js';
import {
  JaoppAdministrativeSchema,
  JaoppJudicialSchema,
  JaoppPrivateSchema,
  type JaoppType,
} from '../../models/jaopp.js';
import BaseSection from '../bases/section.js';

class JudicialAdministrativeOrPrivateProceedingsSection extends BaseSection<[JaoppType]> {
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.locator('button.btn-guardar:not([disabled])', {
      hasText: 'Siguiente',
    });
  }

  public async send(
    judicialAdministrativeOrPrivateProceedings: JaoppType | undefined = [],
  ): Promise<void> {
    const page = this.page;

    async function selectOption(locator: Locator, option: string): Promise<void> {
      await locator.click();
      const optionDiv = page.locator('nz-option-item', { hasText: option });
      await optionDiv.click();
      await optionDiv.waitFor({ state: 'detached' });
    }
    try {
      for (const proceeding of judicialAdministrativeOrPrivateProceedings || []) {
        const addNewProcessButton = page.locator('button', { hasText: 'AGREGAR NUEVO PROCESO' });
        await addNewProcessButton.click();

        const parsedJudicialProceeding = JaoppJudicialSchema.safeParse(proceeding);
        const judicialProceeding = parsedJudicialProceeding.success
          ? parsedJudicialProceeding.data
          : undefined;
        const parsedPrivateProceeding = JaoppPrivateSchema.safeParse(proceeding);
        const privateProceeding = parsedPrivateProceeding.success
          ? parsedPrivateProceeding.data
          : undefined;
        const parsedAdministrativeProceeding = JaoppAdministrativeSchema.safeParse(proceeding);
        const administrativeProceeding = parsedAdministrativeProceeding.success
          ? parsedAdministrativeProceeding.data
          : undefined;

        const proceedingTypeInput = page.locator('nz-select[nzplaceholder="Tipo de Proceso"]');
        const processType: string =
          judicialProceeding !== undefined
            ? 'Judicial'
            : privateProceeding
              ? 'Privado'
              : 'Administrativo';
        await selectOption(proceedingTypeInput, processType);

        const inFavorOrAgainstButton = page.locator('button', {
          hasText: proceeding.defendant ? 'A FAVOR' : 'EN CONTRA',
        });
        await inFavorOrAgainstButton.click();

        const processTypeInput = page.locator(getInputSelector('tipoProceso'));
        await this.selectOption(processTypeInput, proceeding.processType);

        const entityInChargeInput = page.locator('input[formcontrolname="tipoJuzgado"]');
        const entityInCharge =
          judicialProceeding?.fullCourtNumberAndCourtType ||
          (privateProceeding || administrativeProceeding)?.entityNameOrPersonInCharge ||
          ''; // NOTE: entityInCharge is never an empty string
        await entityInChargeInput.fill(entityInCharge);

        const descriptionTextarea = page.locator('textarea[formcontrolname="descripcion"]');
        const description = (privateProceeding || administrativeProceeding)?.description;
        if (description !== undefined) {
          await descriptionTextarea.fill(description);
        }

        // NOTE: Idk how to translate this to english
        const radicationNumberInput = page.locator('input[formcontrolname="numeroRadicacion"]');
        if (judicialProceeding !== undefined) {
          await radicationNumberInput.fill(judicialProceeding.radicationNumber);
        } else {
          const radicationNumber = (privateProceeding || administrativeProceeding)?.radicationNumber;
          if (radicationNumber !== undefined) {
            await radicationNumberInput.fill(radicationNumber);
          }
        }

        const departmentInput = page.locator(getInputSelector('departamento'));
        await this.fillInput(departmentInput, proceeding.department);

        const cityInput = page.locator(getInputSelector('ciudad'));
        await this.fillInput(cityInput, proceeding.city);

        const address =
          judicialProceeding?.courtAddress ||
          (privateProceeding || administrativeProceeding)?.address;
        if (address !== undefined) {
          if (address.roadType !== undefined) {
            const roadTypeInput = page.locator(getInputSelector('razonSocial'));
            await this.selectOption(roadTypeInput, address.roadType);
          }
          if (address.roadName !== undefined) {
            const roadNameInput = page.locator('input[formcontrolname="a1"]');
            await roadNameInput.fill(address.roadName);
          }
          if (address.roadNumber !== undefined) {
            const roadNumberInput = page.locator('input[formcontrolname="a2"]');
            await roadNumberInput.fill(address.roadNumber);
          }
          if (address.roadSubNumber !== undefined) {
            const roadSubNumberInput = page.locator('input[formcontrolname="a3"]');
            await roadSubNumberInput.fill(address.roadSubNumber);
          }
          if (address.roadDetails !== undefined) {
            const roadDetailsInput = page.locator('input[formcontrolname="detalleDireccion"]');
            await roadDetailsInput.fill(address.roadDetails);
          }
        }

        const emailInput = page.locator('input[formcontrolname="email"]');
        await emailInput.fill(proceeding.email);

        if (proceeding.defendant !== undefined) {
          const defendantInput = page.locator('input[formcontrolname="demandado"]');
          await defendantInput.fill(proceeding.defendant);
        }
        if (proceeding.plaintiffs !== undefined) {
          const plaintiffInput = page.locator('input[formcontrolname="demandante"]');
          const creditoRow = page.locator('tr.ant-table-row ng-star-inserted', {
            has: page.locator('td'),
          });
          const creditors = await creditoRow
            .locator('td', { has: page.locator('> i > svg') })
            .allInnerTexts();
          for (const plaintiff of proceeding.plaintiffs) {
            if (proceeding.plaintiffsAreCreditors === true) {
              // TODO: Check these asserts just once.
              if (creditors.length === 0) {
                throw new Error('There are no creditors.');
              }
              if (proceeding.plaintiffs.length > creditors.length) {
                throw new Error(
                  `Number of plaintiffs (${proceeding.plaintiffs.length}) cannot be higher than number of creditors (${creditors.length}).`,
                );
              }
              const nzSwitch = page.locator('nz-switch');
              await nzSwitch.click();
              await page.waitForTimeout(1_000);
              const creditorData = creditoRow.locator('td', { hasText: plaintiff });
              const creditorCheckbox = creditorData.locator('input[type="checkbox"]');
              if (await creditorData.isVisible()) {
                await creditorCheckbox.click();
                await plaintiffInput.press('Enter');
              } else {
                throw new Error(
                  `Plaintiff ${plaintiff} is not a creditor, cannot fill the plaintiff input.`,
                );
              }
            } else {
              const plaintiffTextarea = page.locator('textarea[formcontrolname="demandante"]');
              const plaintiffString = proceeding.plaintiffs.join(', ');
              await plaintiffTextarea.fill(plaintiffString);
            }
          }
        } // NOTE: This acts as an else for the former if clause.

        const processStatusInput = page.locator(getInputSelector('estadoProceso'));
        if (judicialProceeding !== undefined) {
          await this.fillInput(processStatusInput, judicialProceeding.processStatus);
        } else {
          const processStatus =
            privateProceeding?.processStatus || administrativeProceeding?.processStatus;
          if (processStatus !== undefined) {
            await this.fillInput(processStatusInput, processStatus);
          }
        }

        const valueInput = page.locator('input[formcontrolname="valorProceso"]');
        await valueInput.fill(proceeding.value.toString());

        const supportFileNameInput = page.locator('input[formcontrolname="nombreArchivoSoporte"]');
        if (proceeding.suportFile?.name !== undefined) {
          await supportFileNameInput.fill(proceeding.suportFile.name);
        }
        if (proceeding.suportFile?.path !== undefined) {
          this.uploadFile('AGREGAR ARCHIVO DE SOPORTE', proceeding.suportFile.path);
        }

        const saveButton = page.locator('button', { hasText: 'GUARDAR' });
        await saveButton.click();
        await saveButton.waitFor({ state: 'detached' });
      }
      await this.submitButton.click();
      await page.locator('h2', { hasText: 'OBLIGACIONES ALIMENTARIAS' }).waitFor();
    } catch (e) {
      await this.deleteDraft().catch((deleteError) => {
        console.error('Failed to delete draft after error in send:', deleteError);
      });

      console.error('Error in JudicialAdministrativeOrPrivateProceedingsSection.send:', e);
      throw e;
    }
  }
}

class JAOPPSection extends JudicialAdministrativeOrPrivateProceedingsSection { }

export default JAOPPSection;
