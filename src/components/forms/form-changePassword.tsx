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

interface ChangePasswordFormProps {
  onSuccess?: () => void;
}

export default function ChangePasswordForm({
  onSuccess,
}: ChangePasswordFormProps) {
  const { t } = useTranslation();

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(getChangePasswordSchema(t)),
    defaultValues: {
      currentPass: "",
      newPass: "",
      confirmNewPass: "",
    },
  });

  function onSubmit(values: ChangePasswordFormValues) {
    console.log("Form submitted:", values);
    onSuccess?.();
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
                  fieldState.error && "text-red-600 dark:text-red-400"
                )}
              >
                {t("formChangePassword.input1")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="*****"
                  {...field}
                  className={cn(
                    "bg-white",
                    fieldState.error &&
                      "border-red-600 focus-visible:ring-red-600 dark:border-red-400"
                  )}
                />
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
                  fieldState.error && "text-red-600 dark:text-red-400"
                )}
              >
                {t("formChangePassword.input2")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="*****"
                  {...field}
                  className={cn(
                    "bg-white",
                    fieldState.error &&
                      "border-red-600 focus-visible:ring-red-600 dark:border-red-400"
                  )}
                />
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
                  fieldState.error && "text-red-600 dark:text-red-400"
                )}
              >
                {t("formChangePassword.input3")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="*****"
                  {...field}
                  className={cn(
                    "bg-white",
                    fieldState.error &&
                      "border-red-600 focus-visible:ring-red-600 dark:border-red-400"
                  )}
                />
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
