"use client";
import {useEffect, useState} from "react";
import {z} from "zod";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {Loading} from "@/components/shared/Loading";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {cn} from "@/lib/utils";

import {useToast} from "@/components/ui/use-toast";
import currencies from "@/lib/currencies.json";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery} from "convex/react";
import {ConvexError} from "convex/values";
import {useForm} from "react-hook-form";

const formSchema = z.object({
  currency: z.string().min(1, {message: "You will have to pick a preffered currency."}),
});

const CurrencySelector = ({planId}: {planId: string}) => {
  const [isSending, setIsSending] = useState(false);
  const {toast} = useToast();

  const addPreferredCurrency = useMutation(api.planSettings.addPreferredCurrency);
  const preferredCurrency = useQuery(api.planSettings.getPreferredCurrency, {
    planId: planId as Id<"plan">,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currency: preferredCurrency || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSending(true);

    if (!planId || planId.length == 0) return;
    try {
      await addPreferredCurrency({
        planId: planId as Id<"plan">,
        currencyCode: values.currency,
      });
      form.reset();
      toast({
        description: (
          <div className="font-sans flex justify-start items-center gap-1">
            Your preferences have been saved!
          </div>
        ),
      });
    } catch (error) {
      if (error instanceof ConvexError) {
        const msg = error.data as string;
        toast({
          title: "Error",
          description: msg,
          variant: "destructive",
        });
      }
    }
    form.reset();
    setIsSending(false);
  };

  useEffect(() => {
    if (preferredCurrency) {
      form.setValue("currency", preferredCurrency);
    }
  }, [preferredCurrency]);

  return (
    <article className="bg-background shadow-sm rounded-lg p-4 border-2 border-border">
      <h2 className="border-b-2 border-b-border pb-2 mb-2 font-bold font-md">Preffered Currency</h2>

      <h3 className="text-neutral-500 dark:text-neutral-400 mb-4 flex text-sm sm:text-base">
        Select your preffered currency for this plan which can be used in expenses section.
      </h3>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex gap-3 justify-start items-center"
        >
          <FormField
            control={form.control}
            name="currency"
            render={({field}) => (
              <FormItem>
                <FormControl>
                  <Select
                    disabled={isSending || preferredCurrency === undefined}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={preferredCurrency == null ? undefined : preferredCurrency}
                  >
                    <SelectTrigger className="max-w-md">
                      <SelectValue
                        placeholder={
                          preferredCurrency === undefined
                            ? "Laoding preffered Currency"
                            : "Select a Currency"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Currency</SelectLabel>
                        {currencies.map((currency) => (
                          <SelectItem value={currency.cc} key={currency.cc}>
                            {currency.cc} - {currency.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="ml-1" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isSending || preferredCurrency === undefined}
            className={cn("text-white hover:text-white bg-blue-500 hover:bg-blue-700")}
          >
            {isSending ? (
              <div className="flex justify-center items-center gap-2">
                <Loading className="w-4 h-4" /> Saving Prefernces...
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
      <p className="font-sans text-sm text-muted-foreground pt-3">
        Note: System defaults to INR if no currency is preffered.
      </p>
    </article>
  );
};

export default CurrencySelector;
