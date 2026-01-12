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
import { Textarea } from "@components/ui/textarea";
import { useTranslation } from "react-i18next";
import {
  type ContactFormValues,
  getContactSchema,
} from "./schemas/user.schema";
import { cn } from "@/lib/utils";

interface ContactFormProps {
  onSuccess?: () => void;
}

export default function ContactForm({ onSuccess }: ContactFormProps) {
  const { t } = useTranslation();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(getContactSchema(t)),
    defaultValues: {
      text: "",
    },
  });

  function onSubmit(values: ContactFormValues) {
    console.log("Form submitted:", values);
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="text"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400"
                )}
              >
                {t("formContact.input1")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("placeholders.text")}
                  {...field}
                  className={cn(
                    "bg-white min-h-[120px] resize-none",
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
          {t("formContact.btn")}
        </button>
      </form>
    </Form>
  );
}
