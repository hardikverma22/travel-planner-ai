"use client";

import Sidebar from "@/components/Sidebar";

import {
  AlertForAI,
  AboutThePlace,
  BestTimeToVisit,
  Itinerary,
  Prompt,
  TopActivities,
  TopPlacesToVisit,
  LocalCuisineRecommendations,
  PackingChecklist,
} from "@/components/sections";

import usePlan from "@/hooks/usePlan";

type PlanProps = {
  planId: string;
  isNewPlan: boolean;
};

const Plan = ({planId, isNewPlan}: PlanProps) => {
  const {shouldShowAlert, planState, plan, isLoading} = usePlan(planId, isNewPlan);

  return (
    <div className="bg-background">
      <div className="grid lg:grid-cols-5 min-h-screen lg:px-10 px-5">
        <Sidebar planState={planState} />
        <section className="lg:col-span-4 lg:border-l">
          <div className="h-full px-4 py-6 lg:px-8 flex flex-col gap-10">
            <AlertForAI show={shouldShowAlert} />
            <Prompt
              content={plan?.userPrompt}
              placeName={plan?.nameoftheplace}
              imageUrl={plan?.url}
            />
            <AboutThePlace content={plan?.abouttheplace} />
            <TopActivities
              activities={plan?.adventuresactivitiestodo}
              planId={planId}
              isLoading={isLoading}
            />
            <TopPlacesToVisit topPlacesToVisit={plan?.topplacestovisit} />
            <Itinerary itinerary={plan?.itinerary} />
            <LocalCuisineRecommendations
              recommendations={plan?.localcuisinerecommendations}
              isLoading={isLoading}
              planId={planId}
            />
            <PackingChecklist
              checklist={plan?.packingchecklist}
              isLoading={isLoading}
              planId={planId}
            />
            <BestTimeToVisit content={plan?.besttimetovisit} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Plan;
