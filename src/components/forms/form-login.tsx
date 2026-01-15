import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginFormValues, getLoginSchema } from "./schemas/user.schema";

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

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { t } = useTranslation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(getLoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    console.log("Form submitted:", values);
    if (onSuccess) onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formAddUser.input3")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("placeholders.email")}
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formAddUser.input5")}
              </FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••••"
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" className="borange">
          {t("formAddUser.btn3")}
        </button>
      </form>
    </Form>
  );
}
