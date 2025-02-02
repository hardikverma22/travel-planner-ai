"use client";
import { AppSidebar } from "@/components/app-sidebar";
import PlanCard from "@/components/dashboard/PlanCard";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LoadingPlans } from "@/components/LoadingPlans";

export default function CommunityPlans({
  companionId,
}: {
  companionId?: string;
}) {
  const { results, status, loadMore } = usePaginatedQuery(
    api.communityPlans.paginatedPublishedPlans,
    { companion: companionId },
    { initialNumItems: 8 }
  );
  console.log({ results, status });

  const noPlansToShow =
    results && results.length === 0 && status === "Exhausted";

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col">
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
        <div className="flex flex-col gap-2 pt-0">
          {results && results.length ? (
            <div
              className="grid grid-cols-1 
                      md:grid-cols-2 lg:grid-cols-3
                      2xl:grid-cols-4 4xl:grid-cols-6
                      gap-5 px-10 py-2 justify-center"
            >
              {results?.map((plan) => (
                <PlanCard key={plan._id} plan={plan} isPublic />
              ))}
            </div>
          ) : null}
          {noPlansToShow && <NoPlansFound />}
          {status === "LoadingFirstPage" && <LoadingPlans />}
          {status === "CanLoadMore" && (
            <Button
              className="w-fit rounded-full mx-auto bg-blue-500 text-white 
              hover:bg-blue-800 dark:bg-background dark:text-foreground dark:border-2 dark:border-border hover:scale-105 transition-all duration-100"
              onClick={() => loadMore(8)}
            >
              Load More
            </Button>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function EmptyPlansIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 839 559"
      className={cn("h-48 w-48 text-primary/20", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* SVG from undraw.co (simplified version of https://undraw.co/illustrations -> search "no data") */}
      <path
        d="M634.5 206H563V274.5H634.5V206Z"
        fill="currentColor"
        className="opacity-50"
      />
      <path
        d="M653.5 343H582V411.5H653.5V343Z"
        fill="currentColor"
        className="opacity-30"
      />
      <path
        d="M388.5 133H317V201.5H388.5V133Z"
        fill="currentColor"
        className="opacity-30"
      />
      <path
        d="M275.5 343H204V411.5H275.5V343Z"
        fill="currentColor"
        className="opacity-50"
      />
      <path
        d="M475.096 282.603C433.404 282.603 399.5 316.507 399.5 358.199C399.5 399.891 433.404 433.795 475.096 433.795C516.788 433.795 550.692 399.891 550.692 358.199C550.692 316.507 516.788 282.603 475.096 282.603Z"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-50"
      />
      <path
        d="M522.5 358.199L496 344.199V372.199L522.5 358.199Z"
        fill="currentColor"
        className="opacity-50"
      />
      <path
        d="M209.5 230.5V297C209.5 314.5 223.5 328.5 241 328.5H307"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-50"
      />
      <path
        d="M633 297V230.5C633 213 619 199 601.5 199H535.5"
        stroke="currentColor"
        strokeWidth="2"
        className="opacity-50"
      />
    </svg>
  );
}

export function NoPlansFound() {
  return (
    <Card className="mx-auto w-full h-[600px] flex-grow p-8 text-center animate-fade-in">
      <div className="mb-6 flex justify-center">
        <EmptyPlansIllustration className="animate-pulse" />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          🔍 Let's Try Again Together!
        </h2>

        <p className="text-muted-foreground">
          Explore new public plans by updating your filters.
        </p>
      </div>

      <div className="mt-6 text-sm text-muted-foreground/60">
        <p>
          Psst... even astronauts need to adjust their trajectory sometimes 🚀
        </p>
      </div>
    </Card>
  );
}
