import { z } from "zod";
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

const addProductSchema = z.object({
  code_sku: z.string().regex(/^[0-9]+$/, "Only numeric characteres"),
  product: z.string().min(2, "Min 2 caracters").max(50),
  description: z.string().min(2, "Min 2 caracters").max(50),
  category: z.string().min(2, "Min 2 caracters").max(50),
  cost_price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Only numeric characteres"),
  unit_price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Only numeric characteres"),
  stock: z.string().regex(/^[0-9]+$/, "Only numeric characteres"),
});

export type AddProductFormValues = z.infer<typeof addProductSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
}

export default function AddProductForm({ onSuccess }: ProductFormProps) {
  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      code_sku: "",
      product: "",
      description: "",
      category: "",
      cost_price: "",
      unit_price: "",
      stock: "",
    },
  });

  function onSubmit(values: AddProductFormValues) {
    console.log("Form submitted:", values);
    if (onSuccess) onSuccess();
  }

  const optionsCategory = [
    { label: "Toys", value: "toys" },
    { label: "Maquillaje", value: "maquillaje" },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <div className="w-full flex justify-between">
          <FormField
            control={form.control}
            name="code_sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Code SKU</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="00000"
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
            name="product"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Name Product</FormLabel>
                <FormControl>
                  <Input
                    placeholder="prodcut..."
                    {...field}
                    className="bg-white"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Description</FormLabel>
              <FormControl>
                <Input placeholder="text..." {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-semibold">Category</p>
            <CustomSelect
              options={optionsCategory}
              color="#000"
              placeholder="Language"
            />
          </div>
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="00000"
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
            name="cost_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Cost Price</FormLabel>
                <FormControl>
                  <Input placeholder="$" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="unit_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Unit Price</FormLabel>
                <FormControl>
                  <Input placeholder="$" {...field} className="bg-white" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
        </div>
        <button type="submit" className="borange">
          Add Product
        </button>
      </form>
    </Form>
  );
}
