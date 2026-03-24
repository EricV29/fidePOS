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
  type EditUserFormValues,
  getEditUserSchema,
} from "./schemas/user.schema";
import { cn } from "@/lib/utils";
import type { Users } from "@typesm/users";

interface EditUserFormProps {
  data?: Users;
  onSuccess?: (values: EditUserFormValues) => void;
}

export default function EditUserForm({ data, onSuccess }: EditUserFormProps) {
  const { t } = useTranslation();

  const form = useForm<EditUserFormValues>({
    resolver: zodResolver(getEditUserSchema(t)),
    defaultValues: {
      id: data?.id,
      name: data?.name,
      last_name: data?.last_name,
      email: data?.email,
      phone: data?.phone,
    },
  });

  function onSubmit(values: EditUserFormValues) {
    onSuccess?.(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="w-full flex justify-between">
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
                  {t("formEditUser.input1")}
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
                  {t("formEditUser.input2")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholders.lastname")}
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
        </div>
        <div className="w-full flex justify-between">
          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    "font-semibold",
                    fieldState.error && "text-red-600 dark:text-red-400",
                  )}
                >
                  {t("formEditUser.input3")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholders.email")}
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
                  {t("formEditUser.input4")}
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
        </div>
        <button type="submit" className="borange">
          {t("formEditUser.btn")}
        </button>
      </form>
    </Form>
  );
}
