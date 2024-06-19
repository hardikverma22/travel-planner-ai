import {Doc} from "@/convex/_generated/dataModel";
import React, {createContext, useContext, useState, Dispatch, SetStateAction} from "react";

type planStateType = Doc<"plan">["contentGenerationState"] & {weather: boolean};

type PlanContextType = {
  planState: planStateType;
  setPlanState: Dispatch<SetStateAction<planStateType>>;
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
  weather: false
};

const PlanContext = createContext<PlanContextType | undefined>({
  planState: defaultPlanState,
  setPlanState: () => {},
});

export const usePlanContext = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlanContext must be used within a PlanContextProvider");
  }
  return context;
};

const PlanContextProvider = ({children}: {children: React.ReactNode}) => {
  const [planState, setPlanState] = useState<planStateType>(defaultPlanState);

  return <PlanContext.Provider value={{planState, setPlanState}}>{children}</PlanContext.Provider>;
};

export default PlanContextProvider;
