"use client";
import AboutThePlace from "@/components/sections/AboutThePlace";
import Sidebar from "@/components/Sidebar";
import TopActivities from "@/components/sections/TopActivities";
import {Doc, Id} from "@/convex/_generated/dataModel";
import BestTimeToVisit from "@/components/sections/BestTimeToVisit";
import TopPlacesToVisit from "@/components/sections/TopPlacesToVisit";
import Itinerary from "@/components/sections/Itinerary";
import Prompt from "@/components/sections/Prompt";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";

type PlanProps = {
  planId: string;
};

const Plan = ({planId}: PlanProps) => {
  const plan = useQuery(api.plan.getSinglePlan, {
    id: planId as Doc<"plan">["_id"],
  });
  return (
    <div className="bg-background">
      <div className="grid lg:grid-cols-5 min-h-screen">
        <Sidebar />
        <div className="lg:col-span-4 lg:border-l">
          <div className="h-full px-4 py-6 lg:px-8 flex flex-col gap-10">
            <Prompt content={plan?.userPrompt} />
            <AboutThePlace content={plan?.abouttheplace} />
            <TopActivities activities={plan?.thingstodo} />
            <TopPlacesToVisit topPlacesToVisit={plan?.topplacestovisit} />
            <Itinerary itinerary={plan?.itinerary} />
            <BestTimeToVisit content={plan?.besttimetovisit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
