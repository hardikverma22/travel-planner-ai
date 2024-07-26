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

import {generateEmptyPlanAction} from "@/lib/actions/generateEmptyPlanAction";
import {useToast} from "@/components/ui/use-toast";
import {ACTIVITY_PREFERENCES, COMPANION_PREFERENCES} from "@/lib/constants";
import DateRangeSelector from "@/components/common/DateRangeSelector";

const formSchema = z.object({
  placeName: z
    .string({required_error: "Please select a place"})
    .min(3, "Place name should be at least 3 character long"),
  datesOfTravel: z.object({
    from: z.date(),
    to: z.date(),
  }),
  activityPreferences: z.array(z.string()),
  companion: z.optional(z.string()),
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
    defaultValues: {
      activityPreferences: [],
      companion: undefined,
      placeName: "",
      datesOfTravel: {
        from: undefined,
        to: undefined,
      },
    },
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
          name="datesOfTravel"
          render={({field}) => (
            <FormItem className="flex flex-col">
              <FormLabel>Select Dates</FormLabel>
              <DateRangeSelector
                value={field.value}
                onChange={field.onChange}
                forGeneratePlan={true}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="activityPreferences"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Select the kind of activities you want to do
                <span className="font-medium ml-1">(Optional)</span>
              </FormLabel>
              <FormControl>
                <div className="flex gap-2 flex-wrap">
                  {ACTIVITY_PREFERENCES.map((activity) => (
                    <label
                      key={activity.id}
                      className="flex-grow p-1 opacity-50 hover:opacity-100 dark:opacity-40 dark:hover:opacity-100 
                      has-[:checked]:bg-blue-100 has-[:checked]:opacity-100 dark:has-[:checked]:opacity-100
                      duration-200 transition-all ease-in-out
                      rounded-md cursor-pointer select-none
                      flex justify-center items-center
                      bg-gray-100 has-[:checked]:shadow-sm dark:bg-transparent dark:border dark:border-foreground
                      "
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={field.value?.includes(activity.id) ?? false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange([...field.value, activity.id]);
                          } else {
                            field.onChange(
                              field.value.filter(
                                (selectedActivity) => selectedActivity !== activity.id
                              )
                            );
                          }
                        }}
                      />
                      <activity.icon className="w-5 h-5 pr-1" />
                      <span>{activity.displayName}</span>
                    </label>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companion"
          render={({field}) => (
            <FormItem>
              <FormLabel>
                Who are you travelling with
                <span className="font-medium ml-1">(Optional)</span>
              </FormLabel>
              <FormControl>
                <div className="flex gap-2 flex-wrap">
                  {COMPANION_PREFERENCES.map((companion) => (
                    <label
                      key={companion.id}
                      className="flex-1 p-1 opacity-50 hover:opacity-100 dark:opacity-40 dark:hover:opacity-100 
                has-[:checked]:bg-blue-100 has-[:checked]:opacity-100 dark:has-[:checked]:opacity-100
                duration-200 transition-all ease-in-out
                rounded-md cursor-pointer select-none
                flex justify-center items-center
                bg-gray-100 has-[:checked]:shadow-sm dark:bg-transparent dark:border dark:border-foreground
                "
                    >
                      <input
                        type="radio"
                        className="hidden"
                        name="companion"
                        checked={field.value == companion.id ?? false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            field.onChange(companion.id);
                          }
                        }}
                      />
                      <companion.icon className="w-5 h-5 pr-1" />
                      <span>{companion.displayName}</span>
                    </label>
                  ))}
                </div>
              </FormControl>
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
