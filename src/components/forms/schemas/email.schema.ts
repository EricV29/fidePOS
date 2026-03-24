import { z } from "zod";

export const getEmailSchema = (t: (key: string) => string) =>
  z
    .object({
      email: z
        .string()
        .email(t("errors.invalid_email"))
        .min(5, t("errors.too_short"))
        .or(z.literal("")),

      email_pass: z
        .string()
        .transform((val) => val.replace(/\s+/g, ""))
        .pipe(
          z.string().length(16, t("errors.invalid_app_pass")).or(z.literal("")),
        ),
    })
    .refine(
      (data) => {
        if (
          (data.email && !data.email_pass) ||
          (!data.email && data.email_pass)
        ) {
          return false;
        }
        return true;
      },
      {
        message: t("errors.both_fields_required"),
        path: ["email_pass"],
      },
    );

export type EmailFormValues = z.infer<ReturnType<typeof getEmailSchema>>;
