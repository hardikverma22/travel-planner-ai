import ErrorMessage from "@/components/addNewItineraryDay/ErrorMessage";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import {cn} from "@/lib/utils";
import {Label} from "@radix-ui/react-label";
import {TabsContent} from "@radix-ui/react-tabs";
import {TrashIcon, Plus} from "lucide-react";
import {register} from "module";
import {Input} from "@/components/ui/input";
import {
  FieldErrors,
  UseFieldArrayRemove,
  UseFormGetFieldState,
  UseFormRegister,
} from "react-hook-form";
import {ItineraryType} from "@/components/addNewItineraryDay/ItineraryDayForm";

type TabContentProps = {
  tabName: "morning" | "afternoon" | "evening";
  addNewControl: (fieldArrayName: string) => void;
  register: UseFormRegister<{
    itinerary: ItineraryType;
  }>;
  fields: {
    itineraryItem: string;
    briefDescription: string;
    id: string;
  }[];
  errors: FieldErrors<{
    itinerary: ItineraryType;
  }>;
  getFieldState: UseFormGetFieldState<{
    itinerary: ItineraryType;
  }>;
  remove: UseFieldArrayRemove;
};

export default function CustomTabContent({
  tabName,
  register,
  fields,
  errors,
  getFieldState,
  remove,
  addNewControl,
}: TabContentProps) {
  return (
    <TabsContent value={tabName}>
      {fields.map((field, index) => {
        const errorForFieldPlaceName =
          errors?.itinerary?.activities?.[tabName]?.[index]?.itineraryItem;
        const errorForFieldPlaceDesc =
          errors?.itinerary?.activities?.[tabName]?.[index]?.briefDescription;

        const itineraryItemState = getFieldState(
          `itinerary.activities.${tabName}.${index}.itineraryItem`
        );
        const briefDescriptionState = getFieldState(
          `itinerary.activities.${tabName}.${index}.briefDescription`
        );

        return (
          <div
            className="flex flex-col gap-5 w-full justify-start items-center
                    mt-2 bg-background px-3 py-2 rounded-lg"
            key={field.id}
          >
            <div className="flex flex-col gap-2 justify-center items-start w-full">
              <div className="flex justify-between w-full items-center">
                <Label
                  className="text-sm font-bold font-sans tracking-wide"
                  htmlFor={`itinerary.activities.${tabName}.${index}.itineraryItem`}
                >
                  Name of the Place
                </Label>
                <Button
                  className="text-gray-500 rounded-full p-3"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <TrashIcon className="w-4 h-4 hover:text-red-500" />
                </Button>
              </div>
              <Input
                {...register(`itinerary.activities.${tabName}.${index}.itineraryItem` as const)}
                placeholder="Name of the place"
                defaultValue={field.itineraryItem}
                id={`itinerary.activities.${tabName}.${index}.itineraryItem`}
                className={cn(
                  "border p-2 border-gray-300 w-full flex-1",
                  itineraryItemState.isTouched &&
                    errorForFieldPlaceName &&
                    "border-red-500 border-2"
                )}
              />
              <ErrorMessage
                error={errorForFieldPlaceName}
                isTouched={itineraryItemState.isTouched}
              />
            </div>
            <div className="flex flex-col gap-2 justify-center items-start w-full">
              <Label
                htmlFor={`itinerary.activities.${tabName}.${index}.briefDescription`}
                className="text-sm font-bold font-sans tracking-wide"
              >
                Description of the place
              </Label>

              <Textarea
                {...register(`itinerary.activities.${tabName}.${index}.briefDescription` as const)}
                placeholder="How would you describe it?"
                defaultValue={field.itineraryItem}
                id={`itinerary.activities.${tabName}.${index}.briefDescription`}
                className={cn(
                  "border p-2 border-gray-300 w-full",
                  briefDescriptionState.isTouched &&
                    errorForFieldPlaceDesc &&
                    "border-red-500 border-2"
                )}
              />
              {errorForFieldPlaceDesc?.message && briefDescriptionState.isTouched && (
                <p className="text-sm font-thin text-red-400">{errorForFieldPlaceDesc?.message}</p>
              )}
            </div>
          </div>
        );
      })}
      <Button onClick={() => addNewControl(tabName)} variant="outline" className="text-center">
        <Plus /> Add New Place
      </Button>
    </TabsContent>
  );
}
