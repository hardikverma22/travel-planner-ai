import CommunityPlans from "@/components/community-plans/community-plans";

export default async function CommunityPlansPage({
  searchParams,
}: {
  searchParams?: Promise<{
    companionId: string | undefined;
  }>;
}) {
  const params = await searchParams;
  const companionId = params?.companionId ?? undefined;
  return <CommunityPlans companionId={companionId} />;
}
