import { z } from "zod";

export const getAddProductSchema = (t: (key: string) => string) =>
  z.object({
    code_sku: z.string().regex(/^[0-9]+$/, t("formAddProduct.error1")),

    product: z
      .string()
      .min(2, t("formAddCustomer.error2"))
      .max(50, t("formAddCustomer.error2_max")),

    description: z.string().min(2, t("formAddCustomer.error3")),

    stock: z.string().regex(/^[0-9]+$/, t("formAddProduct.error5")),

    cost_price: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, t("formAddProduct.error6")),
    unit_price: z
      .string()
      .regex(/^\d+(\.\d{1,2})?$/, t("formAddProduct.error7")),
  });

export type AddProductFormValues = z.infer<
  ReturnType<typeof getAddProductSchema>
>;
