"use server";
import { formSchemaType } from "@/components/NewPlanForm";
import { fetchAction, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/app/auth";
import { redirect } from "next/navigation";

export async function generatePlanAction(formData: formSchemaType) {
  const token = await getAuthToken();
  const planId = await fetchMutation(api.plan.createEmptyPlan,
    { userPrompt: formData.promptText },
    { token });

  if (planId === null)
    return null;

  fetchAction(api.plan.prepareBatch1, { planId: planId }, { token });
  fetchAction(api.plan.prepareBatch2, { planId: planId }, { token });
  fetchAction(api.plan.prepareBatch3, { planId: planId }, { token });

  redirect(`/plans/${planId}?isNewPlan=true`);
  return planId;
}