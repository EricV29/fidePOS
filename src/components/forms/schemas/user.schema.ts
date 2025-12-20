import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getAddUserSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z
        .string()
        .min(2, t("formAddUser.error1"))
        .max(50, t("formAddUser.error1_max")),

      lastname: z
        .string()
        .min(2, t("formAddUser.error2"))
        .max(50, t("formAddUser.error2_max")),

      email: z.string().regex(emailRegex, t("formAddUser.error3")),

      phone: z.string().regex(/^[0-9]{10}$/, t("formAddUser.error4")),

      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/,
          t("formAddUser.error5")
        ),

      confirmPass: z.string(),
    })
    .refine((data) => data.password === data.confirmPass, {
      message: t("formAddUser.error6"),
      path: ["confirmPass"],
    });

export type AddUserFormValues = z.infer<ReturnType<typeof getAddUserSchema>>;
