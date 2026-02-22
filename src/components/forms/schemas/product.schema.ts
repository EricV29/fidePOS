import { z } from "zod";

export const getAddProductSchema = (t: (key: string) => string) =>
  z.object({
    code_sku: z.string().regex(/^[0-9]*$/, t("errors.only_numeric")),

    product: z
      .string()
      .min(2, t("errors.min2_characters"))
      .max(50, t("errors.max50_characters")),

    description: z.string().min(2, t("errors.min2_characters")),

    stock: z.string().regex(/^[0-9]+$/, t("errors.only_numeric")),

    cost_price: z.string().regex(/^\d+(\.\d{1,2})?$/, t("errors.only_numeric")),
    unit_price: z.string().regex(/^\d+(\.\d{1,2})?$/, t("errors.only_numeric")),

    editStock: z.string().optional(),
  });

export type AddProductFormValues = z.infer<
  ReturnType<typeof getAddProductSchema>
>;
