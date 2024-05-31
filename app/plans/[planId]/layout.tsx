import {getAuthToken} from "@/app/auth";
import PlanLayoutContent from "@/components/plan/PlanLayoutContent";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {fetchQuery} from "convex/nextjs";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
  {
    params,
    searchParams,
  }: {
    params: {planId: string};
    searchParams?: {isNewPlan: string};
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.planId;
  const token = await getAuthToken();

  const plan = await fetchQuery(api.plan.getSinglePlan, {id: id as Id<"plan">}, {token});
  console.log(plan?.nameoftheplace);
  return {
    title: plan ? plan.nameoftheplace : "Your Plan",
  };
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {planId: string};
}) {
  return <PlanLayoutContent planId={params.planId}>{children}</PlanLayoutContent>;
}
