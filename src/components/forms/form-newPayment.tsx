import { z } from "zod";
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
import {
  type NewPaymentFormValues,
  getNewPaymentSchema,
} from "./schemas/payment.schema";
import { useTranslation } from "react-i18next";

interface ProductFormProps {
  onSuccess?: () => void;
}

export default function NewPaymentForm({ onSuccess }: ProductFormProps) {
  const { t } = useTranslation();

  const form = useForm<NewPaymentFormValues>({
    resolver: zodResolver(getNewPaymentSchema(t)),
    defaultValues: {
      payment_amount: "",
      note: "",
    },
  });

  function onSubmit(values: NewPaymentFormValues) {
    console.log("Form submitted:", values);
    if (onSuccess) onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="payment_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formNewPayment.input1")}
              </FormLabel>
              <FormControl>
                <Input placeholder="$" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formNewPayment.input2")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("formNewPayment.place2")}
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" className="borange">
          {t("formNewPayment.btn")}
        </button>
      </form>
    </Form>
  );
}
