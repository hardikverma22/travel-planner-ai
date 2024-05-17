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
      <div className="w-full lg:px-20 px-5 py-6 min-h-[calc(100svh-6.5rem)] bg-background">
        <div className="md:grid md:grid-cols-5 lg:gap-2 md:gap-5 gap-3">
          <div className="relative md:col-span-1 col-span-full lg:border-r lg:border-muted-foreground/30 min-h-[calc(100svh-6.5rem)]">
            <Sidebar planId={params.planId} />
          </div>
          <div className="md:col-span-4  px-4 lg:px-8">{children}</div>
        </div>
      </div>
    </PlanContextProvider>
  );
}
