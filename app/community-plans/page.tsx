import CommunityPlans from "@/components/community-plans/community-plans";
import { api } from "@/convex/_generated/api";
import { AggregatedPlansReturnType } from "@/lib/types";
import { fetchQuery } from "convex/nextjs";

export default async function CommunityPlansPage({
  searchParams,
}: {
  searchParams?: Promise<{
    pageNumber: number | undefined;
    companionId: string | undefined;
  }>;
}) {
  const params = await searchParams;
  const pageNumber = params?.pageNumber ?? 1;
  const companionId = params?.companionId ?? undefined;

  let plans: AggregatedPlansReturnType;
  let count: number = 0;

  if (companionId) {
    plans = await fetchQuery(api.plansAggregate.pageOfPlansWithCompanion, {
      numItems: 8,
      offset: (pageNumber - 1) * 8,
      companionId,
    });
    count = await fetchQuery(api.plansAggregate.plansWithCompanionCount, {
      companionId,
    });
  } else {
    plans = await fetchQuery(api.plansAggregate.pageOfAllPlans, {
      numItems: 8,
      offset: (pageNumber - 1) * 8,
    });
    count = await fetchQuery(api.plansAggregate.allPublishedPlansCount, {});
  }
  return (
    <CommunityPlans
      pageNumber={Number(pageNumber)}
      initialPlans={plans}
      totalPlans={count}
    />
  );
}
