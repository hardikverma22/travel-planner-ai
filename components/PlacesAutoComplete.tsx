"use client";
import {Input} from "@/components/ui/input";
import {ChangeEvent, Dispatch, MouseEvent, SetStateAction, useState} from "react";
import usePlacesService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import {Loading} from "@/components/shared/Loading";
import {ControllerRenderProps, UseFormReturn} from "react-hook-form";
import {formSchemaType} from "@/components/NewPlanForm";

type PlacesAutoCompleteProps = {
  selectedFromList: boolean;
  setSelectedFromList: Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<formSchemaType, any, undefined>;
  field: ControllerRenderProps<formSchemaType, "placeName">;
};

const PlacesAutoComplete = ({
  form,
  field,
  selectedFromList,
  setSelectedFromList,
}: PlacesAutoCompleteProps) => {
  const [showReults, setShowResults] = useState(false);

  const {placesService, placePredictions, getPlacePredictions, isPlacePredictionsLoading} =
    usePlacesService({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
      options: {
        types: ["(cities)"],
        input: field.value,
      },
    });

  const hadleSelectItem = (e: MouseEvent<HTMLLIElement>, description: string) => {
    e.stopPropagation();
    form.clearErrors("placeName");

    setShowResults(false);
    setSelectedFromList(true);

    form.setValue("placeName", description);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (selectedFromList) {
      form.setError("placeName", {
        message: "Place should be selected from the list",
        type: "custom",
      });
      setSelectedFromList(false);
    }

    const value = e.target.value;
    field.onChange(e.target.value);

    //predictions
    if (value) {
      getPlacePredictions({input: value});
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search for your destination city..."
          onChange={handleSearch}
          onBlur={() => setShowResults(false)}
          value={field.value}
        />
        {isPlacePredictionsLoading && (
          <div className="absolute right-3 top-0 h-full flex items-center">
            <Loading className="w-6 h-6" />
          </div>
        )}
      </div>
      {showReults && (
        <div
          className="absolute w-full
        mt-2 shadow-md rounded-xl p-1 bg-background max-h-80 overflow-auto
        z-50"
          onMouseDown={(e) => e.preventDefault()}
        >
          <ul className="w-full flex flex-col gap-2" onMouseDown={(e) => e.preventDefault()}>
            {placePredictions.map((item) => (
              <li
                className="cursor-pointer
                border-b 
                flex justify-between items-center
                hover:bg-muted hover:rounded-lg
                px-1 py-2 text-sm"
                onClick={(e) => hadleSelectItem(e, item.description)}
                key={item.place_id}
              >
                {item.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PlacesAutoComplete;
