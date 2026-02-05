import { InsolvencySchema, type InsolvencyType } from '../../../src/models/insolvency.js';
import { paths } from './paths.js';

// NOTE: This insolvency must valid but not necessarily real. Idk if the system check for fake data.
const insolvency: InsolvencyType = InsolvencySchema.parse(paths.readJSON(paths.insolvencyFile));

export { insolvency };
