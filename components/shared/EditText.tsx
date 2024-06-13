import SectionWrapper from "@/components/sections/SectionWrapper";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";

import {Skeleton} from "@/components/ui/skeleton";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {zodResolver} from "@hookform/resolvers/zod";
import {Info} from "lucide-react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {useState} from "react";

const formSchema = z.object({
  textContent: z.string().min(1, "Cant save without any content"),
});

type EditTextProps = {
  content: string | undefined;
  toggleEditMode: () => void;
  updateContent: (content: string) => void;
};

const EditText = ({content, toggleEditMode, updateContent}: EditTextProps) => {
  const [textContent, setTextContent] = useState(content || "");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      textContent,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    updateContent(values.textContent);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 pt-2">
        <FormField
          control={form.control}
          name="textContent"
          render={({field}) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="What do you think about this place"
                  {...field}
                  rows={5}
                  className="h-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2 items-center">
          <Button
            type="submit"
            variant="outline"
            size="sm"
            className={cn("text-white hover:text-white bg-blue-500 hover:bg-blue-700")}
          >
            Save
          </Button>
          <Button onClick={toggleEditMode} size="sm" variant="outline">
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditText;
