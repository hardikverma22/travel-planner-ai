import Timeline from "@/components/Timeline";
import SectionWrapper from "@/components/sections/SectionWrapper";
import {AddIternaryDay} from "@/components/addNewItineraryDay/AddIternaryDay";
import {Button} from "@/components/ui/button";
import {Skeleton} from "@/components/ui/skeleton";
import {Doc} from "@/convex/_generated/dataModel";
import {Navigation, PlusCircle, PlusCircleIcon, PlusIcon} from "lucide-react";

type ItineraryProps = {
  itinerary: Doc<"plan">["itinerary"] | undefined;
  planId: string;
};

const Itinerary = ({itinerary, planId}: ItineraryProps) => {
  return (
    <SectionWrapper id="itinerary">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center"></h2>
      <div className="mb-2 flex justify-between items-center">
        <h2
          className="text-lg font-semibold underline underline-offset-2
                tracking-wide flex items-center"
        >
          <Navigation className="mr-2" /> Itinerary
        </h2>
        {itinerary && <AddIternaryDay planId={planId} />}
      </div>
      {itinerary && itinerary.length > 0 ? (
        <Timeline itinerary={itinerary} planId={planId} />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </SectionWrapper>
  );
};

export default Itinerary;
