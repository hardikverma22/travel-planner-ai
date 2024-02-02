"use client";
import {Doc} from "@/convex/_generated/dataModel";
import {useQuery} from "convex/react";
import {api} from "@/convex/_generated/api";

import AlertForAI from "@/components/AlertForAI";
import Sidebar from "@/components/Sidebar";

import {
  AboutThePlace,
  BestTimeToVisit,
  Itinerary,
  Prompt,
  TopActivities,
  TopPlacesToVisit,
  LocalCuisineRecommendations,
} from "@/components/sections";
import PackingChecklist from "@/components/sections/PackingChecklist";

type PlanProps = {
  planId: string;
  isNewPlan: boolean;
};

const Plan = ({planId, isNewPlan}: PlanProps) => {
  const plan = useQuery(api.plan.getSinglePlan, {
    id: planId as Doc<"plan">["_id"],
  });

  const shouldShowAlert =
    isNewPlan && plan != null && plan.besttimetovisit?.length == 0;

  return (
    <div className="bg-background">
      <div className="grid lg:grid-cols-5 min-h-screen lg:px-10 px-5">
        <Sidebar />
        <div className="lg:col-span-4 lg:border-l">
          <div className="h-full px-4 py-6 lg:px-8 flex flex-col gap-10">
            <AlertForAI show={shouldShowAlert} />
            <Prompt
              content={plan?.userPrompt}
              placeName={plan?.nameoftheplace}
              imageUrl={plan?.url}
            />
            <AboutThePlace content={plan?.abouttheplace} />
            <TopActivities activities={plan?.thingstodo} />
            <TopPlacesToVisit topPlacesToVisit={plan?.topplacestovisit} />
            <Itinerary itinerary={plan?.itinerary} />
            <LocalCuisineRecommendations
              places={plan?.localcuisinerecommendations}
            />
            <PackingChecklist checklist={plan?.packingchecklist} />
            <BestTimeToVisit content={plan?.besttimetovisit} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Plan;
