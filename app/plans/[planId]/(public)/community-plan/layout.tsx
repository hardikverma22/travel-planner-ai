import {getAuthToken} from "@/app/auth";
import Header from "@/components/plan/Header";
import PlanLayoutContent from "@/components/plan/PlanLayoutContent";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {fetchQuery} from "convex/nextjs";
import {Metadata, ResolvingMetadata} from "next";

export async function generateMetadata(
  {
    params,
  }: {
    params: {planId: string};
  },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.planId;
  const token = await getAuthToken();

  try {
    const plan = await fetchQuery(
      api.plan.getSinglePlan,
      {id: id as Id<"plan">, isPublic: true},
      {token}
    );
    return {
      title: plan ? plan.nameoftheplace : "Your Plan",
    };
  } catch (error) {
    return {
      title: "Unauthorized Access!",
    };
  }
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {planId: string};
}) {
  return (
    <>
      <Header isPublic={true} />
      <main className="flex min-h-[calc(100svh-4rem)] flex-col items-center bg-blue-50/40 dark:bg-background">
        <PlanLayoutContent planId={params.planId} isPublic={true}>
          {children}
        </PlanLayoutContent>
      </main>
    </>
  );
}
