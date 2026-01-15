import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type LoginFormValues, getLoginSchema } from "./schemas/user.schema";

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
import { useState } from "react";
import EyeIcon from "@icons/EyeIcon";
import EyeOffIcon from "@icons/EyeOffIcon";

interface LoginFormProps {
  onSuccess?: (values: LoginFormValues) => void;
  onForgotPassword?: () => void;
}

export default function LoginForm({
  onSuccess,
  onForgotPassword,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(getLoginSchema(t)),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: LoginFormValues) {
    onSuccess?.(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formAddUser.input3")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("placeholders.email")}
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  {t("formAddUser.input5")}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••••"
                      {...field}
                      className="bg-white pr-10"
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
                <FormMessage />
              </FormItem>
            )}
          />
          <button
            type="button"
            onClick={onForgotPassword}
            className="w-full text-end text-sm font-semibold text-[#F57C00] hover:underline"
          >
            {t("global.forgot_password")}
          </button>
        </div>
        <div>
          <button type="submit" className="borange">
            {t("formAddUser.btn3")}
          </button>
        </div>
      </form>
    </Form>
  );
}
