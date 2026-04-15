import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type KeysFormValues, getKeysSchema } from "./schemas/keys.schema";

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

interface KeysFormProps {
  onSuccess?: (values: KeysFormValues) => void;
}

export default function KeysForm({ onSuccess }: KeysFormProps) {
  const { t } = useTranslation();

  const form = useForm<KeysFormValues>({
    resolver: zodResolver(getKeysSchema(t)),
    defaultValues: {
      db_password: "",
      db_salt: "",
    },
  });

  function onSubmit(values: KeysFormValues) {
    onSuccess?.(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="db_password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formDBCredentials.input2")}
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
            name="db_salt"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  {t("formDBCredentials.input3")}
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
            {t("formDBCredentials.btn")}
          </button>
        </div>
      </form>
    </Form>
  );
}
