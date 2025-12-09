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

const addCategorySchema = z.object({
  name: z.string().min(2, "Min 2 caracters").max(50),
  description: z.string().min(2, "Min 2 caracters").max(50),
  color: z.string().min(2, "Min 2 caracters").max(50),
});

export type AddCategoryFormValues = z.infer<typeof addCategorySchema>;

interface ProductFormProps {
  onSuccess?: () => void;
}

export default function AddCategoryForm({ onSuccess }: ProductFormProps) {
  const form = useForm<AddCategoryFormValues>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: "",
      description: "",
      color: "",
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
                <FormLabel className="font-semibold">Name Category</FormLabel>
                <FormControl>
                  <Input
                    placeholder="category..."
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
            <p className="font-semibold text-[#F57C00]">Select color</p>
          </div>
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
        <button type="submit" className="borange">
          Add Category
        </button>
      </form>
    </Form>
  );
}
