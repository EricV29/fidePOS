import { z } from "zod";

export const getAddCustomerSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, t("errors.min2_characters"))
      .max(50, t("errors.max50_characters")),

    last_name: z
      .string()
      .min(2, t("errors.min2_characters"))
      .max(50, t("errors.max50_characters")),

    phone: z.string().regex(/^[0-9]{10}$/, t("errors.number10_digits")),
  });

export type AddCustomerFormValues = z.infer<
  ReturnType<typeof getAddCustomerSchema>
>;
