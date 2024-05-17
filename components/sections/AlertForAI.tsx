import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Loader} from "lucide-react";

const AlertForAI = ({show}: {show: boolean}) => {
  if (!show) return null;
  return (
    <Alert className="ring-1 ring-yellow-100 shadow-md">
      <Loader className="h-4 w-4 animate-spin" />
      <AlertTitle className="font-semibold tracking-wide text-yellow-700 dark:text-foreground">
        Travel Plan Insights Underway!
      </AlertTitle>
      <AlertDescription>
        Your personalized travel plan is being meticulously crafted by our advanced AI. This may
        take 1-3 minutes.
      </AlertDescription>
    </Alert>
  );
};

export default AlertForAI;
