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
import CustomSelect from "@components/Select";
import {
  type AddProductFormValues,
  getAddProductSchema,
} from "./schemas/product.schema";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import type { CategoriesSelect } from "@typesm/categories";
import { useModal } from "@/context/ModalContext";
import AUTH_CODES from "../../../constants/authCodes.json";

interface ProductFormProps {
  onSuccess?: (values: AddProductFormValues) => void;
}

export default function AddProductForm({ onSuccess }: ProductFormProps) {
  const { t } = useTranslation();
  const [optionsCategory, setoptionsCategory] = useState<CategoriesSelect[]>(
    [],
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    string | undefined
  >();
  const { triggerResponseAlert } = useModal();

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(getAddProductSchema(t)),
    defaultValues: {
      code_sku: "",
      product: "",
      description: "",
      cost_price: "",
      unit_price: "",
      stock: "",
    },
  });

  function onSubmit(values: AddProductFormValues) {
    if (!selectedCategoryId) {
      triggerResponseAlert(AUTH_CODES.NOT_CATEGORY_SELECT);
      return;
    }

    const data = { ...values, category: selectedCategoryId };
    onSuccess?.(data);
  }

  const loadSelect = async () => {
    const response = await window.electronAPI.getCategoriesSelect();
    if (response.success && response.result) {
      setoptionsCategory(response.result);
    }
  };

  useEffect(() => {
    loadSelect();
  }, []);

  const optionsCategories = useMemo(() => {
    return optionsCategory.map((c) => ({
      label: `${c.name}`,
      value: c.id?.toString(),
    }));
  }, [optionsCategory]);

  const handleChangeCategory = (value: string) => {
    if (!value || value === selectedCategoryId) {
      setSelectedCategoryId(undefined);
    } else {
      setSelectedCategoryId(value);
    }
  };

  // const optionsCategory = [
  //   { label: "Toys", value: "toys" },
  //   { label: "Maquillaje", value: "maquillaje" },
  // ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="w-full flex justify-between items-end">
          <FormField
            control={form.control}
            name="code_sku"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    "font-semibold",
                    fieldState.error && "text-red-600 dark:text-red-400",
                  )}
                >
                  <div className="w-55">
                    <p>{t("formAddProduct.input1")}</p>
                    <p className="text-[13px] font-light">
                      {t("placeholders.code_sku")}
                    </p>
                  </div>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0000"
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
            name="product"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    "font-semibold",
                    fieldState.error && "text-red-600 dark:text-red-400",
                  )}
                >
                  {t("formAddProduct.input2")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("placeholders.product")}
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
                {t("formAddProduct.input3")}
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
        <div className="w-full flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">{t("formAddProduct.input4")}</p>
            <CustomSelect
              options={optionsCategories}
              color="#F57C00"
              placeholder={t("placeholders.select")}
              value={selectedCategoryId}
              onChange={handleChangeCategory}
            />
          </div>
          <FormField
            control={form.control}
            name="stock"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    "font-semibold",
                    fieldState.error && "text-red-600 dark:text-red-400",
                  )}
                >
                  {t("formAddProduct.input5")}
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="00000"
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
            name="cost_price"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    "font-semibold",
                    fieldState.error && "text-red-600 dark:text-red-400",
                  )}
                >
                  {t("formAddProduct.input6")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="$"
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
            name="unit_price"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    "font-semibold",
                    fieldState.error && "text-red-600 dark:text-red-400",
                  )}
                >
                  {t("formAddProduct.input7")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="$"
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
          />{" "}
        </div>
        <button type="submit" className="borange">
          {t("formAddProduct.btn")}
        </button>
      </form>
    </Form>
  );
}
