import Plan from "@/components/plan/Plan";

export default async function PlanPage({
  params,
  searchParams,
}: {
  params: {planId: string};
  searchParams?: {isNewPlan: string};
}) {
  const isNewPlan =
    searchParams && searchParams.isNewPlan ? Boolean(searchParams.isNewPlan) : false;
  return <Plan planId={params.planId} isNewPlan={isNewPlan} isPublic={false} />;
}
