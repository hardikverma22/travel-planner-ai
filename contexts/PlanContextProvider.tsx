import React, {createContext, useContext, useState} from "react";

const planInitialState = {
  imagination: false,
  abouttheplace: false,
  topactivities: false,
  topplacestovisit: false,
  itinerary: false,
  localcuisines: false,
  packingchecklist: false,
  besttimetovisit: false,
};

const PlanContext = createContext({
  planState: planInitialState,
  setPlanState: (state: any) => {},
});

export const usePlanContext = () => {
  if (PlanContext == null) throw new Error("No Context Found");
  return useContext(PlanContext);
};

const PlanContextProvider = ({children}: {children: React.ReactNode}) => {
  const [planState, setPlanState] = useState(planInitialState);
  return <PlanContext.Provider value={{planState, setPlanState}}>{children}</PlanContext.Provider>;
};

export default PlanContextProvider;
