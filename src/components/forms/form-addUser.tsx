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
  type AddUserFormValues,
  getAddUserSchema,
} from "./schemas/user.schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import EyeIcon from "@icons/EyeIcon";
import EyeOffIcon from "@icons/EyeOffIcon";

interface AddUserFormProps {
  onSuccess?: (values: AddUserFormValues) => void;
}

export default function AddUserForm({ onSuccess }: AddUserFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(getAddUserSchema(t)),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      confirmPass: "",
    },
  });

  function onSubmit(values: AddUserFormValues) {
    onSuccess?.(values);
  }

  const passwordRules = t("formAddUser.password_rules", {
    returnObjects: true,
  }) as string[];

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
                  {t("formAddUser.input1")}
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
                  {t("formAddUser.input2")}
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
                  {t("formAddUser.input3")}
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
                  {t("formAddUser.input4")}
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
        <div className="w-full">
          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    "font-semibold",
                    fieldState.error && "text-red-600 dark:text-red-400",
                  )}
                >
                  {t("formAddUser.input5")}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      {...field}
                      className={cn(
                        "bg-white",
                        fieldState.error &&
                          "border-red-600 focus-visible:ring-red-600 dark:border-red-400",
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOffIcon color="#F57C00" />
                      ) : (
                        <EyeIcon color="#F57C00" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-600 dark:text-red-400" />
              </FormItem>
            )}
          />
          <div className="w-full">
            <ul className="grid grid-cols-2 list-disc pl-5 text-sm font-extralight">
              {passwordRules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
        <FormField
          control={form.control}
          name="confirmPass"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400",
                )}
              >
                {t("formAddUser.input6")}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showCPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    {...field}
                    className={cn(
                      "bg-white",
                      fieldState.error &&
                        "border-red-600 focus-visible:ring-red-600 dark:border-red-400",
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showCPassword ? (
                      <EyeOffIcon color="#F57C00" />
                    ) : (
                      <EyeIcon color="#F57C00" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-red-600 dark:text-red-400" />
            </FormItem>
          )}
        />
        <button type="submit" className="borange">
          {t("formAddUser.btn")}
        </button>
      </form>
    </Form>
  );
}
