"use client";

import Sidebar from "@/components/Plan/Sidebar";
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
      <div className="bg-background">
        <div className="grid lg:grid-cols-5 min-h-[calc(100svh-4rem)] lg:px-10 px-5">
          <Sidebar planId={params.planId} />
          {children}
        </div>
      </div>
    </PlanContextProvider>
  );
}
