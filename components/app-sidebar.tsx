"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiltersType, NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setOpenMobile } = useSidebar();
  // Get current filters from URL
  const getCurrentFilters = React.useCallback((): FiltersType => {
    return {
      companionId: searchParams.get("companionId") || "",

      location: searchParams.get("location") || "",
    };
  }, [searchParams]);

  const handleFilterChange = (newFilters: FiltersType) => {
    const updatedSearchParams = new URLSearchParams(searchParams.toString());

    // Handle pageNo
    updatedSearchParams.delete("pageNumber");

    // Handle companionId
    if (newFilters.companionId) {
      updatedSearchParams.set("companionId", newFilters.companionId);
    } else {
      updatedSearchParams.delete("companionId");
    }

    // Handle location
    if (newFilters.location) {
      updatedSearchParams.set("location", newFilters.location);
    } else {
      updatedSearchParams.delete("location");
    }

    // Create the new URL
    const newUrl = `${window.location.pathname}?${updatedSearchParams.toString()}`;
    setOpenMobile(false);
    // Update the URL
    router.push(newUrl);
  };

  // Get current filters from URL
  const currentFilters = getCurrentFilters();

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <NavMain
          initialFilters={currentFilters}
          onFilterChange={handleFilterChange}
        />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
