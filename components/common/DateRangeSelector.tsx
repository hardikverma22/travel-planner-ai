import {Button} from "@/components/ui/button";
import {Calendar} from "@/components/ui/calendar";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {cn, getFormattedDateRange} from "@/lib/utils";
import {format, formatDate} from "date-fns";
import {CalendarIcon} from "lucide-react";
import {Dispatch, SetStateAction, useState} from "react";
import {DateRange} from "react-day-picker";

type DateRangeSelectorProps = {
  onChange: (e: DateRange | undefined) => void;
  value: DateRange | undefined;
  forGeneratePlan: boolean;
};

const DateRangeSelector = ({value, onChange, forGeneratePlan}: DateRangeSelectorProps) => {
  const [dateRangePopoverOpen, setDateRangePopoverOpen] = useState(false);

  const resetControl = () => {
    onChange({from: undefined, to: undefined});
  };

  return (
    <Popover open={dateRangePopoverOpen} onOpenChange={setDateRangePopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          size={forGeneratePlan ? "default" : "sm"}
          variant={forGeneratePlan ? "outline" : "default"}
          className={cn(
            "pl-3 text-left font-normal",
            !value && "text-muted-foreground",
            "flex justify-between",
            {"bg-foreground/50 text-background": !forGeneratePlan},
            {
              "bg-foreground": dateRangePopoverOpen && !forGeneratePlan,
            }
          )}
        >
          {value && value.from && value.to ? (
            <span className={cn({"font-semibold": !forGeneratePlan})}>
              {getFormattedDateRange(value.from, value.to)}
            </span>
          ) : (
            <span className={cn({"text-muted-foreground": forGeneratePlan})}>
              Pick Travel Dates
            </span>
          )}
          <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          month={value?.from}
          mode="range"
          numberOfMonths={2}
          max={10}
          selected={value}
          onSelect={(e) => {
            onChange(e);
            if (e?.from && e.to) {
              setDateRangePopoverOpen(false);
            }
          }}
          disabled={(date) => date < new Date("1900-01-01")}
          initialFocus
        />
        <div className="w-full flex justify-end pr-5 pb-3">
          <Button onClick={resetControl}>Reset</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
