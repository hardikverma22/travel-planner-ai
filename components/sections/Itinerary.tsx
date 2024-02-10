import Timeline from "@/components/Timeline";
import SectionWrapper from "@/components/sections/SectionWrapper";
import {Skeleton} from "@/components/ui/skeleton";
import {Doc} from "@/convex/_generated/dataModel";
import {Navigation} from "lucide-react";

type ItineraryProps = {
  itinerary: Doc<"plan">["itinerary"] | undefined;
};

const Itinerary = ({itinerary}: ItineraryProps) => {
  return (
    <SectionWrapper id="itinerary">
      <h2 className="mb-2 text-lg font-semibold underline underline-offset-2 tracking-wide flex items-center">
        <Navigation className="mr-2" /> Itinerary
      </h2>
      {itinerary && itinerary.length > 0 ? (
        <Timeline itinerary={itinerary} />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </SectionWrapper>
  );
};

export default Itinerary;
