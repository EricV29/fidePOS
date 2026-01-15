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

interface ProfileFormProps {
  onSuccess?: () => void;
}

export default function ProfileForm({ onSuccess }: ProfileFormProps) {
  const { t } = useTranslation();

  const form = useForm<AddUserFormValues>({
    resolver: zodResolver(getAddUserSchema(t)),
    defaultValues: {
      name: "",
      lastname: "",
      email: "",
      phone: "",
      password: "",
      confirmPass: "",
    },
  });

  function onSubmit(values: AddUserFormValues) {
    console.log("Form submitted:", values);
    if (onSuccess) onSuccess();
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
            name="lastname"
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
                <Input
                  type="password"
                  placeholder="••••••••••"
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
          name="confirmPass"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formAddUser.input6")}
              </FormLabel>
              <FormControl>
                <Input placeholder="*****" {...field} className="bg-white" />
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
