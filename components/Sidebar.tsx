"use client";

import Pulse from "@/components/shared/Pulse";
import {Button} from "@/components/ui/button";
import {planSections} from "@/lib/constants";
import {cn} from "@/lib/utils";

import Link from "next/link";

import {usePathname} from "next/navigation";

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

const Sidebar = ({planState}: {planState: SidebarProps}) => {
  const pathname = usePathname();

  return (
    <div className={cn("pb-12 lg:col-span-1 col-span-full")}>
      <div className="space-y-4 py-4 sticky top-2">
        <div className="py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            {planSections.map((section) => (
              <Link href={`${pathname}#${section.id}`} key={section.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start items-center gap-2 whitespace-break-spaces"
                >
                  {section.icon}
                  <span>{section.name}</span>
                  {planState && !planState[section.id] && <Pulse />}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
