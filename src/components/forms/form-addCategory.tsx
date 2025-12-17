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
import {
  type AddCategoryFormValues,
  getAddCategorySchema,
} from "./schemas/category.schema";
import { useTranslation } from "react-i18next";

interface ProductFormProps {
  onSuccess?: () => void;
}

export default function AddCategoryForm({ onSuccess }: ProductFormProps) {
  const { t } = useTranslation();

  const form = useForm<AddCategoryFormValues>({
    resolver: zodResolver(getAddCategorySchema(t)),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  function onSubmit(values: AddCategoryFormValues) {
    console.log("Form submitted:", values);
    if (onSuccess) onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="w-full flex justify-between items-end">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  {t("formAddCategory.input1")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("formAddCategory.place1")}
                    {...field}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-[180px] flex justify-start items-center p-2 gap-2 bg-[#FFEFDE] cursor-pointer rounded-[15px]">
            <input
              type="color"
              className="w-6 h-6 rounded-full cursor-pointer p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full"
            />
            <p className="font-semibold text-[#F57C00]">Color</p>
          </div>
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                {t("formAddCategory.input3")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("formAddCategory.place3")}
                  {...field}
                  className="bg-white"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" className="borange">
          {t("formAddCategory.btn")}
        </button>
      </form>
    </Form>
  );
}
