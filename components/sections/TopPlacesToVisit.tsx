"use client";
import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Doc} from "@/convex/_generated/dataModel";
import {MapPin} from "lucide-react";

const TopPlacesToVisit = ({
  topPlacesToVisit,
}: {
  topPlacesToVisit: Doc<"plan">["topplacestovisit"] | undefined;
}) => {
  return (
    <SectionWrapper id="topplacestovisit">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <MapPin className="mr-2" /> Top places to visit
      </h2>
      {topPlacesToVisit && topPlacesToVisit.length > 0 ? (
        <div className="ml-8">
          <ol className="max-w-xl space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400">
            {topPlacesToVisit.map((place) => (
              <li key={place.name}>
                <span className="font-normal text-gray-900 dark:text-white">
                  {place.name}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </SectionWrapper>
  );
};

export default TopPlacesToVisit;
