import PlanList from "@/components/PlanList";
import {GiJourney} from "react-icons/gi";

export function NoPlans() {
  return (
    <div
      className="flex flex-col justify-center items-center flex-1 mt-10 py-40
                         mx-auto bg-white rounded-sm"
    >
      <p className="font-bold text-lg capitalize leading-10">
        No plans created yet!
      </p>
      <GiJourney className="text-9xl text-blue-500" />
    </div>
  );
}
