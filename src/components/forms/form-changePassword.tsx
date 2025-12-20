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
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formChangePassword.input1")}
              </FormLabel>
              <FormControl>
                <Input placeholder="*****" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPass"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formChangePassword.input2")}
              </FormLabel>
              <FormControl>
                <Input placeholder="*****" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
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
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formChangePassword.input3")}
              </FormLabel>
              <FormControl>
                <Input placeholder="*****" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
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
