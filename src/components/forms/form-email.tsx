import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type EmailFormValues, getEmailSchema } from "./schemas/email.schema";

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

interface EmailFormProps {
  onSuccess?: (values: EmailFormValues) => void;
}

export default function EmailForm({ onSuccess }: EmailFormProps) {
  const { t } = useTranslation();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(getEmailSchema(t)),
    defaultValues: {
      email: "",
      email_pass: "",
    },
  });

  function onSubmit(values: EmailFormValues) {
    onSuccess?.(values);
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
                {t("formEmailCredentials.input1")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="••••••••••••••••••••"
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <FormField
            control={form.control}
            name="email_pass"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  {t("formEmailCredentials.input2")}S
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="••••••••••••••••••••"
                      {...field}
                      className="bg-white pr-10"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <button type="submit" className="borange">
            {t("formEmailCredentials.btn")}
          </button>
        </div>
      </form>
    </Form>
  );
}
