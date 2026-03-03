import z from 'zod';
import { JudicialNotificationAddressRequiredSchema } from './base.js';
import { CountrySchema } from './enums/country.js';

const AssetBaseSchema = z.object({
  description: z.string().trim().min(1),
  marca: z.string().trim().min(1),
  estimatedValue: z.number().nonnegative(),
});

const AssetVehicularSchema = AssetBaseSchema.extend({
  type: z.literal('Vehículos'),
  model: z.string().trim().min(1),
  placa: z.string().trim().min(1),
  ownershipCardName: z.string().trim().min(1),
  ownershipCardFilePath: z.string().trim().min(1), // TODO: check if mandatory
});

const AssetOtrosMueblesSchema = AssetBaseSchema.extend({
  type: z.literal('Otros muebles'),
  clasification: z.enum([
    'Equipos Electrónicos',
    'Joyas',
    'Obras de Arte',
    'Artículos de Recreación',
    'Accesorios',
    'Prendas de Vestir',
    'Semovientes',
    'Muebles y Enseres',
    'Otros',
  ]),
});

const AssetMuebleSchema = z.union([AssetVehicularSchema, AssetOtrosMueblesSchema]);

const AssetInmuebleSchema = z.object({
  description: z.string().trim().min(1),
  matriculaInmobiliaria: z.string().trim().min(1),
  country: CountrySchema,
  judicialNotificationAddress: JudicialNotificationAddressRequiredSchema,
  estimatedValue: z.number().nonnegative(),
  participationPercentage: z.number().min(0).max(100), // TODO: check if "tarjeta de propiedad" is needed.
});

const AssetSchema = z.union([AssetMuebleSchema, AssetInmuebleSchema]);

const AssetsSchema = z.array(AssetSchema);

type AssetVehicularType = z.infer<typeof AssetVehicularSchema>;
type AssetOtrosMueblesType = z.infer<typeof AssetOtrosMueblesSchema>;
type AssetMuebleType = z.infer<typeof AssetMuebleSchema>;
type AssetInmuebleType = z.infer<typeof AssetInmuebleSchema>;
type AssetsType = z.infer<typeof AssetsSchema>;

export {
  AssetInmuebleSchema,
  AssetMuebleSchema,
  AssetOtrosMueblesSchema,
  AssetsSchema,
  AssetVehicularSchema
};
export type {
  AssetInmuebleType,
  AssetMuebleType,
  AssetOtrosMueblesType,
  AssetsType,
  AssetVehicularType
};

