"use server";
import { formSchemaType } from "@/components/NewPlanForm";
import { fetchMutation, fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/app/auth";
import { redirect } from "next/navigation";
import { differenceInDays } from "date-fns";

export async function generatePlanAction(formData: formSchemaType) {
  const token = await getAuthToken();
  const { placeName, activityPreferences, datesOfTravel, companion } = formData;

  const userData = await fetchQuery(api.users.currentUser, {}, { token });
  const totalCredits = (userData?.credits ?? 0) + (userData?.freeCredits ?? 0);
  if (totalCredits <= 0) {
    console.log(
      `unable to create ai travel plan due to low credits user:${userData?.userId}`
    );
    return null;
  }
  const planId = await fetchMutation(
    api.plan.createEmptyPlan,
    {
      placeName,
      noOfDays: (
        differenceInDays(datesOfTravel.to, datesOfTravel.from) + 1
      ).toString(),
      activityPreferences,
      fromDate: datesOfTravel.from.getTime(),
      toDate: datesOfTravel.to.getTime(),
      companion,
      isGeneratedUsingAI: true,
    },
    { token }
  );

  if (planId === null) return null;

  fetchMutation(
    api.retrier.runAction,
    {
      action: "images:generateAndStore",
      actionArgs: {
        prompt: placeName,
        planId: planId,
      },
    },
    { token: token }
  );

  fetchMutation(
    api.retrier.runAction,
    {
      action: "plan:prepareBatch1",
      actionArgs: {
        planId: planId,
      },
    },
    { token: token }
  );

  fetchMutation(
    api.retrier.runAction,
    {
      action: "plan:prepareBatch2",
      actionArgs: {
        planId: planId,
      },
    },
    { token: token }
  );

  fetchMutation(
    api.retrier.runAction,
    {
      action: "plan:prepareBatch3",
      actionArgs: {
        planId: planId,
      },
    },
    { token: token }
  );

  fetchMutation(api.users.reduceUserCreditsByOne, {}, { token: token });
  redirect(`/plans/${planId}/plan?isNewPlan=true`);
}
