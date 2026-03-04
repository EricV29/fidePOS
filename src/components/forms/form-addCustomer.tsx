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
import { useEffect, useState } from "react";
import type { Customers } from "@typesm/customers";

interface AddCustomerFormProps {
  data?: Customers;
  onSuccess?: (values: AddCustomerFormValues, editActive: boolean) => void;
}

export default function AddCustomerForm({
  data,
  onSuccess,
}: AddCustomerFormProps) {
  const { t } = useTranslation();
  const [editActive, setEditActive] = useState(false);

  const form = useForm<AddCustomerFormValues>({
    resolver: zodResolver(getAddCustomerSchema(t)),
    defaultValues: {
      name: "",
      last_name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (data) {
      setEditActive(true);
      form.setValue("name", data.name);
      form.setValue("last_name", data.last_name);
      form.setValue("phone", data.phone);
    }
  }, [data, form]);

  function onSubmit(values: AddCustomerFormValues) {
    const datav = { ...values, id: data?.id };
    onSuccess?.(datav, editActive);
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
                  fieldState.error && "text-red-600 dark:text-red-400",
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
          name="last_name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400",
                )}
              >
                {t("formAddCustomer.input2")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("placeholders.last_name")}
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
          name="phone"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400",
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
                      "border-red-600 focus-visible:ring-red-600 dark:border-red-400",
                  )}
                />
              </FormControl>
              <FormMessage className="text-red-600 dark:text-red-400" />
            </FormItem>
          )}
        />
        <button type="submit" className="borange">
          {data ? t("formAddCustomer.btn_edit") : t("formAddCustomer.btn")}
        </button>
      </form>
    </Form>
  );
}
