"use client";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useState} from "react";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useUser} from "@clerk/nextjs";
import {cn} from "@/lib/utils";

import {Bus, CalendarIcon, Gift, Hotel, Pizza, ShieldQuestion, ShoppingCart} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {expenseCategories} from "@/lib/constants";
import {Doc} from "@/convex/_generated/dataModel";
import Link from "next/link";

const formSchema = z.object({
  purpose: z.string().min(2).max(50),
  category: z.union([
    z.literal("food"),
    z.literal("commute"),
    z.literal("shopping"),
    z.literal("gifts"),
    z.literal("accomodations"),
    z.literal("others"),
  ]),
  amount: z.coerce.number(),
  date: z.date(),
});

export function ExpenseSheet({
  planId,
  data,
  edit,
}: {
  planId: string;
  edit?: boolean;
  data?: Doc<"expenses">;
}) {
  if (edit && !data) return;

  const [open, setOpen] = useState(false);
  const {user} = useUser();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: !edit
      ? {}
      : {
          amount: data?.amount,
          category: data?.category,
          purpose: data?.purpose,
          date: new Date(data?.date!),
        },
  });

  const addExpense = useMutation(api.expenses.createExpense);
  const updateExpense = useMutation(api.expenses.updateExpense);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user || !user.id) return;
    form.reset();
    setOpen(false);
    if (edit) {
      await updateExpense({
        id: data?._id!,
        amount: values.amount,
        category: values.category,
        purpose: values.purpose,
        date: values.date.toISOString(),
      });
    } else {
      await addExpense({
        planId: planId,
        userId: user?.id,
        amount: values.amount,
        category: values.category,
        purpose: values.purpose,
        date: values.date.toISOString(),
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {edit ? (
          <span className="hover:underline hover:underline-offset-2 text-blue-600 hover:font-medium cursor-pointer">
            {data?.purpose}
          </span>
        ) : (
          <Button
            size="sm"
            variant="default"
            className="bg-blue-500 text-white hover:bg-blue-700hover:text-white"
          >
            Add a New Expense
          </Button>
        )}
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{edit ? "Edit Expense" : "Add Expense"}</SheetTitle>
          <SheetDescription>
            {edit ? "Edit" : "Add"} your expenses during the travel to efficiently track it at the
            end.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-5">
            <FormField
              control={form.control}
              name="purpose"
              render={({field}) => (
                <FormItem>
                  <FormLabel>For</FormLabel>
                  <FormControl>
                    <Input placeholder="What what pupose did you spend?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {expenseCategories.map((category) => (
                          <SelectItem value={category.key}>
                            <div className="flex gap-2 items-center">
                              {category.icon}
                              <span>{category.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Amount(₹)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. ₹1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({field}) => (
                <FormItem className="flex flex-col">
                  <FormLabel>On</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 z-50 bg-white" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              variant="outline"
              className={cn("text-white hover:text-white", {
                "bg-teal-500 hover:bg-teal-700": edit,
                "bg-blue-500 hover:bg-blue-700": !edit,
              })}
            >
              {edit ? "Update" : "Add"} Expense
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
