import { z } from "zod";

export const getNewPaymentSchema = (t: (key: string) => string) =>
  z.object({
    payment_amount: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, t("formNewPayment.error1")),

    note: z
      .string()
      .min(2, t("formAddCustomer.error2"))
      .max(200, t("formAddCustomer.error2_max")),
  });

export type NewPaymentFormValues = z.infer<
  ReturnType<typeof getNewPaymentSchema>
>;
