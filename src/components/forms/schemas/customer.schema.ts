import { z } from "zod";

export const getAddCustomerSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("formAddCustomer.error1"))
      .max(50, t("formAddCustomer.error1_max")),

    lastname: z
      .string()
      .min(2, t("formAddCustomer.error2"))
      .max(50, t("formAddCustomer.error2_max")),

    phone: z.string().regex(/^[0-9]{10}$/, t("formAddCustomer.error3")),
  });

export type AddCustomerFormValues = z.infer<
  ReturnType<typeof getAddCustomerSchema>
>;
