import DateRangeSelector from "@/components/common/DateRangeSelector";
import {useToast} from "@/components/ui/use-toast";
import {api} from "@/convex/_generated/api";
import {Id} from "@/convex/_generated/dataModel";
import {ACTIVITY_PREFERENCES, COMPANION_PREFERENCES} from "@/lib/constants";
import {useMutation} from "convex/react";
import {Settings2} from "lucide-react";
import {useEffect, useState} from "react";
import {DateRange} from "react-day-picker";

type PlanMetaDataProps = {
  allowEdit: boolean;
  fromDate: number | undefined;
  toDate: number | undefined;
  planId: string;
  companion: string | undefined;
  activityPreferences: string[];
};

const PlanMetaData = ({
  allowEdit,
  fromDate,
  toDate,
  planId,
  companion,
  activityPreferences,
}: PlanMetaDataProps) => {
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });

  const updateTravelDates = useMutation(api.planSettings.updateTravelDates);
  const {toast} = useToast();

  const onChangeTravelDates = async (e: DateRange | undefined) => {
    if (!e) return;
    setSelectedDates(e);
    if (e.from && e.to) {
      await updateTravelDates({
        planId: planId as Id<"plan">,
        fromDate: e.from.getTime(),
        toDate: e.to.getTime(),
      });
      toast({
        title: "Travel Dates updated Successfully",
      });
    }
  };

  useEffect(() => {
    if (!fromDate || !toDate) return;
    setSelectedDates({
      from: new Date(fromDate),
      to: new Date(toDate),
    });
  }, [fromDate, toDate]);

  if (!allowEdit) return null;

  const shouldShowPlanMetaData = companion || activityPreferences.length > 0;

  const preferences = activityPreferences.map(
    (act) => ACTIVITY_PREFERENCES.find((a) => a.id === act)!
  );

  const selectedCompanion = COMPANION_PREFERENCES.find((c) => c.id === companion);

  return (
    <div className="lg:flex hidden flex-col items-end">
      <DateRangeSelector
        value={selectedDates}
        onChange={onChangeTravelDates}
        forGeneratePlan={false}
      />

      {shouldShowPlanMetaData && (
        <div
          className="bg-foreground/70 text-white tracking-wide text-sm p-2 rounded-xl 
                flex flex-col gap-4 mt-2 transition-all duration-500 ease-in-out group w-8 hover:w-full"
        >
          <div className="flex justify-end group-hover:hidden">
            <Settings2 className="w-4 h-4" />
          </div>
          {selectedCompanion && (
            <div className="hidden group-hover:block">
              <div className="font-bold uppercase">Travelling Mode</div>
              <div className="flex gap-1 justify-start items-center">
                <selectedCompanion.icon className="h-4 w-4" />
                <span className="text-gray-200">{selectedCompanion.displayName}</span>
              </div>
            </div>
          )}
          {preferences.length > 0 && (
            <div
              className="group-hover:opacity-100 opacity-0 
                    hidden flex-col gap-2
                    transition-all duration-700 ease-in-out delay-1000 group-hover:flex"
            >
              <div className="font-bold uppercase">Activity Preferences</div>
              <div className="grid justify-start items-center grid-cols-2 gap-2">
                {preferences.map((activity, index) => (
                  <div
                    className="flex gap-1 bg-background hover:bg-background duration-300 transition-all ease-in-out select-none
                     text-foreground font-semibold rounded-full p-1 justify-start items-center"
                  >
                    <activity.icon className="h-4 w-4" />
                    <span className="" key={activity.id}>
                      {activity.displayName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlanMetaData;
