import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { Input } from "@components/ui/input";
import { useTranslation } from "react-i18next";
import {
  type ChangePasswordFormValues,
  getChangePasswordSchema,
} from "./schemas/user.schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import EyeOffIcon from "@icons/EyeOffIcon";
import EyeIcon from "@icons/EyeIcon";

interface ChangePasswordFormProps {
  onSuccess?: (values: ChangePasswordFormValues) => void;
}

export default function ChangePasswordForm({
  onSuccess,
}: ChangePasswordFormProps) {
  const { t } = useTranslation();
  const [showCPassword, setShowCPassword] = useState(false);
  const [showNPassword, setShowNPassword] = useState(false);
  const [showNCPassword, setShowNCPassword] = useState(false);

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(getChangePasswordSchema(t)),
    defaultValues: {
      currentPass: "",
      newPass: "",
      confirmNewPass: "",
    },
  });

  function onSubmit(values: ChangePasswordFormValues) {
    onSuccess?.(values);
  }

  const passwordRules = t("formChangePassword.password_rules", {
    returnObjects: true,
  }) as string[];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="currentPass"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400",
                )}
              >
                {t("formChangePassword.input1")}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showCPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    {...field}
                    className={cn(
                      "bg-white",
                      fieldState.error &&
                        "border-red-600 focus-visible:ring-red-600 dark:border-red-400",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCPassword ? (
                      <EyeOffIcon color="#F57C00" />
                    ) : (
                      <EyeIcon color="#F57C00" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-600 dark:text-red-400" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPass"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400",
                )}
              >
                {t("formChangePassword.input2")}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showNPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    {...field}
                    className={cn(
                      "bg-white",
                      fieldState.error &&
                        "border-red-600 focus-visible:ring-red-600 dark:border-red-400",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNPassword ? (
                      <EyeOffIcon color="#F57C00" />
                    ) : (
                      <EyeIcon color="#F57C00" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-600 dark:text-red-400" />
            </FormItem>
          )}
        />
        <div className="w-full">
          <ul className="grid grid-cols-2 list-disc pl-5 text-sm font-extralight">
            {passwordRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
        <FormField
          control={form.control}
          name="confirmNewPass"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400",
                )}
              >
                {t("formChangePassword.input3")}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showNCPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    {...field}
                    className={cn(
                      "bg-white",
                      fieldState.error &&
                        "border-red-600 focus-visible:ring-red-600 dark:border-red-400",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNCPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNCPassword ? (
                      <EyeOffIcon color="#F57C00" />
                    ) : (
                      <EyeIcon color="#F57C00" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-600 dark:text-red-400" />
            </FormItem>
          )}
        />
        <button type="submit" className="borange">
          {t("formChangePassword.btn")}
        </button>
      </form>
    </Form>
  );
}
