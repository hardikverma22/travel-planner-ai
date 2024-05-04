"use client";

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
import {usePlanContext} from "../../contexts/PlanContextProvider";
import {useEffect} from "react";

type PlanProps = {
  planId: string;
  isNewPlan: boolean;
};

const Plan = ({planId, isNewPlan}: PlanProps) => {
  const {shouldShowAlert, planState, plan, isLoading} = usePlan(planId, isNewPlan);
  const {setPlanState} = usePlanContext();

  useEffect(() => {
    if (isLoading) return;
    setPlanState(planState);
  }, [plan]);

  return (
    <section className="lg:col-span-4 lg:border-l">
      <div className="h-full px-4 py-6 lg:px-8 flex flex-col gap-10">
        <AlertForAI show={shouldShowAlert} />
        <Prompt content={plan?.userPrompt} placeName={plan?.nameoftheplace} imageUrl={plan?.url} />
        <AboutThePlace content={plan?.abouttheplace} />
        <TopActivities
          activities={plan?.adventuresactivitiestodo}
          planId={planId}
          isLoading={isLoading}
        />
        <TopPlacesToVisit topPlacesToVisit={plan?.topplacestovisit} />
        <Itinerary itinerary={plan?.itinerary} planId={planId} />
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
  );
};

export default Plan;
