import Collaborator from "@/components/settings/Collaborator";
import DangerZone from "@/components/settings/DangerZone";

export default function PlanSettings({params: {planId}}: {params: {planId: string}}) {
  return (
    <div className="flex flex-col gap-5">
      <Collaborator />
      <DangerZone planId={planId} />
    </div>
  );
}
