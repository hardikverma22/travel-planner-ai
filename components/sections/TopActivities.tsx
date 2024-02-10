import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Sailboat} from "lucide-react";

type TopActivitiesProps = {
  activities: string[] | undefined;
};

export default function TopActivities({activities}: TopActivitiesProps) {
  return (
    <SectionWrapper id="topactivities">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <Sailboat className="mr-2" /> Top activities to look for
      </h2>
      {activities && activities?.length > 0 ? (
        <div className="ml-8">
          <ol className="max-w-xl space-y-1 text-gray-500 list-decimal list-inside dark:text-gray-400">
            {activities.map((activity) => (
              <li key={activity}>
                <span className="font-normal text-gray-900 dark:text-white">
                  {activity}
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
