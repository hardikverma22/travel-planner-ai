import Plan from "@/components/Plan";
import {SearchSlash} from "lucide-react";

export default async function PlanPage({
  params,
  searchParams,
}: {
  params: {planId: string};
  searchParams?: {isNewPlan: string};
}) {
  const isNewPlan = searchParams && searchParams?.isNewPlan;
  return (
    <Plan planId={params.planId} isNewPlan={Boolean(isNewPlan) ?? false} />
  );
}
