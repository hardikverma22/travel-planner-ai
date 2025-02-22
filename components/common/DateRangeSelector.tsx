import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn, getFormattedDateRange } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

type DateRangeSelectorProps = {
  onChange: (e: DateRange | undefined) => void;
  value: DateRange | undefined;
  forGeneratePlan: boolean;
  className?: string;
  isLoading?: boolean;
};

const DateRangeSelector = ({
  value,
  onChange,
  forGeneratePlan,
  className,
  isLoading,
}: DateRangeSelectorProps) => {
  const [dateRangePopoverOpen, setDateRangePopoverOpen] = useState(false);
  const isMobile = useIsMobile();
  const resetControl = () => {
    onChange({ from: undefined, to: undefined });
  };

  return (
    <Popover open={dateRangePopoverOpen} onOpenChange={setDateRangePopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          size={forGeneratePlan ? "default" : "sm"}
          variant={forGeneratePlan ? "outline" : "link"}
          className={cn(
            {
              "pl-3 flex justify-between text-left font-normal":
                forGeneratePlan,
              "text-muted-foreground": !value,
            },
            className
          )}
          disabled={!forGeneratePlan && isLoading}
        >
          {forGeneratePlan &&
            (value && value.from && value.to ? (
              <span>{getFormattedDateRange(value.from, value.to)}</span>
            ) : (
              <span className="text-muted-foreground">Pick Travel Dates</span>
            ))}
          <CalendarIcon className={cn("h-4 w-4 text-foreground")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 touch-pan-y"
        align={isMobile ? "center" : "start"}
        side={isMobile ? "bottom" : undefined}
        collisionPadding={16}
      >
        <Calendar
          month={value?.from}
          mode="range"
          numberOfMonths={isMobile ? 1 : 2} // Responsive month count
          max={10}
          selected={value}
          onSelect={(e) => {
            onChange(e);
            console.log(e);
            if (!isMobile && e?.from && e.to) {
              setDateRangePopoverOpen(false);
            }
          }}
          disabled={(date) => date < new Date("1900-01-01")}
          initialFocus={!isMobile} // Disable auto-focus on mobile
          classNames={{
            day: "h-10 w-10 text-sm", // Larger touch targets
            cell: "py-1 px-0.5", // Better spacing
          }}
        />
        <div className="w-full flex justify-end pr-5 pb-3 gap-2">
          <Button
            onClick={resetControl}
            variant="ghost"
            size={isMobile ? "sm" : "default"}
          >
            Reset
          </Button>
          {isMobile && (
            <Button onClick={() => setDateRangePopoverOpen(false)} size="sm">
              Close
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateRangeSelector;
