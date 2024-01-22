"use server";
import { formSchemaType } from "@/components/NewPlanForm";
import { fetchAction } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { getAuthToken } from "@/app/auth";
import { redirect } from "next/navigation";

export async function generatePlanAction(formData: formSchemaType) {
  const token = await getAuthToken();
  const planId = await fetchAction(
    api.plan.preparePlan,
    {
      promptText: formData.promptText,
      budget: formData.budget || 0,
      season: formData.season || "",
    },
    { token }
  );

  if (planId != null) redirect(`/plans/${planId}`);
  // return planId;
}

/*

const token = await getAuthToken();

  const planId = await fetchMutation(api.plan.createEmptyPlan,
    { userPrompt: formData.promptText }, { token });
  if (planId != null) redirect(`/plans/${planId}`);
  console.log("ran after redict");
*/