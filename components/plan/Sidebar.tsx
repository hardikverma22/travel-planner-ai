"use client";

import Link from "next/link";

import Pulse from "@/components/shared/Pulse";
import {Button} from "@/components/ui/button";
import {usePlanContext} from "@/contexts/PlanContextProvider";

import {controlCenterSections, planSections} from "@/lib/constants";
import {LockIcon} from "lucide-react";
import {TooltipContainer} from "@/components/shared/Toolip";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {useMemo} from "react";

const Sidebar = ({
  planId,
  isMobile = false,
  isPublic,
}: {
  planId: string;
  isMobile?: boolean;
  isPublic: boolean;
}) => {
  const {planState} = usePlanContext();

  const sections = useMemo(() => {
    if (isPublic) return planSections.filter((section) => section.isPublic === isPublic);
    else return planSections;
  }, [planSections, isPublic]);

  return (
    <aside className="space-y-6 sticky top-[5.6rem] h-fit">
      <div className="space-y-2">
        <h2 className="mb-2 md:text-lg text-base font-semibold tracking-tight">Your Plan</h2>
        <div className="flex flex-col">
          {sections.map((section) => (
            <Link
              href={`/plans/${planId}/${isPublic ? "community-plan" : "plan"}#${section.id}`}
              key={section.id}
            >
              <Button
                aria-label={section.name}
                variant="ghost"
                className="w-full 
                          flex justify-start items-start
                          gap-2 whitespace-break-spaces px-2
                          text-foreground dark:text-muted-foreground hover:dark:text-foreground"
              >
                {section.icon}
                <span className="text-left">{section.name}</span>
                {!isPublic && !isMobile && planState && !planState[section.id] && <Pulse />}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="mb-2 text-lg font-semibold tracking-tight">Control Center</h2>
        <div className="flex flex-col">
          {controlCenterSections.map((link) => {
            if (isPublic)
              return (
                <TooltipContainer
                  key={link.id}
                  text="This section is not available for community shared plans"
                >
                  <div
                    className="flex justify-start items-center gap-2 whitespace-break-spaces p-2
      text-muted-foreground dark:text-muted-foreground/50 text-sm cursor-not-allowed"
                  >
                    {link.icon}
                    <span className="md:text-left">{link.title}</span>
                    <LockIcon className="w-4 h-4" />
                  </div>
                </TooltipContainer>
              );

            return (
              <Link href={isPublic ? `#` : `/plans/${planId}/${link.id}`} key={link.id}>
                <TooltipContainer text={link.tooltipText}>
                  <Button
                    disabled={isPublic}
                    aria-label={link.id}
                    variant="ghost"
                    className="w-full justify-start items-center gap-2 whitespace-break-spaces px-2
                      text-foreground dark:text-muted-foreground hover:dark:text-foreground"
                  >
                    {link.icon}
                    <span className="md:text-left">{link.title}</span>
                  </Button>
                </TooltipContainer>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
