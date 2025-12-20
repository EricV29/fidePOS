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
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formContact.input1")}
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("formContact.place1")}
                  {...field}
                  className="bg-white min-h-[120px] resize-none"
                />
              </FormControl>
              <FormMessage />
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
