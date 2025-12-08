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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const addCustomerSchema = z.object({
  name: z.string().min(2, "Min 2 caracters").max(50),
  lastname: z.string().min(2, "Min 2 caracters").max(50),
  phone: z.string().regex(/^[0-9]{10}$/, "Number of 10 digits"),
});

export type AddCustomerFormValues = z.infer<typeof addCustomerSchema>;

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function AddCustomerForm({ onSuccess }: LoginFormProps) {
  const form = useForm<AddCustomerFormValues>({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      name: "",
      lastname: "",
      phone: "",
    },
  });

  function onSubmit(values: AddCustomerFormValues) {
    console.log("Form submitted:", values);
    if (onSuccess) onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">First Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} className="bg-white" />
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
              <FormLabel className="font-semibold">Lastname</FormLabel>
              <FormControl>
                <Input placeholder="lastname" {...field} className="bg-white" />
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
              <FormLabel className="font-semibold">Phone</FormLabel>
              <FormControl>
                <Input placeholder="52+" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" className="borange">
          Add Customer
        </button>
      </form>
    </Form>
  );
}
