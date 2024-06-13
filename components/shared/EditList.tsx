"use client";

import {useFieldArray} from "react-hook-form";
import {z} from "zod";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Plus, TrashIcon} from "lucide-react";
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";
import {useZodForm} from "@/hooks/useZodForm";

const validationSchema = z.object({
  items: z.array(
    z.object({
      itemId: z.string(),
      text: z.string().min(3),
    })
  ),
});

type ItemType = z.infer<typeof validationSchema>["items"][number];

type EditListProps = {
  arrayData: string[];
  handleToggleEditMode: () => void;
  updateData: (updatedArray: string[]) => void;
};

const EditList = ({arrayData, handleToggleEditMode, updateData}: EditListProps) => {
  const [items, setItems] = useState<ItemType[]>(() =>
    arrayData.map((item, index) => {
      return {
        itemId: index.toString(),
        text: item,
      };
    })
  );

  const {
    handleSubmit,
    register,
    control,
    getFieldState,
    formState: {isValid, errors, isDirty},
  } = useZodForm({
    schema: validationSchema,
    defaultValues: {items},
    mode: "onTouched",
  });

  const {fields, append, remove} = useFieldArray({
    name: "items",
    control,
  });

  const addNewControl = () => {
    append(
      {
        itemId: "new",
        text: "",
      },
      {
        shouldFocus: false,
      }
    );
  };

  const isSubmittable = !!isDirty && !!isValid;

  const onSaveEditList = (data: {items: ItemType[]}) => {
    const updatedArray = data.items.map((item) => item.text);
    updateData(updatedArray);
  };

  return (
    <div className="w-2/3">
      <form onSubmit={handleSubmit(onSaveEditList)} className="flex flex-col gap-1">
        {fields.map((field, index) => {
          const errorForField = errors?.items?.[index]?.text;
          const state = getFieldState(`items.${index}.text`);
          return (
            <div className="flex gap-5 w-full justify-center items-center" key={field.id}>
              <div className="flex-1 flex-col gap-2 flex justify-center items-center">
                <Input
                  {...register(`items.${index}.text` as const)}
                  placeholder="Type the item name"
                  defaultValue={field.text}
                  className={cn(
                    "border p-2 border-gray-300 w-full",
                    state.isTouched && errorForField && "border-red-500 border-2"
                  )}
                />
                {errorForField?.message && !state.isTouched && (
                  <p className="text-sm font-thin text-red-400">
                    {state.isDirty && errorForField?.message}
                  </p>
                )}
              </div>

              <Button
                className="text-gray-500 rounded-full p-3"
                variant="outline"
                size="lg"
                onClick={() => remove(index)}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          );
        })}

        <div className="flex justify-between gap-2 mt-5 w-[90%]">
          <Button onClick={addNewControl} variant="outline" className="text-center">
            <Plus /> Add New Item
          </Button>
          <div className="flex gap-2 justify-between">
            <Button disabled={!isSubmittable} size="sm" variant="outline">
              Save
            </Button>
            <Button onClick={handleToggleEditMode} size="sm" variant="outline">
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditList;
