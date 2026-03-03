import type { Locator, Page } from '@playwright/test';
import type { AttachedDocumentsType } from '../../models/attached-documents.js';
import BaseSection from '../bases/section.js';
/** TODO: Attached Documents (feat: extend create insolvency method with attached documents section) */
class AttachedDocumentsSection extends BaseSection<[AttachedDocumentsType]> {
  private readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.locator('button.btn-guardar:not([disabled])', {
      hasText: 'Siguiente',
    });
  }

  public async send(attachedDocuments: AttachedDocumentsType | undefined = []): Promise<void> {
    const page = this.page;


    try {
      for (const document of attachedDocuments || []) {
        const addAnexoButton = page.locator('span', { hasText: 'AGREGAR ANEXO' });
        const anexoModal = page.locator('nz-modal-container[role="dialog"]');
        const fileInput = anexoModal.locator('input[type="file"]#undefined');
        const uploadFileButton = anexoModal.locator('button:not([disabled])', { hasText: 'Siguiente' });
        const editNameAnchor = anexoModal.locator('a[nz-tooltip="Renombrar archivo"]');
        const nameInput = anexoModal.locator('input[placeholder="Nombre"]');
        const saveNameAnchor = anexoModal.locator('a[nz-tooltip="Guardar Nombre"]');
        const uploadAnexosButton = anexoModal.locator('button.btn-guardar:not([disabled])',
          { hasText: 'Subir Anexos' });

        await addAnexoButton.click();
        await fileInput.setInputFiles(document.filePath);
        await uploadFileButton.click()
        await editNameAnchor.click();
        await nameInput.fill(document.name);
        await saveNameAnchor.click();
        await uploadAnexosButton.click();
        await anexoModal.waitFor({ state: 'detached' });
      }

      await this.submitButton.click();
      await page.locator('h2', { hasText: 'ENVÍO Y FIRMA DE LA SOLICITUD' }).waitFor();
    } catch (e) {
      await this.deleteDraft().catch((deleteError) => {
        console.error('Failed to delete draft after error in send:', deleteError);
      });

      console.error('Error in AttachedDocumentsSection.send:', e);
      throw e;
    }
  }
}

export default AttachedDocumentsSection;
