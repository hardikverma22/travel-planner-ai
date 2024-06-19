"use client";
import Map from "@/components/plan/Map";
import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Doc, Id} from "@/convex/_generated/dataModel";
import {colors} from "@/lib/constants";
import {ScrollArea} from "@/components/ui/scroll-area";
import {DeleteIcon, MapPin, Trash} from "lucide-react";
import {useEffect, useState} from "react";
import {Loading} from "@/components/shared/Loading";
import LocationAutoComplete from "@/components/LocationAutoComplete";
// import {Autocomplete} from "@react-google-maps/api";
import Autocomplete from "react-google-autocomplete";
import {MapProvider} from "@/contexts/MapProvider";
import {Button} from "@/components/ui/button";
import {useMutation} from "convex/react";
import {api} from "@/convex/_generated/api";
import {toast} from "@/components/ui/use-toast";

type location = {
  lat: number;
  lng: number;
};

type TopPlacesToVisitProps = {
  topPlacesToVisit: Doc<"plan">["topplacestovisit"] | undefined;
  planId: string;
  isLoading: boolean;
};

const TopPlacesToVisit = ({topPlacesToVisit, planId, isLoading}: TopPlacesToVisitProps) => {
  const doesTopPlacesToVisitExist = topPlacesToVisit != null && topPlacesToVisit.length > 0;

  const [selectedPlace, setSelectedPlace] = useState<location | undefined>();
  const updateTopPlacesToVisit = useMutation(api.plan.updatePartOfPlan);

  useEffect(() => {
    if (!doesTopPlacesToVisitExist) return;
    setSelectedPlace(topPlacesToVisit[0].coordinates);
  }, [doesTopPlacesToVisitExist]);

  const onClickPlace = (e: React.MouseEvent<HTMLLIElement>, coordinates: location) => {
    e.preventDefault();
    setSelectedPlace(coordinates);
  };

  const handleDeletPlace = (placeName: string) => {
    if (!topPlacesToVisit) return;
    const copy = [...topPlacesToVisit].filter((place) => !place.name.includes(placeName));
    const {dismiss} = toast({
      description: `Deleting the place to visit!`,
    });
    updateTopPlacesToVisit({
      data: copy,
      key: "topplacestovisit",
      planId: planId as Id<"plan">,
    }).then(() => {
      dismiss();
    });
  };

  return (
    <SectionWrapper id="topplacestovisit">
      <h2 className="mb-2 text-lg font-semibold tracking-wide flex items-center">
        <MapPin className="mr-2" /> Top places to visit
      </h2>

      <div className="flex flex-col bg-blue-50 dark:bg-background rounded-md lg:flex-row">
        <div className="w-full h-[30rem]">
          {isLoading ? (
            <SkeletonForTopPlacesToVisit />
          ) : (
            <div className="p-2 h-full flex justify-center items-start ">
              <ScrollArea className="h-full w-full rounded-md border">
                <ol className="flex-1 flex flex-col gap-2 p-5">
                  <li
                    key="addNewPlace"
                    className="dark:bg-muted bg-white font-bold cursor-pointer
                          flex-1 shadow-md"
                  >
                    <LocationAutoComplete planId={planId} />
                  </li>
                  <hr className="font-bold text-black" />
                  {topPlacesToVisit?.map((place, index) => (
                    <li
                      key={place.name}
                      className="p-5 dark:bg-muted bg-white font-bold cursor-pointer
                          flex-1 shadow-md hover:shadow-lg flex justify-between items-center
                          hover:ring-2  hover:ring-blue-300  duration-500"
                      onClick={(e) => onClickPlace(e, place.coordinates)}
                    >
                      <div>
                        <span className="mr-2" style={{color: `${colors[index % 6]}`}}>
                          {index + 1}.
                        </span>
                        <span className="font-normal dark:text-muted-foreground">{place.name}</span>
                      </div>
                      <Button
                        variant="outline"
                        className="border-none hover:scale-110 duration-200 transition-all "
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleDeletPlace(place.name);
                        }}
                      >
                        <Trash className="h-4 w-4 text-red-500 dark:text-white" />
                      </Button>
                    </li>
                  ))}
                </ol>
              </ScrollArea>
            </div>
          )}
        </div>
        <div className="w-full p-2 h-[30rem]">
          <MapProvider isLoading={isLoading}>
            <Map topPlacesToVisit={topPlacesToVisit} selectedPlace={selectedPlace ?? undefined} />
          </MapProvider>
        </div>
      </div>
    </SectionWrapper>
  );
};

export const SkeletonForTopPlacesToVisit = ({isMaps = false}: {isMaps?: boolean}) => {
  return (
    <div className="flex flex-col gap-1 justify-center items-center h-full">
      {isMaps ? (
        <div className="flex gap-2 justify-center items-center">
          <Loading />
          <p className="font-bold text-blue-500">Loading Maps</p>
        </div>
      ) : (
        <>
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
          <Skeleton className="h-full" />
        </>
      )}
    </div>
  );
};

export default TopPlacesToVisit;
