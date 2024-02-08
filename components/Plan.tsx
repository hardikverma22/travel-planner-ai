"use client";

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
import usePlan from "@/hooks/usePlan";

type PlanProps = {
  planId: string;
  isNewPlan: boolean;
};

const Plan = ({planId, isNewPlan}: PlanProps) => {
  const {shouldShowAlert, planState, plan} = usePlan(planId, isNewPlan);

  return (
    <div className="bg-background">
      <div className="grid lg:grid-cols-5 min-h-screen lg:px-10 px-5">
        <Sidebar planState={planState} />
        <div className="lg:col-span-4 lg:border-l">
          <div className="h-full px-4 py-6 lg:px-8 flex flex-col gap-10">
            <AlertForAI show={shouldShowAlert} />
            <Prompt
              content={plan?.userPrompt}
              placeName={plan?.nameoftheplace}
              imageUrl={plan?.url}
            />
            <AboutThePlace content={plan?.abouttheplace} />
            <TopActivities activities={plan?.adventuresactivitiestodo} />
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
