import DangerZone from "@/components/settings/DangerZone";

export default function PlanSettings({params: {planId}}: {params: {planId: string}}) {
  return <DangerZone planId={planId} />;
}
