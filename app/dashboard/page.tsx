import DrawerDialog from "@/components/DrawerDialog";
import {Loading} from "@/components/Laoding";
import PlanList from "@/components/PlanList";
import {Suspense} from "react";

export default function Dashboard() {
  return (
    <section
      className="bg-stone-200 w-full h-full
                flex-1 flex flex-col"
    >
      <div className="flex justify-between bg-white items-center shadow-lg lg:px-20 px-7 py-4 border-b">
        <span className="font-bold text-xl">Your Plans</span>
        <DrawerDialog shouldOpenForCreatePlan={true} />
      </div>
      <div className="flex h-full w-full px-4 lg:px-20 flex-1">
        <div
          className="mt-10 mx-auto bg-white rounded-sm flex-1"
          style={{flex: "1 1 auto"}}
        >
          <Suspense
            fallback={
              <div className="flex justify-center items-center flex-1 w-full h-full gap-5">
                <Loading />
                <span>Loading Plans...</span>
              </div>
            }
          >
            <PlanList />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
