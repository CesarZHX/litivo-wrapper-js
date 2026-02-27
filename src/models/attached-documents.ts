import z from "zod";

const AttachedDocumentSchema = z.object({
    name: z.string().trim().min(1),
    filePath: z.string().trim().min(1),
});

const AttachedDocumentsSchema = z.array(AttachedDocumentSchema);
type AttachedDocumentsType = z.infer<typeof AttachedDocumentsSchema>;
type AttachedDocumentType = z.infer<typeof AttachedDocumentSchema>;

export { AttachedDocumentsSchema };
export type { AttachedDocumentsType, AttachedDocumentType };

