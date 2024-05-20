import {cn} from "@/lib/utils";
import {GiJourney} from "react-icons/gi";

export function NoPlans({isLoading}: {isLoading: boolean}) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <div
        className={cn("flex flex-col justify-center items-center w-fit bg-background", {
          "animate-pulse": isLoading,
        })}
      >
        <GiJourney className="text-9xl text-blue-500 dark:text-foreground" />
        <p className="font-bold text-lg capitalize leading-10">
          {isLoading ? "Loading Travel Plans..." : "No plans created yet!"}
        </p>
      </div>
    </div>
  );
}
