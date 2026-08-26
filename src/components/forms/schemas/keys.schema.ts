import { z } from "zod";

export const getKeysSchema = (t: (key: string) => string) =>
  z.object({
    db_password: z
      .string()
      .min(8, t("formKeys.pass_too_short"))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
        t("formKeys.pass_too_short"),
      ),
  });

export type KeysFormValues = z.infer<ReturnType<typeof getKeysSchema>>;
