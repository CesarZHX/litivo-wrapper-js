import z from 'zod';
import { AttachableSchema } from './attachable.js';
import { CountrySchema } from './enums/country.js';
import { DisabilitySchema } from './enums/disability.js';
import { CivilStatusSchema, EtnicitySchema, GenderSchema } from './extras/natural-person.js';
import { IdDocSchema } from './identification-document.js';
import { PersonNamePartsSchema } from './person-name-parts.js';

const AttachablePersonNamePartsSchema = PersonNamePartsSchema.extend(AttachableSchema.shape);
type AttachablePersonNamePartsType = z.infer<typeof AttachablePersonNamePartsSchema>;

const BaseNaturalPersonIdDataSchema = AttachablePersonNamePartsSchema.extend({
  idDoc: IdDocSchema,
});
type BaseNaturalPersonIdDataType = z.infer<typeof BaseNaturalPersonIdDataSchema>;

const NaturalPersonIdDataExtrasSchema = z.object({
  originCountry: CountrySchema,
  gender: GenderSchema,
  civilStatus: CivilStatusSchema.optional(),
  birthDate: z.iso.date(),
  ethnicity: EtnicitySchema.optional(),
  disability: DisabilitySchema.optional(),
});

const NaturalPersonIdDataSchema = BaseNaturalPersonIdDataSchema.extend(
  NaturalPersonIdDataExtrasSchema.shape,
);
type NaturalPersonIdentificationDataType = z.infer<typeof NaturalPersonIdDataSchema>;

const NaturalPersonSchema = z.object({
  identificationData: NaturalPersonIdDataSchema,
});
type NaturalPersonType = z.infer<typeof NaturalPersonSchema>;

type NaturalPersonIdDataType = z.infer<typeof NaturalPersonIdDataSchema>;

export {
  BaseNaturalPersonIdDataSchema,
  NaturalPersonIdDataExtrasSchema,
  NaturalPersonIdDataSchema,
  NaturalPersonSchema
};
export type { BaseNaturalPersonIdDataType, NaturalPersonIdDataType, NaturalPersonIdentificationDataType, NaturalPersonType };

