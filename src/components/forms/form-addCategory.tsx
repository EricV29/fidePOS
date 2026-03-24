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
import { cn } from "@/lib/utils";
import type { Categories } from "@typesm/categories";
import { useEffect, useState } from "react";

interface ProductFormProps {
  data?: Categories;
  onSuccess?: (values: AddCategoryFormValues, editActive: boolean) => void;
}

export default function AddCategoryForm({ data, onSuccess }: ProductFormProps) {
  const { t } = useTranslation();
  const [editActive, setEditActive] = useState(false);
  const [categoryId, setCategoryId] = useState<number | undefined>();

  const form = useForm<AddCategoryFormValues>({
    resolver: zodResolver(getAddCategorySchema(t)),
    defaultValues: {
      name: "",
      description: "",
      color: "#f57c00",
    },
  });

  function onSubmit(values: AddCategoryFormValues) {
    const datav = { ...values, id: categoryId };
    onSuccess?.(datav, editActive);
  }

  useEffect(() => {
    if (data) {
      setEditActive(true);
      form.setValue("name", data.name);
      form.setValue("description", data.description);
      form.setValue("color", data.color);

      setCategoryId(data.id);
    }
  }, [data, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="w-full flex justify-between items-end">
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
                  {t("formAddCategory.input1")}
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
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold block mb-2">
                  Color
                </FormLabel>
                <FormControl>
                  <div className="w-[180px] flex justify-start items-center p-2 gap-2 bg-[#FFEFDE] dark:bg-[#353935] dark:border-[#FFEFDE] border cursor-pointer rounded-[15px]">
                    <input
                      type="color"
                      {...field}
                      className="w-6 h-6 rounded-full cursor-pointer p-0 border-none bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-full [&::-webkit-color-swatch]:border-none"
                    />
                    <p className="font-semibold text-[#F57C00]">
                      {field.value || "#000000"}{" "}
                    </p>
                  </div>
                </FormControl>
                <FormMessage className="text-red-600 dark:text-red-400" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel
                className={cn(
                  "font-semibold",
                  fieldState.error && "text-red-600 dark:text-red-400",
                )}
              >
                {t("formAddCategory.input3")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={t("placeholders.text")}
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
          {data ? t("formAddCategory.btn_edit") : t("formAddCategory.btn")}
        </button>
      </form>
    </Form>
  );
}
