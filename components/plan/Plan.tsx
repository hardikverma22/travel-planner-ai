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
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Users} from "lucide-react";
import {ExclamationTriangleIcon} from "@radix-ui/react-icons";
import {useRouter} from "next/navigation";
import {Loading} from "@/components/shared/Loading";

type PlanProps = {
  planId: string;
  isNewPlan: boolean;
};

const Plan = ({planId, isNewPlan}: PlanProps) => {
  const {shouldShowAlert, planState, plan, isLoading, error} = usePlan(planId, isNewPlan);
  const {setPlanState} = usePlanContext();

  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    setPlanState(planState);
  }, [plan]);

  useEffect(() => {
    if (isLoading) return;
    let timer = undefined;
    if (error) {
      timer = setTimeout(() => {
        router.push("/dashboard");
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [error]);

  return (
    <section className="h-full flex flex-col gap-10">
      {error ? (
        <Alert variant="destructive">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error} <br />
            <div className="flex justify-start items-center gap-1 text-md text-gray-600">
              <Loading className="w-4 h-4 mr-1" />
              Rirecting you back to your dashboard...
            </div>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {plan?.isSharedPlan && (
            <Alert>
              <Users className="h-4 w-4" />
              <AlertTitle className="font-semibold">Shared Access!</AlertTitle>
              <AlertDescription>You are currently viewing a shared Travel Plan.</AlertDescription>
            </Alert>
          )}
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
        </>
      )}
    </section>
  );
};

export default Plan;
