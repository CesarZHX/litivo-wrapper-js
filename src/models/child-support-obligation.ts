import z from "zod";
import { BaseJudicialNotificationAddressSchema, ContactInformationSchema } from "./base.js";
import { IdentificationDocumentBaseSchema } from "./identification-document.js";
import { NaturalPersonIdDataSchema } from "./natural-person.js";
import { NonEmptyTrimmedStringSchema } from "./utils/strings.js";

const BeneficiarySchema = NaturalPersonIdDataSchema.extend({
    birthDate: NaturalPersonIdDataSchema.shape.birthDate.optional(),
    idDoc: IdentificationDocumentBaseSchema,
    contactInformation: ContactInformationSchema.extend({
        judicialNotificationAddress: BaseJudicialNotificationAddressSchema.extend({
            roadStratum: NonEmptyTrimmedStringSchema.optional(), // TODO: "ESTRATO 1", "ESTRATO 2", ..., "ESTRATO 6", "NO INFORMA".
        }).optional(),
    })
});

const childSupportObligationSchema = z.object({
    amount: z.number().nonnegative(),
    paymentFrequency: z.enum(["DIARIOS", "SEMANAL", "QUINCENAL", "MENSUAL"]),
    redamFilePath: z.string().trim().min(1),
    parentalRelationship: z.enum(["Cónyuge", "Padres", "Hijos", "Hermanos", "Otros"]),
    isSued: z.boolean().optional(),
    beneficiary: BeneficiarySchema
});

const childSupportObligationsSchema = z.array(childSupportObligationSchema);
type ChildSupportObligationType = z.infer<typeof childSupportObligationSchema>;
type ChildSupportObligationsType = z.infer<typeof childSupportObligationsSchema>;
type BeneficiaryType = z.infer<typeof BeneficiarySchema>;

export { childSupportObligationSchema, childSupportObligationsSchema };
export type { BeneficiaryType, ChildSupportObligationsType, ChildSupportObligationType };

