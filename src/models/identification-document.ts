import { z } from 'zod';

const IdentificationDocumentSchema = z.object({
  type: z.string().min(1), // Known fixed options
  number: z.string().min(1), // TODO: Make number
  issueCity: z.string().min(1),
  filePath: z.string().min(1),
});

type IdentificationDocumentType = z.infer<typeof IdentificationDocumentSchema>;

const IdDocSchema = IdentificationDocumentSchema;
type IdDocType = IdentificationDocumentType;

export { IdDocSchema, type IdDocType };
