import type { Locator, Page } from 'playwright';
import { fillJudicialNotificationAddress, getInputSelector } from '../../../helpers.js';
import {
  type AssetInmuebleType,
  type AssetMuebleType,
  type AssetsType,
} from '../../../models/assets.js';
import BaseSection from '../../bases/section.js';
import { isAssetMuebleType, isAssetVehicularType } from './helpers.js';

/** TODO: Assets (feat: extend create insolvency method with assets section)
 * Check that this schema is documented within the example insolvency json file before committing
 */
class AssetsSection extends BaseSection<[AssetsType]> {
  private readonly submitButton: Locator;
  private readonly mueblesButton: Locator;
  private readonly inmueblesButton: Locator;

  constructor(page: Page) {
    super(page);
    this.mueblesButton = page.locator('button[nztooltiptitle="Agregar Bien Mueble"]');
    this.inmueblesButton = page.locator('button[nztooltiptitle="Agregar Bien Inmueble"]');
    this.submitButton = page.locator('button.btn-guardar:not([disabled])', {
      hasText: 'Siguiente',
    });
  }

  // TODO: Check if it is ok to accept AssetsType or AssetsType.optional()

  private async addAssetMueble(asset: AssetMuebleType): Promise<void> {
    await this.mueblesButton.click();
    const page = this.page;
    const muebleTypeInput = page.locator(getInputSelector('tipoMueble'));
    const marcaInput = page.locator("input[formcontrolname='marca']");

    await this.selectOption(muebleTypeInput, asset.type);

    if (isAssetVehicularType(asset)) {
      const modelInput = page.locator("input[formcontrolname='modelo']");
      const placaInput = page.locator("input[formcontrolname='placa']");
      const ownershipCardNameInput = page.locator("input[formcontrolname='tarjetaPropiedad']");

      await modelInput.fill(asset.model);
      await placaInput.fill(asset.placa);
      await ownershipCardNameInput.fill(asset.ownershipCardName);
      await this.uploadFile('AGREGAR COPIA DE TARJETA DE PROPIEDAD', asset.ownershipCardFilePath);
    } else {
      await this.fillInput(page.locator(getInputSelector('clasificacion')), asset.clasification);
    }

    await marcaInput.fill(asset.marca);
  }

  private async addAssetInmueble(asset: AssetInmuebleType): Promise<void> {
    await this.inmueblesButton.click();
    const page = this.page;
    const matriculaInput = page.locator("input[formcontrolname='matriculaInmobiliaria']");
    const countryInput = page.locator(getInputSelector('pais'));
    const participationPercentageInput = page.locator(
      "input[formcontrolname='porcentajeParticipacion']",
    );
    const roadTypeInput = page.locator(getInputSelector('razonSocial'));

    await matriculaInput.fill(asset.matriculaInmobiliaria);
    await this.fillInput(countryInput, asset.country);
    await this.fillInput(roadTypeInput, asset.judicialNotificationAddress.roadType);
    await fillJudicialNotificationAddress(page, asset.judicialNotificationAddress);
    await participationPercentageInput.fill(asset.participationPercentage.toString());
  }

  public async send(assets: AssetsType | undefined = []): Promise<void> {
    const page = this.page;

    try {
      for (const asset of assets || []) {
        const isAssetMueble = isAssetMuebleType(asset);
        const descriptionInput = page.locator("textarea[formcontrolname='descripcion']");
        const estimatedValueInput = page.locator("input[formcontrolname='avaluoComercialEstimado']");
        const saveButton = page.locator('button.btn-guardar:not([disabled])', {
          hasText: isAssetMueble ? 'GUARDAR' : /^ AGREGAR $/,
        });

        if (isAssetMueble) {
          await this.addAssetMueble(asset);
        } else {
          await this.addAssetInmueble(asset);
        }

        await descriptionInput.fill(asset.description);
        await estimatedValueInput.fill(asset.estimatedValue.toString());
        await saveButton.click();
      }

      await this.submitButton.click();
      await page
        .locator('h2', { hasText: 'PROCESOS JUDICIALES, ADMINISTRATIVOS O PRIVADOS' })
        .waitFor();
    } catch (e) {
      await this.deleteDraft().catch((deleteError) => {
        console.error('Error deleting draft:', deleteError);
      });
      console.error('Error in AssetsSection.send:', e);
      throw e;
    }
  }
}

export default AssetsSection;
