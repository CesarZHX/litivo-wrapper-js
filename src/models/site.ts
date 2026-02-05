import { z } from 'zod';

const SiteSchema = z.object({
  department: z.string().min(1), // Known fixed options
  city: z.string().min(1), // Known fixed options
  sponsorEntity: z.string().min(1), // Unknown fixed options
  branchCenter: z.string().min(1), // branch / center. Unknown fixed options
});

type SiteType = z.infer<typeof SiteSchema>;

export { SiteSchema, type SiteType };
