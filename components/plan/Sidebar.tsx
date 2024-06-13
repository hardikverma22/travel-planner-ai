"use client";

import Link from "next/link";

import Pulse from "@/components/shared/Pulse";
import {Button} from "@/components/ui/button";
import {usePlanContext} from "@/contexts/PlanContextProvider";

import {controlCenterSections, planSections} from "@/lib/constants";

const Sidebar = ({planId, isMobile = false}: {planId: string; isMobile?: boolean}) => {
  const {planState} = usePlanContext();

  return (
    <aside className="space-y-6 sticky top-[5.6rem] h-fit">
      <div className="space-y-2">
        <h2 className="mb-2 md:text-lg text-base font-semibold tracking-tight">Your Plan</h2>
        <div className="space-y-1">
          {planSections.map((section) => (
            <Link href={`/plans/${planId}/plan#${section.id}`} key={section.id}>
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
                {!isMobile && planState && !planState[section.id] && <Pulse />}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="mb-2 text-lg font-semibold tracking-tight">Control Center</h2>
        <div className="space-y-1">
          {controlCenterSections.map((link) => (
            <Link href={`/plans/${planId}/${link.id}`} key={link.id}>
              <Button
                aria-label={link.id}
                variant="ghost"
                className="w-full justify-start items-center gap-2 whitespace-break-spaces px-2
                        text-foreground dark:text-muted-foreground hover:dark:text-foreground"
              >
                {link.icon}
                <span className="md:text-left">{link.title}</span>
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
