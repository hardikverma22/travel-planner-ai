import {Doc} from "@/convex/_generated/dataModel";
import usePlan from "@/hooks/usePlan";
import {useSearchParams} from "next/navigation";
import React, {
  createContext,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

import AccessDenied from "@/components/plan/AccessDenied";

type planStateType = Doc<"plan">["contentGenerationState"] & {weather: boolean};

type PlanContextType = {
  planState: planStateType;
  setPlanState: Dispatch<SetStateAction<planStateType>>;
  shouldShowAlert: boolean;
  plan: (Doc<"plan"> & {url: string | null; isSharedPlan: boolean}) | null | undefined;
  isLoading: boolean;
  error: string | undefined;
};

const defaultPlanState: planStateType = {
  imagination: false,
  abouttheplace: false,
  adventuresactivitiestodo: false,
  topplacestovisit: false,
  itinerary: false,
  localcuisinerecommendations: false,
  packingchecklist: false,
  besttimetovisit: false,
  weather: false,
};

const PlanContext = createContext<PlanContextType | undefined>({
  planState: defaultPlanState,
  setPlanState: () => {},
  shouldShowAlert: false,
  plan: undefined,
  isLoading: false,
  error: undefined,
});

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlanContext must be used within a PlanContextProvider");
  }
  return context;
};

const PlanContextProvider = ({
  children,
  planId,
  isPublic,
}: {
  children: React.ReactNode;
  planId: string;
  isPublic: boolean;
}) => {
  const [planState, setPlanState] = useState<planStateType>(defaultPlanState);

  const searchParams = useSearchParams();

  const isNewPlan = Boolean(searchParams.get("isNewPlan"));

  const {shouldShowAlert, plan, isLoading, error} = usePlan(planId, isNewPlan, isPublic);

  useEffect(() => {
    if (isLoading || !plan) return;

    setPlanState((state) => ({...plan.contentGenerationState, weather: state.weather}));
  }, [plan]);

  return (
    <PlanContext.Provider
      value={{planState, shouldShowAlert, plan, isLoading, error, setPlanState}}
    >
      {error ? <AccessDenied /> : children}
    </PlanContext.Provider>
  );
};

export default PlanContextProvider;
