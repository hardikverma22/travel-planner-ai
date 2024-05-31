import CurrencySelector from "@/components/settings/CurrencySelector";
import DangerZone from "@/components/settings/DangerZone";

export default function PlanSettings({params: {planId}}: {params: {planId: string}}) {
  return (
    <section className="flex flex-col gap-5">
      <DangerZone planId={planId} />
      <CurrencySelector planId={planId} />
    </section>
  );
}
