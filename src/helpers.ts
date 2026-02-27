import type { Page } from "playwright";
import type { JudicialNotificationAddressRequiredType } from "./models/base.js";

// TODO: Check if this can be placed into SectionBase instead of being a helper
function getInputSelector(id: string): string {
  return `nz-select[formcontrolname="${id}"]`;
}
function getDateInputSelector(id: string): string {
  return `nz-date-picker[formcontrolname="${id}"]`;
}
function titleCase(text: string): string {
  return text.toLowerCase().replace(/(^|\s)\w/g, (match) => match.toUpperCase());
}


async function checkCheckBox(page: Page, formControlName: string): Promise<void> {
  const label = page.locator(`label[formcontrolname="${formControlName}"]`);
  const hasChecked = await label.locator('input[type="checkbox"]').isChecked();

  if (!hasChecked) {
    await label.click();
  }

}

async function fillJudicialNotificationAddress(page: Page, address: JudicialNotificationAddressRequiredType): Promise<void> {
  const roadName: string = address.roadName || '';
  const roadNumber: string = address.roadNumber;
  const roadSubNumber: string | undefined = address.roadSubNumber;
  const roadDetails: string = address.roadDetails || '';
  const roadStratum: string | undefined = address.roadStratum;


  const roadNameInput = page.locator('input[formcontrolname="a1"]');
  const roadNumberInput = page.locator('input[formcontrolname="a2"]');
  const roadSubNumberInput = page.locator('input[formcontrolname="a3"]');
  const roadDetailsInput = page.locator('input[formcontrolname="detalleDireccion"]');
  const roadStratumInput = page.locator(getInputSelector('estrato'));

  await roadNameInput.fill(roadName);
  await roadNumberInput.fill(roadNumber);
  if (roadSubNumber !== undefined) {
    await roadSubNumberInput.fill(roadSubNumber);
  }
  await roadDetailsInput.fill(roadDetails);
  if (roadStratum !== undefined) {
    await roadStratumInput.fill(roadStratum);
  }

}

export { checkCheckBox, fillJudicialNotificationAddress, getDateInputSelector, getInputSelector, titleCase };

