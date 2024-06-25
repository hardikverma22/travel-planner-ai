import { Doc } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ConvexError } from "convex/values";

const usePlan = (planId: string, isNewPlan: boolean, isPublic: boolean) => {
    try {
        const plan = useQuery(api.plan.getSinglePlan, {
            id: planId as Doc<"plan">["_id"],
            isPublic
        });

        const shouldShowAlert =
            plan?.isGeneratedUsingAI && isNewPlan && plan && Object.values(plan.contentGenerationState).some(value => value === false) ? true : false;

        return {
            shouldShowAlert,
            plan,
            isLoading: !plan
        }

    } catch (error) {
        let errorMessage: string = "Something went wrong!";
        if (error instanceof ConvexError) {
            errorMessage = error.data as string;
        }
        return {
            shouldShowAlert: false,
            plan: null,
            isLoading: false,
            error: errorMessage
        }
    }

}

export default usePlan