import { z } from 'zod';
import { DebtorSchema, IdDocSchema, type DebtorType, type IdDocType } from './debtor.js';
import { SiteSchema, type SiteType } from './site.js';

// TODO: Add progressively the needed validations.
// TODO: Add strict validations after completing the form. this is due to time constraints.

const InsolvencySchema = z.object({
  site: SiteSchema,
  debtors: z.array(DebtorSchema).min(1), // Idk the maximum number of debtors. TODO: Investigate if .min(1) and .nonempty() is the same for this case. Check if asking for a tuple instead breaks something.
  causes: z.unknown(),
  creditor: z.unknown(),
  assets: z.unknown(),
  jaopp: z.unknown(),
  childSupportObligations: z.unknown(),
  availableResources: z.unknown(),
  debtNegotiation: z.unknown(),
  attachedDocuments: z.unknown(),
  applicationSubmission: z.unknown(),
});

type InsolvencyType = z.infer<typeof InsolvencySchema>;

export { DebtorSchema, IdDocSchema, InsolvencySchema, SiteSchema };
export type { DebtorType, IdDocType, InsolvencyType, SiteType };
