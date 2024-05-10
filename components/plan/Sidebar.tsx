"use client";

import Link from "next/link";

import Pulse from "@/components/shared/Pulse";
import {Button} from "@/components/ui/button";
import {usePlanContext} from "@/contexts/PlanContextProvider";

import {planSections} from "@/lib/constants";
import {cn} from "@/lib/utils";
import {usePathname} from "next/navigation";
import {DollarSignIcon, SettingsIcon} from "lucide-react";

export type SidebarProps = {
  imagination: boolean;
  abouttheplace: boolean;
  topactivities: boolean;
  topplacestovisit: boolean;
  itinerary: boolean;
  localcuisines: boolean;
  packingchecklist: boolean;
  besttimetovisit: boolean;
};

const Sidebar = ({planId}: {planId: string}) => {
  const {planState} = usePlanContext();

  return (
    <aside className="space-y-8 sticky top-2">
      <div className="space-y-2">
        <h2 className="mb-2 text-lg font-semibold tracking-tight">Your Plan</h2>
        <div className="space-y-1">
          {planSections.map((section) => (
            <Link href={`/plans/${planId}/plan#${section.id}`} key={section.id}>
              <Button
                aria-label={section.name}
                variant="ghost"
                className="w-full justify-start items-center gap-2 whitespace-break-spaces px-0"
              >
                {section.icon}
                <span className="md:text-left">{section.name}</span>
                {planState && !planState[section.id] && <Pulse />}
              </Button>
            </Link>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="mb-2 text-lg font-semibold tracking-tight">Control Center</h2>
        <div className="space-y-1">
          <Link href={`/plans/${planId}/settings`}>
            <Button
              aria-label="settings"
              variant="ghost"
              className="w-full justify-start items-center gap-2 whitespace-break-spaces px-0"
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span className="md:text-left">Settings</span>
            </Button>
          </Link>
          <Link href={`/plans/${planId}/expense-tracker`}>
            <Button
              aria-label="expense tracker"
              variant="ghost"
              className="w-full justify-start items-center gap-2 whitespace-break-spaces px-0"
            >
              <DollarSignIcon className="mr-2 h-4 w-4" />
              <span className="md:text-left">Expense Tracker</span>
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
