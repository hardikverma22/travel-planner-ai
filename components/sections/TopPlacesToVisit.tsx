"use client";
import Map from "@/components/Plan/Map";
import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Doc} from "@/convex/_generated/dataModel";
import {colors} from "@/lib/constants";
import {ScrollArea} from "@/components/ui/scroll-area";
import {MapPin} from "lucide-react";
import {useEffect, useState} from "react";
import {Loading} from "@/components/shared/Laoding";

type location = {
  lat: number;
  lng: number;
};

type TopPlacesToVisitProps = {
  topPlacesToVisit: Doc<"plan">["topplacestovisit"] | undefined;
};

const TopPlacesToVisit = ({topPlacesToVisit}: TopPlacesToVisitProps) => {
  const doesTopPlacesToVisitExist = topPlacesToVisit != null && topPlacesToVisit.length > 0;

  const [selectedPlace, setSelectedPlace] = useState<location | undefined>();

  useEffect(() => {
    if (!doesTopPlacesToVisitExist) return;
    setSelectedPlace(topPlacesToVisit[0].coordinates);
  }, [doesTopPlacesToVisitExist]);

  const onClickPlace = (e: React.MouseEvent<HTMLLIElement>, coordinates: location) => {
    e.preventDefault();
    setSelectedPlace(coordinates);
  };

  return (
    <SectionWrapper id="topplacestovisit">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <MapPin className="mr-2" /> Top places to visit
      </h2>

      <div className="flex flex-col bg-blue-50 rounded-md lg:flex-row">
        <div className="w-full h-[30rem]">
          {doesTopPlacesToVisitExist ? (
            <div className="p-2 h-full flex justify-center items-start ">
              <ScrollArea className="h-full w-full rounded-md border">
                <ol className="flex-1 text-gray-500 flex flex-col gap-2 py-1">
                  {topPlacesToVisit.map((place, index) => (
                    <li
                      key={place.name}
                      className="p-5 bg-white text-black font-bold cursor-pointer
                              flex-1 shadow-md hover:shadow-lg
                              hover:ring-2 hover:ring-blue-300 duration-500"
                      onClick={(e) => onClickPlace(e, place.coordinates)}
                    >
                      <span className="mr-2" style={{color: `${colors[index % 6]}`}}>
                        {index + 1}.
                      </span>
                      <span className="font-normal">{place.name}</span>
                    </li>
                  ))}
                </ol>
              </ScrollArea>
            </div>
          ) : (
            <SkeletonForTopPlacesToVisit />
          )}
        </div>
        <div className="w-full p-2 h-[30rem]">
          {doesTopPlacesToVisitExist ? (
            <Map topPlacesToVisit={topPlacesToVisit} selectedPlace={selectedPlace ?? undefined} />
          ) : (
            <SkeletonForTopPlacesToVisit isMaps />
          )}
        </div>
      </div>
    </SectionWrapper>
  );
};

const SkeletonForTopPlacesToVisit = ({isMaps = false}: {isMaps?: boolean}) => {
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
