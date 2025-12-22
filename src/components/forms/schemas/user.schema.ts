import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const getAddUserSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z
        .string()
        .min(2, t("errors.min2_characters"))
        .max(50, t("errors.max50_characters")),

      lastname: z
        .string()
        .min(2, t("errors.min2_characters"))
        .max(50, t("errors.max50_characters")),

      email: z.string().regex(emailRegex, t("errors.email_invalid")),

      phone: z.string().regex(/^[0-9]{10}$/, t("errors.number10_digits")),

      password: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/,
          t("errors.pass_requirements")
        ),

      confirmPass: z.string(),
    })
    .refine((data) => data.password === data.confirmPass, {
      message: t("errors.pass_match"),
      path: ["confirmPass"],
    });

export type AddUserFormValues = z.infer<ReturnType<typeof getAddUserSchema>>;

export const getChangePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPass: z.string(),

      newPass: z
        .string()
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/,
          t("errors.pass_requirements")
        ),

      confirmNewPass: z.string(),
    })
    .refine((data) => data.newPass === data.confirmNewPass, {
      message: t("errors.pass_match"),
      path: ["confirmNewPass"],
    });

export type ChangePasswordFormValues = z.infer<
  ReturnType<typeof getChangePasswordSchema>
>;

export const getContactSchema = (t: (key: string) => string) =>
  z.object({
    text: z
      .string()
      .min(10, t("errors.min10_characters"))
      .max(300, t("errors.max300_characters")),
  });

export type ContactFormValues = z.infer<ReturnType<typeof getContactSchema>>;
