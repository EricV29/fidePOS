import { z } from "zod";

export const getNewPaymentSchema = (t: (key: string) => string) =>
  z.object({
    payment_amount: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, t("errors.only_numeric")),

    note: z
      .string()
      .min(2, t("errors.min2_characters"))
      .max(200, t("errors.max200_characters")),
  });

export type NewPaymentFormValues = z.infer<
  ReturnType<typeof getNewPaymentSchema>
>;
