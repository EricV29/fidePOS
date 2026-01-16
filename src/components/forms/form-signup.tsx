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
import { useState } from "react";
import EyeIcon from "@icons/EyeIcon";
import EyeOffIcon from "@icons/EyeOffIcon";

interface ProfileFormProps {
  onSuccess?: (values: AddUserFormValues) => void;
}

export default function ProfileForm({ onSuccess }: ProfileFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const { t } = useTranslation();

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="w-full flex justify-between">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  {t("formAddUser.input1")}
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
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  {t("formAddUser.input2")}
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
        </div>
        <div className="w-full flex justify-between">
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
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  {t("formAddUser.input4")}
                </FormLabel>
                <FormControl>
                  <Input placeholder="52+" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
        <FormField
          control={form.control}
          name="confirmPass"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formAddUser.input6")}
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showCPassword ? "text" : "password"}
                    placeholder="••••••••••"
                    {...field}
                    className="bg-white pr-10"
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
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" className="borange">
          {t("formAddUser.btn2")}
        </button>
      </form>
    </Form>
  );
}
