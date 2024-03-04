import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const usePlan = (planId: string, isNewPlan: boolean) => {
    const plan = useQuery(api.plan.getSinglePlan, {
        id: planId as Doc<"plan">["_id"],
    });

    const shouldShowAlert =
        isNewPlan && plan && plan.itinerary && plan.itinerary?.length == 0 ? true : false;

    const planState = plan ? {
        imagination: plan.nameoftheplace ? true : false,
        abouttheplace: plan.abouttheplace ? true : false,
        topactivities: plan.adventuresactivitiestodo && plan?.adventuresactivitiestodo.length > 0,
        topplacestovisit: plan.topplacestovisit && plan && plan?.topplacestovisit.length > 0,
        itinerary: plan?.itinerary && plan.itinerary.length > 0,
        localcuisines: plan?.localcuisinerecommendations &&
            plan?.localcuisinerecommendations.length > 0,
        packingchecklist: plan?.packingchecklist && plan?.packingchecklist.length > 0,
        besttimetovisit: plan?.besttimetovisit ? true : false,
    } : {
        imagination: false,
        abouttheplace: false,
        topactivities: false,
        topplacestovisit: false,
        itinerary: false,
        localcuisines: false,
        packingchecklist: false,
        besttimetovisit: false,
    };

    return {
        shouldShowAlert,
        planState,
        plan,
        isLoading: !plan
    }
}

export default usePlan