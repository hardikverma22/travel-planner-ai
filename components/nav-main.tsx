"use client";

import { ChevronRight, FilterX, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { COMPANION_PREFERENCES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export type FiltersType = {
  companionId: string;
  location: string;
};

export function NavMain({
  initialFilters,
  onFilterChange,
}: {
  initialFilters: {
    companionId?: string;
    location?: string;
  };
  onFilterChange: (filters: FiltersType) => void;
}) {
  const [filters, setFilters] = useState<FiltersType>({
    companionId: initialFilters.companionId || "",
    location: initialFilters.location || "",
  });

  const clearFilter = useCallback(
    (filterName: keyof FiltersType) => {
      const newFilters = {
        ...filters,
        [filterName]: "",
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  const resetAllFilters = useCallback(() => {
    const newFilters = {
      companionId: "",
      location: "",
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  }, [onFilterChange]);

  const onChangeCompanionControl = useCallback(
    (companionId: string) => {
      // If the same companion is clicked again, unselect it
      const newCompanionId =
        filters.companionId === companionId ? "" : companionId;

      const newFilters = {
        ...filters,
        companionId: newCompanionId,
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
    },
    [filters, onFilterChange]
  );

  return (
    <SidebarGroup>
      <SidebarMenu>
        {/* <ActiveFiltersSection
          filters={filters}
          clearFilters={resetAllFilters}
        /> */}
        <SidebarMenuItem
        // className="mt-5"
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex h-16 gap-2 items-center">
              <span className="text-md font-bold">Filter by Companion</span>
            </div>

            {filters.companionId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-red-500 cursor-pointer"
                onClick={() => clearFilter("companionId")}
              >
                <FilterX className="h-4 w-4" />
              </Button>
            )}
          </div>
          <CompanionControl
            value={filters.companionId}
            onChange={onChangeCompanionControl}
          />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

interface Filter {
  id: string;
  label: string;
  icon?: LucideIcon;
}

const ActiveFiltersSection = ({
  filters,
  clearFilters,
}: {
  filters: {
    companionId: string;
    location: string;
  };
  clearFilters: () => void;
}) => {
  const getActiveFilterCount = (filters: {
    companionId: string;
    location: string;
  }) => {
    let count = 0;

    // Count companionId if present
    if (filters.companionId) count++;

    // Count location if present
    if (filters.location) count++;

    return count;
  };

  // Get active filters as array of objects
  const getActiveFilters = (): Filter[] => {
    const activeFilters: Filter[] = [];

    if (filters.companionId) {
      activeFilters.push({
        id: "companionId",
        icon:
          COMPANION_PREFERENCES.find((c) => c.id === filters.companionId)
            ?.icon ?? undefined,
        label:
          filters.companionId.charAt(0).toUpperCase() +
          filters.companionId.slice(1),
      });
    }

    if (filters.location) {
      activeFilters.push({
        id: "location",
        label: filters.location,
      });
    }

    return activeFilters;
  };

  const activeFilters = getActiveFilters();
  const filterCount = getActiveFilterCount(filters);

  if (filterCount === 0) {
    return null;
  }

  return (
    <Collapsible defaultOpen={false} className="group/collapsible">
      <CollapsibleTrigger asChild>
        <SidebarMenuButton tooltip="Selected Filters">
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs">
              {filterCount}
            </span>
            <span className="text-background hover:text-foreground">
              Selected Filters
            </span>
          </div>
          <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          <FilterX
            className="h-4 w-4 text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              clearFilters();
            }}
          />
        </SidebarMenuButton>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <SidebarMenuSub className="space-y-1">
          {activeFilters.map((filter) => {
            const Icon = filter.icon;
            return (
              <SidebarMenuSubItem key={filter.id}>
                <SidebarMenuSubButton className="group">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      {Icon && <Icon className="h-4 w-4" />}
                      <span className="break-keep text-sm">{filter.label}</span>
                    </div>
                  </div>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            );
          })}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};

const CompanionControl = ({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (companionId: string) => void;
}) => {
  return (
    <div
      className={cn("flex gap-2 flex-col justify-center items-center w-full")}
    >
      {COMPANION_PREFERENCES.map((companion) => (
        <label
          key={companion.id}
          className="flex-1 p-1 opacity-50 hover:opacity-100 dark:opacity-40 dark:hover:opacity-100 
                  has-[:checked]:bg-blue-50 has-[:checked]:text-foreground has-[:checked]:opacity-100
                  dark:has-[:checked]:opacity-100
                  duration-200 transition-all ease-in-out
                  cursor-pointer select-none
                  flex justify-center items-center w-full
                  bg-gray-100 dark:bg-transparent dark:border dark:border-white
                  hover:shadow-sm border-2 border-border has-[:checked]:border-0 has-[:checked]:shadow-md rounded-full"
        >
          <input
            type="radio"
            className="hidden"
            name="companion"
            checked={value == companion.id}
            onChange={(e) => {
              if (e.target.checked) {
                onChange(companion.id);
              }
            }}
          />
          <companion.icon className="w-5 h-5 pr-1" />
          <span>{companion.displayName}</span>
        </label>
      ))}
    </div>
  );
};
