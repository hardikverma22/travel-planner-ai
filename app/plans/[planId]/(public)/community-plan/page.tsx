import CommunityPlan from "@/components/plan/CommunityPlan";

export default async function PlanPage({params}: {params: {planId: string}}) {
  return <CommunityPlan planId={params.planId} />;
}
