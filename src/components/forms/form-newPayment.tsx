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

const newPaymentSchema = z.object({
  payment_amount: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Only numeric characteres"),
  note: z.string().min(2, "Min 2 caracters").max(50),
});

export type NewPaymentFormValues = z.infer<typeof newPaymentSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
}

export default function NewPaymentForm({ onSuccess }: ProductFormProps) {
  const form = useForm<NewPaymentFormValues>({
    resolver: zodResolver(newPaymentSchema),
    defaultValues: {
      payment_amount: "",
      note: "",
    },
  });

  function onSubmit(values: NewPaymentFormValues) {
    console.log("Form submitted:", values);
    if (onSuccess) onSuccess();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="payment_amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Payment Amount</FormLabel>
              <FormControl>
                <Input placeholder="$" {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Note</FormLabel>
              <FormControl>
                <Input placeholder="text..." {...field} className="bg-white" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit" className="borange">
          Payment
        </button>
      </form>
    </Form>
  );
}
