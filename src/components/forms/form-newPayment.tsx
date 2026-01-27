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
import { cn } from "@/lib/utils";
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
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400",
                )}
              >
                {t("formNewPayment.input1")}
              </FormLabel>

              <FormControl>
                <Input
                  placeholder="$"
                  {...field}
                  className={cn(
                    "bg-white",
                    fieldState.error &&
                      "border-red-600 focus-visible:ring-red-600 dark:border-red-400",
                  )}
                />
              </FormControl>

              <FormMessage className="text-red-600 dark:text-red-400" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400",
                )}
              >
                {t("formNewPayment.input2")}
              </FormLabel>

              <FormControl>
                <Input
                  placeholder={t("placeholders.text")}
                  {...field}
                  className={cn(
                    "bg-white",
                    fieldState.error &&
                      "border-red-600 focus-visible:ring-red-600 dark:border-red-400",
                  )}
                />
              </FormControl>

              <FormMessage className="text-red-600 dark:text-red-400" />
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
