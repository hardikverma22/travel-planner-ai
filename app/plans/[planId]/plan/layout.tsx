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
        <Sidebar planId={params.planId} />
        {children}
      </div>
    </PlanContextProvider>
  );
}
