import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const usePlan = (planId: string, isNewPlan: boolean) => {
    const plan = useQuery(api.plan.getSinglePlan, {
        id: planId as Doc<"plan">["_id"],
    });

    const shouldShowAlert =
        isNewPlan && plan && plan.itinerary && plan.itinerary?.length == 0 ? true : false;

    const nameLoaded = plan && plan?.nameoftheplace ? true : false;
    const aboutThePlaceLoaded = plan && plan?.abouttheplace ? true : false;
    const thingsToDoLoaded =
        plan && plan?.thingstodo && plan?.thingstodo.length > 0 ? true : false;
    const topPlacesToVisitLoaded =
        plan && plan?.topplacestovisit && plan && plan?.topplacestovisit.length > 0
            ? true
            : false;

    const itineraryLoaded =
        plan && plan?.itinerary && plan.itinerary.length > 0 ? true : false;
    const localCuisineRecommendationsLoaded =
        plan &&
            plan?.localcuisinerecommendations &&
            plan?.localcuisinerecommendations.length > 0
            ? true
            : false;
    const packingChecklistLoaded =
        plan && plan?.packingchecklist && plan?.packingchecklist.length > 0
            ? true
            : false;
    const bestTimeToVisitLoaded = plan && plan?.besttimetovisit ? true : false;

    const planState = {
        imagination: nameLoaded,
        abouttheplace: aboutThePlaceLoaded,
        topactivities: thingsToDoLoaded,
        topplacestovisit: topPlacesToVisitLoaded,
        itinerary: itineraryLoaded,
        localcuisines: localCuisineRecommendationsLoaded,
        packingchecklist: packingChecklistLoaded,
        besttimetovisit: bestTimeToVisitLoaded,
    };
    return {
        shouldShowAlert,
        planState,
        plan
    }
}

export default usePlan