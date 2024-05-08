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

import {Button} from "@/components/ui/button";
import DeletePlanButton from "./DeletePlanButtons";

export default function DangerZone({planId}: {planId: string}) {
  return (
    <div className="bg-white dark:bg-transparent rounded-md">
      <div className="border-b-2 border-gray-100 px-4 py-2 sm:px-6 md:py-3">
        <span className="text-base sm:text-lg font-base mb-4 text-red-600">Danger Zone</span>
      </div>
      <div className="p-4 sm:px-6">
        <div>
          <span className="text-neutral-500 dark:text-neutral-400 mb-4 flex text-sm sm:text-base">
            You can delete your travel plan but please be informed that it can not be recoved.
          </span>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Travel Plan</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Travel Plan</AlertDialogTitle>
                <AlertDialogDescription>
                  Please type Delete to delete this plan. After deletion, it can not be recovered.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <DeletePlanButton planId={planId} />
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
