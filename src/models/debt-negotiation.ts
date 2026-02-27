
import z from 'zod';

const DebtNegotiationSchema = z.object({
  creditType: z.enum([
    "Primera Clase: Alimentos de Menores",
    "Primera Clase: Obligaciones Laborales",
    "Primera Clase: Obligaciones con el Fisco",
    "Segunda Clase",
    "Tercera Clase",
    "Cuarta Clase",
    "Quinta Clase"
  ]),
  installments: z.number().int().min(1),
  startDate: z.iso.date(),
});

const DebtNegotiationsSchema = z.array(DebtNegotiationSchema).min(1).refine(
  (items) => {
      const types = items.map(i => i.creditType);
      return new Set(types).size === types.length;
    },
    {
      message: " Duplicate creditType are not allowed",
      path: ["creditType"],
    }
);

type DebtNegotiationType = z.infer<typeof DebtNegotiationSchema>;
type DebtNegotiationsType = z.infer<typeof DebtNegotiationsSchema>;

export default DebtNegotiationSchema;
export { DebtNegotiationSchema, DebtNegotiationsSchema };
export type { DebtNegotiationsType, DebtNegotiationType };

