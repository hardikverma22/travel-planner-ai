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

import {fetchQuery} from "convex/nextjs";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";

type PlanProps = {
  planId: string;
};

export default async function CommunityPlan({planId}: PlanProps) {
  try {
    const plan = await fetchQuery(api.plan.getSinglePlan, {
      id: planId as Id<"plan">,
      isPublic: true,
    });
    if (!plan) {
      return <p>Plan Not Found</p>;
    } else
      return (
        <section className="h-full flex flex-col gap-10">
          <ImageSection
            userPrompt={plan?.userPrompt}
            companion={undefined}
            activityPreferences={[]}
            fromDate={undefined}
            toDate={undefined}
            placeName={plan?.nameoftheplace}
            imageUrl={plan?.url}
            isLoading={false}
            allowEdit={false}
            planId={planId}
          />
          <AboutThePlace
            isLoading={false}
            planId={planId}
            content={plan.abouttheplace}
            allowEdit={false}
          />
          <TopActivities
            activities={plan.adventuresactivitiestodo}
            planId={planId}
            isLoading={false}
            allowEdit={false}
          />
          <TopPlacesToVisit
            topPlacesToVisit={plan.topplacestovisit}
            planId={planId}
            isLoading={false}
            allowEdit={false}
          />
          <Itinerary
            itinerary={plan.itinerary}
            planId={planId}
            isLoading={false}
            allowEdit={false}
          />
          <LocalCuisineRecommendations
            recommendations={plan.localcuisinerecommendations}
            isLoading={false}
            planId={planId}
            allowEdit={false}
          />
          <PackingChecklist
            checklist={plan.packingchecklist}
            isLoading={false}
            planId={planId}
            allowEdit={false}
          />
          <BestTimeToVisit
            content={plan.besttimetovisit}
            planId={planId}
            isLoading={false}
            allowEdit={false}
          />
        </section>
      );
  } catch (error) {
    return <p>Error Loading Plan</p>;
  }
}
