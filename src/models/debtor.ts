import { z } from 'zod';
import { IdDocSchema, type IdDocType } from './identification-document.js';

const DebtorSchema = z.object({
  idDoc: IdDocSchema,

  // TODO: Check if the next IA generated fields are ok

  // === Personal information ===
  firstName: z.string().min(1),
  middleName: z.string().optional(),

  lastName: z.string().min(1),
  secondLastName: z.string().optional(),

  countryOfOrigin: z.string().min(1),

  // === Person type ===
  isMerchant: z.boolean(),

  // === Professional information ===  (array of them)
  professionalLicenseNumber: z.string().optional(),
  degreeIssuingEntity: z.string().optional(),
  graduationDate: z.string().optional(), // ISO date (yyyy-mm-dd)

  // === Address ===
  businessName: z.string().optional(),

  address: z.object({
    mainRoad: z.string().optional(),
    roadNumber: z.string().optional(),
    complement: z.string().optional(),
    details: z.string().optional(),
    socioeconomicStratum: z.string().optional(),
  }),

  // === Income information ===
  hasMonthlyIncome: z.boolean(),
  monthlyIncomeAmount: z.number().optional(),

  hasOtherActivitiesIncome: z.boolean(),

  // === Contact ===
  primaryEmail: z.email(),
  secondaryEmail: z.email().optional(),

  primaryPhone: z.string().optional(),
  secondaryPhone: z.string().optional(),

  // === Legal procedures ===
  hasCollectionProcedures: z.boolean(),
});

type DebtorType = z.infer<typeof DebtorSchema>;

export { DebtorSchema, IdDocSchema };
export type { DebtorType, IdDocType };
