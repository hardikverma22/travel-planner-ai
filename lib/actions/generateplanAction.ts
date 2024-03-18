"use server";
import { formSchemaType } from "@/components/NewPlanForm";
import { fetchAction, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/app/auth";
import { redirect } from "next/navigation";
import { useAction } from "convex/react";

export async function generatePlanAction(formData: formSchemaType) {
  const token = await getAuthToken();
  const { placeName, noOfDays } = formData;

  const planId = await fetchMutation(api.plan.createEmptyPlan,
    { userPrompt: `${noOfDays} days trip to ${placeName}` },
    { token });

  if (planId === null)
    return null;

  fetchMutation(api.retrier.runAction, {
    action: "plan:prepareBatch1",
    actionArgs: {
      planId: planId
    }
  }, { token: token })

  fetchMutation(api.retrier.runAction, {
    action: "plan:prepareBatch2",
    actionArgs: {
      planId: planId
    }
  }, { token: token });

  fetchMutation(api.retrier.runAction, {
    action: "plan:prepareBatch3",
    actionArgs: {
      planId: planId
    }
  }, { token: token });

  fetchMutation(api.users.reduceUserCreditsByOne, {}, { token: token });
  redirect(`/plans/${planId}?isNewPlan=true`);
}