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
import {useEffect, useMemo, useState} from "react";
import {useMutation, useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";
import {useUser} from "@clerk/nextjs";
import {cn} from "@/lib/utils";

import {CalendarIcon, MessageCircleCode, UserIcon} from "lucide-react";
import {format} from "date-fns";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {expenseCategories, FEEDBACK_LABELS} from "@/lib/constants";
import {Doc, Id} from "@/convex/_generated/dataModel";
import UserDropdown from "@/components/expenseTracker/UserDropdown";
import {Textarea} from "@/components/ui/textarea";
import {useParams} from "next/navigation";
import {TooltipContainer} from "@/components/shared/Toolip";

const formSchema = z.object({
  message: z.string().min(2),
  label: z.union([
    z.literal("issue"),
    z.literal("idea"),
    z.literal("question"),
    z.literal("complaint"),
    z.literal("featurerequest"),
    z.literal("other"),
  ]),
});

export default function FeedbackSheet() {
  const [open, setOpen] = useState(false);

  const {planId} = useParams<{planId: string}>();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const addFeedback = useMutation(api.feedback.addFeedback);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    form.reset();
    setOpen(false);

    const {label, message} = values;
    console.log({label, message});
    await addFeedback({
      planId: planId ? (planId as Id<"plan">) : undefined,
      label,
      message,
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <TooltipContainer text="Feedback">
        <SheetTrigger asChild>
          <Button size="sm" variant="ghost">
            <MessageCircleCode className="w-4 h-4" />
          </Button>
        </SheetTrigger>
      </TooltipContainer>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>We Value Your Feedback!</SheetTitle>
          <SheetDescription>
            Please take a moment to share your thoughts and help us improve.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-5">
            <FormField
              control={form.control}
              name="label"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Label" />
                      </SelectTrigger>
                      <SelectContent>
                        {FEEDBACK_LABELS.map((label) => (
                          <SelectItem value={label.id} key={label.id}>
                            {label.displayName}
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
              name="message"
              render={({field}) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      cols={10}
                      placeholder="Tell us more about your feedback"
                      className="h-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              variant="outline"
              className="bg-blue-500 hover:bg-blue-700 text-white hover:text-white"
            >
              Submit Feedback
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
