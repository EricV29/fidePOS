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
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formAddCustomer.input1")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("placeholders.name")}
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
          name="lastname"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formAddCustomer.input2")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("placeholders.lastname")}
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
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formAddCustomer.input3")}
              </FormLabel>
              <FormControl>
                <Input placeholder="52+" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
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
