"use client";

import {
  AlertForAI,
  AboutThePlace,
  BestTimeToVisit,
  Itinerary,
  ImageSection,
  TopActivities,
  TopPlacesToVisit,
  LocalCuisineRecommendations,
  PackingChecklist,
} from "@/components/sections";

import usePlan from "@/hooks/usePlan";
import {usePlanContext} from "../../contexts/PlanContextProvider";
import {useEffect} from "react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Users} from "lucide-react";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";
import {useRouter} from "next/navigation";
import {Loading} from "@/components/shared/Loading";
import Weather from "@/components/sections/Weather";

type PlanProps = {
  planId: string;
  isNewPlan: boolean;
  isPublic: boolean;
};

const Plan = ({planId, isNewPlan, isPublic}: PlanProps) => {
  const {isLoading, plan, shouldShowAlert} = usePlanContext();

  return (
    <section className="h-full flex flex-col gap-10">
      {plan?.isSharedPlan && (
        <Alert>
          <Users className="h-4 w-4" />
          <AlertTitle className="font-semibold">Shared Access!</AlertTitle>
          <AlertDescription>You are currently viewing a shared Travel Plan.</AlertDescription>
        </Alert>
      )}
      <AlertForAI show={shouldShowAlert} />
      <ImageSection
        userPrompt={plan?.userPrompt}
        companion={plan?.companion}
        activityPreferences={plan?.activityPreferences ?? []}
        fromDate={plan?.fromDate ?? undefined}
        toDate={plan?.toDate ?? undefined}
        placeName={plan?.nameoftheplace}
        imageUrl={plan?.url}
        isLoading={isLoading || !plan?.contentGenerationState.imagination}
        allowEdit={true}
        planId={planId}
      />
      <AboutThePlace
        isLoading={isLoading || !plan?.contentGenerationState.abouttheplace}
        planId={planId}
        content={plan?.abouttheplace}
        allowEdit={true}
      />
      <Weather placeName={plan?.nameoftheplace} />
      <TopActivities
        activities={plan?.adventuresactivitiestodo}
        planId={planId}
        isLoading={isLoading || !plan?.contentGenerationState.adventuresactivitiestodo}
        allowEdit={true}
      />
      <TopPlacesToVisit
        topPlacesToVisit={plan?.topplacestovisit}
        planId={planId}
        isLoading={isLoading || !plan?.contentGenerationState.topplacestovisit}
        allowEdit={true}
      />
      <Itinerary
        itinerary={plan?.itinerary}
        planId={planId}
        isLoading={isLoading || !plan?.contentGenerationState.itinerary}
        allowEdit={true}
      />
      <LocalCuisineRecommendations
        recommendations={plan?.localcuisinerecommendations}
        isLoading={isLoading || !plan?.contentGenerationState.localcuisinerecommendations}
        planId={planId}
        allowEdit={true}
      />
      <PackingChecklist
        checklist={plan?.packingchecklist}
        isLoading={isLoading || !plan?.contentGenerationState.packingchecklist}
        planId={planId}
        allowEdit={true}
      />
      <BestTimeToVisit
        content={plan?.besttimetovisit}
        planId={planId}
        isLoading={isLoading || !plan?.contentGenerationState.besttimetovisit}
        allowEdit={true}
      />
    </section>
  );
};

export default Plan;
