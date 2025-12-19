import { z } from "zod";

export const getAddCategorySchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("formAddCategory.error1"))
      .max(50, t("formAddCustomer.error1_max")),

    description: z.string().min(2, t("formAddCategory.error3")),
  });

export type AddCategoryFormValues = z.infer<
  ReturnType<typeof getAddCategorySchema>
>;
