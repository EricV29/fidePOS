import { z } from "zod";

export const requiredString = (t: (k: string) => string) =>
  z.string().min(1, t("errors.required"));

export const minString = (t: (k: string) => string, min: number, key: string) =>
  z.string().min(min, t(key));

export const phone10 = (t: (k: string) => string) =>
  z.string().regex(/^[0-9]{10}$/, t("errors.phone"));
