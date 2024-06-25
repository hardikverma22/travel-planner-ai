"use client";

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
  allowEdit: boolean;
};

export default function ItineraryDayHeader({title, planId, allowEdit}: ItineraryDayHeaderProps) {
  const deleteDayInItinerary = useMutation(api.plan.deleteDayInItinerary);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex justify-between mb-2 text-lg font-bold leading-2 text-foreground ">
      <span>{title}</span>
      {allowEdit && (
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger>
            <Button
              asChild
              size="icon"
              variant="ghost"
              className="p-1 rounded-full bg-background/50"
              onClick={() => setOpen(true)}
            >
              <TrashIcon className="h-6 w-6 text-red-500 dark:text-foreground dark:hover:text-red-500 hover:scale-105 transition-all duration-300" />
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
      )}
    </div>
  );
}
