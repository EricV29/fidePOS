import { z } from "zod";

export const getAddCategorySchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("errors.min2_characters"))
      .max(50, t("errors.max50_characters")),

    description: z.string().min(2, t("errors.min2_characters")),
  });

export type AddCategoryFormValues = z.infer<
  ReturnType<typeof getAddCategorySchema>
>;
