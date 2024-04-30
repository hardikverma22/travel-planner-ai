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

  const promise1 = fetchMutation(api.retrier.runAction, {
    action: "images:generateAndStore",
    actionArgs: {
      prompt: placeName,
      planId: planId
    }
  }, { token: token });

  const promise2 = fetchMutation(api.retrier.runAction, {
    action: "plan:prepareBatch1",
    actionArgs: {
      planId: planId
    }
  }, { token: token })

  const promise3 = fetchMutation(api.retrier.runAction, {
    action: "plan:prepareBatch2",
    actionArgs: {
      planId: planId
    }
  }, { token: token });

  const promise4 = fetchMutation(api.retrier.runAction, {
    action: "plan:prepareBatch3",
    actionArgs: {
      planId: planId
    }
  }, { token: token });

  Promise.all([promise1, promise2, promise3, promise4]).then(_ => {
    fetchMutation(api.users.reduceUserCreditsByOne, {}, { token: token });
  }).catch(e => console.log(e));

  redirect(`/plans/${planId}?isNewPlan=true`);
}