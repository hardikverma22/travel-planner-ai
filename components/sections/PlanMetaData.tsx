import DateRangeSelector from "@/components/common/DateRangeSelector";
import ActivityPreferences from "@/components/plan/ActivityPreferences";
import CompanionControl from "@/components/plan/CompanionControl";
import { TooltipContainer } from "@/components/shared/Toolip";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { COMPANION_PREFERENCES } from "@/lib/constants";
import { cn, getFormattedDateRange } from "@/lib/utils";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { Calendar, Eye, Send, Settings2, Users2 } from "lucide-react";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";

type PlanMetaDataProps = {
  allowEdit: boolean;
  fromDate: number | undefined;
  toDate: number | undefined;
  planId: string;
  companionId: string | undefined;
  activityPreferencesIds: string[];
  isPublished: boolean;
  isLoading: boolean;
};

const Icon_ClassName =
  "rounded-full bg-background border-2 text-white shadow-sm p-3 h-auto transition-colors duration-300";

const PlanMetaData = ({
  allowEdit,
  fromDate,
  toDate,
  planId,
  companionId,
  activityPreferencesIds,
  isPublished,
  isLoading,
}: PlanMetaDataProps) => {
  const [selectedDates, setSelectedDates] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  });
  const updateTravelDates = useMutation(api.planSettings.updateTravelDates);

  const { toast } = useToast();

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

  return (
    <article
      id="imagination"
      className={cn(
        `scroll-mt-20 
                flex gap-1 w-full justify-between items-center
                rounded-full 
                bg-blue-50/40 dark:bg-black dark:border-2 dark:border-border
                py-2 px-3 shadow-lg`,
        {
          "animate-pulse": isLoading,
        }
      )}
    >
      {allowEdit ? (
        <>
          <div className="flex gap-1 justify-end items-center">
            <DateRangeSelector
              value={selectedDates}
              onChange={onChangeTravelDates}
              forGeneratePlan={false}
              className={Icon_ClassName}
              isLoading={isLoading}
            />
            <Preferences
              activityPreferencesIds={activityPreferencesIds}
              planId={planId}
              allowEdit={allowEdit}
              isLoading={isLoading}
            />
            <Companion
              planId={planId}
              companionId={companionId}
              allowEdit={allowEdit}
              isLoading={isLoading}
            />
          </div>
          <PublishPlan
            planId={planId}
            isPublished={isPublished}
            isLoading={isLoading}
          />
        </>
      ) : (
        <div className="flex justify-between items-center w-full">
          {selectedDates?.from && selectedDates?.to && (
            <div className="flex gap-1 justify-center items-center px-2 py-3 border border-border shadow-sm select-none bg-background rounded-full">
              <Calendar className="size-4" />
              <span className="text-xs font-semibold ">
                {getFormattedDateRange(
                  selectedDates.from,
                  selectedDates.to,
                  "PP"
                )}
              </span>
            </div>
          )}

          <div className="flex gap-1 justify-end items-center">
            <Preferences
              activityPreferencesIds={activityPreferencesIds}
              planId={planId}
              allowEdit={allowEdit}
              isLoading={isLoading}
            />
            <Companion
              planId={planId}
              companionId={companionId}
              allowEdit={allowEdit}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </article>
  );
};

const PublishPlan = ({
  planId,
  isPublished,
  isLoading,
}: {
  isPublished: boolean;
  planId: string;
  isLoading: boolean;
}) => {
  const updatePlanPrivacy = useMutation(api.planSettings.updatePlanPrivacy);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const onClickChangePrivacy = async () => {
    try {
      await updatePlanPrivacy({
        planId: planId as Id<"plan">,
        isPublished: !isPublished,
      });
      toast({
        title: `Your plan has been ${isPublished ? "Unpublished" : "published"}`,
      });
    } catch (error) {
      if (error instanceof ConvexError) {
        const msg = error.data as string;
        console.log(msg);
        toast({
          title: "Incomplete Travel Plan",
          description: msg,
        });
      }
    } finally {
      setOpen(false);
    }
  };

  const publishStatusContent = isPublished ? (
    <>
      <Eye className="size-4 " />
      <span>Unpublish</span>
    </>
  ) : (
    <>
      <Send className="size-4 " />
      <span>Publish</span>
    </>
  );

  const alertText = isPublished
    ? "You're about to stop sharing your travel plan with others, "
    : "You're about to share your travel plan with others in read-only mode!";

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          disabled={isLoading}
          className="flex gap-1 justify-center items-center bg-background rounded-full text-foreground shadow-sm 
                    hover:bg-background/50 dark:border-border dark:border dark:hover:bg-background/90 border-2"
        >
          {publishStatusContent}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Travel Plan</AlertDialogTitle>
          <AlertDialogDescription>
            {alertText} Don't worry, you can change its privacy whenever you
            want.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            className="flex gap-1 justify-center items-center bg-blue-500 hover:bg-blue-600"
            size="sm"
            onClick={onClickChangePrivacy}
          >
            {publishStatusContent}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const Companion = ({
  companionId,
  planId,
  allowEdit,
  isLoading,
}: {
  companionId: string | undefined;
  planId: string;
  allowEdit: boolean;
  isLoading: boolean;
}) => {
  const [selectedCompanionId, setSelectedCompanionId] = useState(companionId);

  const updateCompanionId = useMutation(api.planSettings.updateCompanionId);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const selectedCompanion = useMemo(
    () => COMPANION_PREFERENCES.find((c) => c.id === selectedCompanionId),
    [selectedCompanionId]
  );

  useEffect(() => {
    setSelectedCompanionId(companionId);
  }, [companionId]);

  const saveCompanionId = async () => {
    if (!selectedCompanionId) return;
    await updateCompanionId({
      planId: planId as Id<"plan">,
      companionId: selectedCompanionId,
    });
    toast({
      title: `Companion saved as ${selectedCompanion?.displayName}`,
    });
    setOpen(false);
  };

  const tooltip = selectedCompanion
    ? `Travelling as ${selectedCompanion.displayName}`
    : "Select Companion";

  const icon = selectedCompanion ? (
    <selectedCompanion.icon className="size-4 text-foreground" />
  ) : (
    <Users2 className="size-4 text-foreground" />
  );
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <IconWithToolTip tooltipText={tooltip}>
          <Button
            disabled={isLoading}
            className={cn("px-3 py-2 hover:bg-background", Icon_ClassName)}
          >
            {icon}
          </Button>
        </IconWithToolTip>
      </PopoverTrigger>
      <PopoverContent className="w-fit px-5">
        <CompanionControl
          value={selectedCompanionId}
          onChange={(companionId) => {
            if (!allowEdit) return;
            setSelectedCompanionId(companionId);
          }}
          className="flex-col"
        />
        {allowEdit && (
          <Button
            className="mt-2 w-full "
            size="sm"
            onClick={saveCompanionId}
            disabled={!selectedCompanionId}
          >
            Save
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

const Preferences = ({
  activityPreferencesIds,
  allowEdit,
  planId,
  isLoading,
}: {
  activityPreferencesIds: string[];
  allowEdit: boolean;
  planId: string;
  isLoading: boolean;
}) => {
  const [selectedActivityPreferencesIds, setSelectedActivityPreferencesIds] =
    useState(activityPreferencesIds);
  const updateActivityPreferences = useMutation(
    api.planSettings.updateActivityPreferences
  );
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setSelectedActivityPreferencesIds(activityPreferencesIds);
  }, [activityPreferencesIds]);

  const saveActivityPreferences = async () => {
    if (!selectedActivityPreferencesIds.length) return;

    await updateActivityPreferences({
      planId: planId as Id<"plan">,
      activityPreferencesIds: selectedActivityPreferencesIds,
    });
    toast({
      title: `Activity Preferences Saved!`,
    });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger>
        <IconWithToolTip tooltipText="Click to see the preferences">
          <Button
            disabled={isLoading}
            className={cn("px-3 py-2 hover:bg-background", Icon_ClassName)}
          >
            <Settings2 className="size-4 text-foreground" />
          </Button>
        </IconWithToolTip>
      </PopoverTrigger>
      <PopoverContent className="w-fit px-5">
        <ActivityPreferences
          values={selectedActivityPreferencesIds}
          onChange={(ids) => {
            if (!allowEdit) return;
            setSelectedActivityPreferencesIds(ids);
          }}
          className="flex-col"
          activityClassName="w-full"
        />
        {allowEdit && (
          <Button
            className="mt-2 w-full"
            size="sm"
            onClick={saveActivityPreferences}
            disabled={!selectedActivityPreferencesIds.length}
          >
            Save
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
};

const IconWithToolTip = ({
  children,
  tooltipText,
}: {
  children: ReactNode;
  tooltipText: string;
}) => {
  return <TooltipContainer text={tooltipText}>{children}</TooltipContainer>;
};

export default PlanMetaData;
