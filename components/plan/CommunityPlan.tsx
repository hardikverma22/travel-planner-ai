"use client";
import {
  AboutThePlace,
  BestTimeToVisit,
  Itinerary,
  ImageSection,
  TopActivities,
  TopPlacesToVisit,
  LocalCuisineRecommendations,
  PackingChecklist,
} from "@/components/sections";
import PlanMetaData from "@/components/sections/PlanMetaData";

import { usePlanContext } from "@/contexts/PlanContextProvider";

type PlanProps = {
  planId: string;
};

export default async function CommunityPlan({ planId }: PlanProps) {
  const { isLoading, plan } = usePlanContext();

  return (
    <section className="h-full flex flex-col gap-5">
      <PlanMetaData
        allowEdit={false}
        companionId={plan?.companion}
        activityPreferencesIds={plan?.activityPreferences ?? []}
        fromDate={plan?.fromDate ?? undefined}
        toDate={plan?.toDate ?? undefined}
        planId={planId}
        isPublished={plan?.isPublished ?? false}
        isLoading={isLoading}
      />
      <ImageSection
        userPrompt={plan?.userPrompt}
        placeName={plan?.nameoftheplace}
        imageUrl={plan?.imageUrl}
        isLoading={isLoading}
      />
      <AboutThePlace
        isLoading={isLoading}
        planId={planId}
        content={plan?.abouttheplace}
        allowEdit={false}
      />
      <TopActivities
        activities={plan?.adventuresactivitiestodo}
        planId={planId}
        isLoading={isLoading}
        allowEdit={false}
      />
      <TopPlacesToVisit
        topPlacesToVisit={plan?.topplacestovisit}
        planId={planId}
        isLoading={isLoading}
        allowEdit={false}
      />
      <Itinerary
        itinerary={plan?.itinerary}
        planId={planId}
        isLoading={isLoading}
        allowEdit={false}
      />
      <LocalCuisineRecommendations
        recommendations={plan?.localcuisinerecommendations}
        isLoading={isLoading}
        planId={planId}
        allowEdit={false}
      />
      <PackingChecklist
        checklist={plan?.packingchecklist}
        isLoading={isLoading}
        planId={planId}
        allowEdit={false}
      />
      <BestTimeToVisit
        content={plan?.besttimetovisit}
        planId={planId}
        isLoading={isLoading}
        allowEdit={false}
      />
    </section>
  );
}
