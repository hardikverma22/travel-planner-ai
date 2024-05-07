"uce client";

import {Button} from "@/components/ui/button";
import {api} from "@/convex/_generated/api";
import {useMutation} from "convex/react";
import {TrashIcon} from "lucide-react";
import {Id} from "../convex/_generated/dataModel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {useState} from "react";

type ItineraryDayHeaderProps = {
  title: string;
  planId: string;
};

export default function ItineraryDayHeader({title, planId}: ItineraryDayHeaderProps) {
  const deleteDayInItinerary = useMutation(api.plan.deleteDayInItinerary);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between mb-2 text-lg font-bold leading-2 text-gray-900 ">
      <span>{title}</span>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger>
          <Button
            asChild
            size="icon"
            variant="ghost"
            className="p-1 rounded-full"
            onClick={() => setOpen(true)}
          >
            <TrashIcon className="h-5 w-5 text-red-500" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the day from your
              Itinerary.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteDayInItinerary({planId: planId as Id<"plan">, dayName: title})}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
