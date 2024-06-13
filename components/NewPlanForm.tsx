"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {useAuth} from "@clerk/nextjs";
import {Dispatch, SetStateAction, useState, useTransition} from "react";
import * as z from "zod";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Loader2, MessageSquarePlus, Wand2} from "lucide-react";
import {generatePlanAction} from "@/lib/actions/generateplanAction";
import PlacesAutoComplete from "@/components/PlacesAutoComplete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {generateEmptyPlanAction} from "@/lib/actions/generateEmptyPlanAction";
import {useToast} from "@/components/ui/use-toast";

export const formSchema = z.object({
  placeName: z
    .string({required_error: "Please select a place"})
    .min(3, "Place name should be at least 3 character long"),
  noOfDays: z.string({
    required_error: "Please select number of days.",
  }),
});

export type formSchemaType = z.infer<typeof formSchema>;

const NewPlanForm = ({closeModal}: {closeModal: Dispatch<SetStateAction<boolean>>}) => {
  const {isSignedIn} = useAuth();
  if (!isSignedIn) return null;

  const [pendingEmptyPlan, startTransactionEmptyPlan] = useTransition();
  const [pendingAIPlan, startTransactionAiPlan] = useTransition();

  const [selectedFromList, setSelectedFromList] = useState(false);
  const {toast} = useToast();

  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmitEmptyPlan(values: z.infer<typeof formSchema>) {
    if (!selectedFromList) {
      form.setError("placeName", {
        message: "Place should be selected from the list",
        type: "custom",
      });
      return;
    }

    startTransactionEmptyPlan(async () => {
      const planId = await generateEmptyPlanAction(values);
      closeModal(false);
      if (planId === null) {
        toast({
          title: "Error",
          description: "Error received from server action",
        });
      }
    });
  }

  async function onSubmitAIPlan(values: z.infer<typeof formSchema>) {
    if (!selectedFromList) {
      form.setError("placeName", {
        message: "Place should be selected from the list",
        type: "custom",
      });
      return;
    }

    startTransactionAiPlan(async () => {
      const planId = await generatePlanAction(values);
      closeModal(false);
      if (planId === null) {
        console.log("Error received from server action");
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-4">
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

              <Select onValueChange={field.onChange}>
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
        <div className="w-full flex justify-between gap-1">
          <Button
            onClick={() => form.handleSubmit(onSubmitEmptyPlan)()}
            aria-label="generate plan"
            type="submit"
            disabled={pendingEmptyPlan || pendingAIPlan || !form.formState.isValid}
            className="bg-blue-500 text-white hover:bg-blue-600 w-full"
          >
            {pendingEmptyPlan ? (
              <div className="flex gap-1 justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating Travel Plan...</span>
              </div>
            ) : (
              <div className="flex gap-1 justify-center items-center">
                <MessageSquarePlus className="h-4 w-4" />
                <span>Create Your Plan</span>
              </div>
            )}
          </Button>

          <Button
            onClick={() => form.handleSubmit(onSubmitAIPlan)()}
            aria-label="generate AI plan"
            type="submit"
            disabled={pendingAIPlan || pendingEmptyPlan || !form.formState.isValid}
            className="bg-indigo-500 text-white hover:bg-indigo-600 w-full group"
          >
            {pendingAIPlan ? (
              <div className="flex gap-1 justify-center items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <span>Generating AI Travel Plan...</span>
              </div>
            ) : (
              <div className="flex gap-1 justify-center items-center ">
                <Wand2 className="h-4 w-4 group-hover:animate-pulse" />
                <span>Generate AI Plan</span>
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default NewPlanForm;
