"use client";

import Sidebar from "@/components/plan/Sidebar";
import PlanContextProvider from "@/contexts/PlanContextProvider";

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: {planId: string};
}) {
  return (
    <PlanContextProvider>
      <div className="grid lg:grid-cols-5">
        <div className="lg:col-span-1 col-span-full">
          <Sidebar planId={params.planId} />
        </div>
        <div className="lg:col-span-4 lg:border-l">{children}</div>
      </div>
    </PlanContextProvider>
  );
}
