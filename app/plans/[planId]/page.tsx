import {getAuthToken} from "@/app/auth";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {fetchQuery} from "convex/nextjs";
import Plan from "@/components/Plan";

export default async function PlanPage({params}: {params: {planId: string}}) {
  // const token = await getAuthToken();
  // const plan = await fetchQuery(
  //   api.plan.getSinglePlan,
  //   {
  //     id: params.planId as Id<"plan">,
  //   },
  //   {token}
  // );

  return <Plan planId={params.planId} />;
}
