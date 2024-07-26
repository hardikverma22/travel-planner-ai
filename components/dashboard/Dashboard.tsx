"use client";
import {NoPlans} from "@/components/dashboard/NoPlans";
import PlanCard from "@/components/dashboard/PlanCard";
import DrawerDialog from "@/components/shared/DrawerWithDialog";
import {Input} from "@/components/ui/input";
import {api} from "@/convex/_generated/api";
import {useQuery} from "convex/react";
import {Search} from "lucide-react";
import {ChangeEvent, useState} from "react";

export default function Dashboard() {
  const [searchPlanText, setSearchPlanText] = useState("");
  const plans = useQuery(api.plan.getAllPlansForAUser, {});

  const [filteredPlans, setFilteredPlans] = useState<typeof plans>();
  const finalPlans = filteredPlans ?? plans;

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchPlanText(value);
    if (!plans || !plans.length) {
      return;
    }

    if (!value) {
      setFilteredPlans(undefined);
      return;
    }

    const filteredResults = plans.filter((plan) => {
      return plan.nameoftheplace.toLowerCase().includes(value.toLowerCase());
    });

    setFilteredPlans(filteredResults);
  };

  return (
    <section
      className="bg-stone-200 w-full h-full
                flex-1 flex flex-col dark:bg-background"
    >
      <div
        className="flex justify-between gap-5 bg-stone-50 items-center
                     lg:px-20 px-7 py-4 border-b dark:bg-background sticky top-0"
      >
        <div className="relative ml-auto flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-500" />
          <Input
            id="searchPlan"
            name="searchPlan"
            onChange={handleSearch}
            value={searchPlanText}
            placeholder="Search Travel Plan..."
            type="search"
            className="w-full cursor-pointer rounded-lg bg-background pl-8 transition-colors hover:bg-accent hover:text-accent-foreground  text-muted-foreground"
            disabled={!plans || !plans.length}
          />
        </div>

        <DrawerDialog shouldOpenForCreatePlan={true} />
      </div>
      <div className="flex h-full w-full px-4 lg:px-20 flex-1">
        <div
          className="mt-5 mx-auto bg-background dark:border-2 dark:border-border/50 rounded-sm flex-1"
          style={{flex: "1 1 auto"}}
        >
          {!finalPlans || finalPlans.length === 0 ? (
            <NoPlans isLoading={!plans} />
          ) : (
            <div
              className="grid grid-cols-1 
                      md:grid-cols-2 lg:grid-cols-3
                      2xl:grid-cols-4 4xl:grid-cols-6
                      gap-5 p-10 justify-center"
            >
              {finalPlans?.map((plan) => (
                <PlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
