"use client";
import { AppSidebar } from "@/components/app-sidebar";
import DynamicPagination from "@/components/community-plans/DynamicPagination";
import PlanCard from "@/components/dashboard/PlanCard";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AggregatedPlansReturnType } from "@/lib/types";
import { useMemo } from "react";

export default function CommunityPlans({
  pageNumber = 1,
  totalPlans,
  initialPlans,
}: {
  pageNumber: number;
  initialPlans: AggregatedPlansReturnType;
  totalPlans: number;
}) {
  const totalPages = useMemo(() => Math.ceil(totalPlans / 8), [totalPlans]);
  console.log({ pageNumber, totalPlans, initialPlans });
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h2>Community Plans</h2>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <p className="text-sm text-gray-500">
              Plans shared by other fellow travellers
            </p>
          </div>
        </header>
        <div className="flex flex-col gap-4 p-4 pt-0">
          <div
            className="grid grid-cols-1 
                      md:grid-cols-2 lg:grid-cols-3
                      2xl:grid-cols-4 4xl:grid-cols-6
                      gap-5 p-10 justify-center"
          >
            {initialPlans &&
              initialPlans.length &&
              initialPlans?.map((plan) => (
                <PlanCard key={plan._id} plan={plan} isPublic />
              ))}
          </div>
          {/* <div className="flex flex-wrap gap-4">
            {initialPlans &&
              initialPlans.length &&
              initialPlans?.map((plan) => (
                <PlanCard key={plan._id} plan={plan} isPublic />
              ))}
          </div> */}
          {initialPlans && initialPlans.length > 0 && totalPages > 1 && (
            <div className="fixed bottom-10 inset-x-0 mx-auto w-fit bg-foreground rounded-full border-2 border-border backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <DynamicPagination
                currentPage={pageNumber}
                maxDisplayedPages={5}
                totalPages={totalPages}
              />
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
