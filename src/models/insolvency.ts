import z from 'zod';
import { AssetsSchema } from './assets.js';
import { AttachedDocumentsSchema } from './attached-documents.js';
import { AvailableResourcesSchema } from './available-resources.js';
import CausesSchema from './causes.js';
import { childSupportObligationsSchema } from './child-support-obligation.js';
import { CreditorsSchema } from './creditor.js';
import { DebtNegotiationsSchema } from './debt-negotiation.js';
import DebtorSchema from './debtor.js';
import { JaoppSchema } from './jaopp.js';
import SiteSchema from './site.js';


// TODO: Add progressively the needed validations.
// TODO: Add strict validations after completing the form. this is due to time constraints.

const InsolvencySchema = z.object({
  site: SiteSchema,
  debtor: DebtorSchema,
  causes: CausesSchema,
  creditors: CreditorsSchema,
  assets: AssetsSchema.optional(),
  jaopp: JaoppSchema.optional(),
  childSupportObligations: childSupportObligationsSchema.optional(),
  availableResources: AvailableResourcesSchema.optional(),
  debtNegotiations: DebtNegotiationsSchema,
  attachedDocuments: AttachedDocumentsSchema.optional(),
  applicationSubmission: z.unknown(),
});

type InsolvencyType = z.infer<typeof InsolvencySchema>;

export default InsolvencySchema;
export { InsolvencySchema };
export type { InsolvencyType };

