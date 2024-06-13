"use client";
import {useEffect, useState} from "react";
import {z} from "zod";

import {Loading} from "@/components/shared/Loading";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {api} from "@/convex/_generated/api";
import {cn} from "@/lib/utils";

import {useToast} from "@/components/ui/use-toast";
import {zodResolver} from "@hookform/resolvers/zod";
import {useMutation, useQuery} from "convex/react";
import {ConvexError} from "convex/values";
import {useForm} from "react-hook-form";
import {Input} from "@/components/ui/input";

const formSchema = z.object({
  firstName: z.string().min(1, {message: "First Name is mandatory!"}),
  lastName: z.optional(z.string()),
});

const DisplayName = () => {
  const [isSending, setIsSending] = useState(false);
  const {toast} = useToast();

  const updateDisplayName = useMutation(api.users.updateDisplayName);
  const currentUser = useQuery(api.users.currentUser);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: currentUser?.firstName ?? "",
      lastName: currentUser?.lastName ?? "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSending(true);
    const {firstName, lastName} = values;

    try {
      await updateDisplayName({
        firstName,
        lastName: lastName ?? "",
      });
      form.reset();
      toast({
        description: (
          <div className="font-sans flex justify-start items-center gap-1">
            Display Name has been updated!
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
    if (!currentUser) return;

    const {firstName, lastName} = currentUser;
    if (firstName) form.setValue("firstName", firstName);
    if (lastName) form.setValue("lastName", lastName);
  }, [currentUser]);

  const shouldGetDisabled = isSending || currentUser === undefined;

  return (
    <article className="bg-background shadow-sm rounded-lg p-4 border-2 border-border">
      <h2 className="border-b-2 border-b-border pb-2 mb-2 font-bold ">Display Name</h2>

      <h3 className="text-neutral-500 dark:text-neutral-400 mb-4 flex text-sm sm:text-base">
        Set your own display name
      </h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
          <FormField
            control={form.control}
            name="firstName"
            render={({field}) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. John"
                    {...field}
                    className="max-w-md"
                    disabled={shouldGetDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({field}) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Doe"
                    {...field}
                    className="max-w-md"
                    disabled={shouldGetDisabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            variant="outline"
            disabled={shouldGetDisabled}
            className={cn("text-white hover:text-white bg-blue-500 hover:bg-blue-700")}
          >
            {isSending ? (
              <div className="flex justify-center items-center gap-2">
                <Loading className="w-4 h-4" /> Saving Display Name...
              </div>
            ) : (
              "Save"
            )}
          </Button>
        </form>
      </Form>
    </article>
  );
};

export default DisplayName;
