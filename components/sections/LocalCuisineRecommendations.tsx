import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Utensils} from "lucide-react";

export default function LocalCuisineRecommendations({
  places,
}: {
  places: string[] | undefined;
}) {
  return (
    <SectionWrapper id="localcuisines">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <Utensils className="mr-2" /> Local Cuisine Recommendations
      </h2>
      {places && places?.length > 0 ? (
        <div className="ml-8">
          <ol className="max-w-xl space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400">
            {places.map((place) => (
              <li key={place}>
                <span className="font-normal text-gray-900 dark:text-white">
                  {place}
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
}
