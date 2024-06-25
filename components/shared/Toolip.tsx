import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip";
import {ReactNode} from "react";

export function TooltipContainer({
  text,
  children,
  key = "randomKey",
}: {
  text: string;
  children: ReactNode;
  key?: string;
}) {
  return (
    <TooltipProvider key={key}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p className="max-w-[200px]">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
