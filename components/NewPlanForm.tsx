"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useAuth} from "@clerk/nextjs";
import {useState, useTransition} from "react";
import * as z from "zod";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Loader2} from "lucide-react";
import {generatePlanAction} from "@/lib/actions/generateplanAction";
import PlacesAutoComplete from "@/components/PlacesAutoComplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const formSchema = z.object({
  // promptText: z.string().min(1, "I can't use my AI powers without your imagination"),
  placeName: z
    .string({required_error: "Please select a place"})
    .min(3, "Place name should be at least 3 character long"),
  noOfDays: z.string({
    required_error: "Please select number of days.",
  }),
});

export type formSchemaType = z.infer<typeof formSchema>;

const NewPlanForm = () => {
  const {isSignedIn} = useAuth();
  if (!isSignedIn) return null;

  const [pending, startTransaction] = useTransition();
  const [selectedFromList, setSelectedFromList] = useState(false);

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedFromList) {
      form.setError("placeName", {
        message: "Place should be selected from the list",
        type: "custom",
      });
      return;
    }
    startTransaction(async () => {
      const planId = await generatePlanAction(values);

      if (planId === null) {
        console.log("Error received from server action");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="placeName"
          render={({field}) => (
            <FormItem>
              <FormLabel>Search for your destination city</FormLabel>
              <FormControl>
                <PlacesAutoComplete
                  field={field}
                  form={form}
                  selectedFromList={selectedFromList}
                  setSelectedFromList={setSelectedFromList}
                />
                {/* <Input placeholder="e.g. 3 days trip to Mathura" {...field} disabled={pending} /> */}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="noOfDays"
          render={({field}) => (
            <FormItem>
              <FormLabel>Number of Days</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select number of days" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[...new Array(10)].map((_, index) => (
                    <SelectItem key={index} value={(index + 1).toString()}>
                      {index + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          aria-label="generate plan"
          type="submit"
          disabled={pending || !form.formState.isValid}
          className="bg-blue-500 text-white hover:bg-blue-600"
        >
          {pending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Generating Travel Plan...</span>
            </>
          ) : (
            <span>Generate Plan</span>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default NewPlanForm;
