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
  type AddCustomerFormValues,
  getAddCustomerSchema,
} from "./schemas/customer.schema";
import { cn } from "@/lib/utils";

interface AddCustomerFormProps {
  onSuccess?: () => void;
}

export default function AddCustomerForm({ onSuccess }: AddCustomerFormProps) {
  const { t } = useTranslation();

  const form = useForm<AddCustomerFormValues>({
    resolver: zodResolver(getAddCustomerSchema(t)),
    defaultValues: {
      name: "",
      lastname: "",
      phone: "",
    },
  });

  function onSubmit(values: AddCustomerFormValues) {
    console.log("Form submitted:", values);
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400"
                )}
              >
                {t("formAddCustomer.input1")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("placeholders.name")}
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
          name="lastname"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400"
                )}
              >
                {t("formAddCustomer.input2")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("placeholders.lastname")}
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
          name="phone"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400"
                )}
              >
                {t("formAddCustomer.input3")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="52+"
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
          {t("formAddCustomer.btn")}
        </button>
      </form>
    </Form>
  );
}
